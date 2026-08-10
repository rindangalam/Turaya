-- ============================================================
-- 0001 profiles + audit_logs + role/audit helpers + triggers + RLS
-- ============================================================

-- profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'editor' check (role in ('super_admin', 'admin', 'editor')),
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- audit_logs (append-only)
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  resource text not null,
  resource_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_resource_idx on public.audit_logs (resource, resource_id);
create index audit_logs_actor_created_idx on public.audit_logs (actor_id, created_at desc);

-- Role helpers (used by all RLS policies). security definer so policies
-- can read profiles regardless of row-level policies on that table.
create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('editor', 'admin', 'super_admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$;

-- Audit logging (append-only; audit_logs has no INSERT/UPDATE/DELETE policies)
create or replace function public.log_audit()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.audit_logs (actor_id, action, resource, resource_id, metadata)
  values (
    auth.uid(),
    tg_table_name || '.' || case tg_op
      when 'INSERT' then 'create'
      when 'UPDATE' then 'update'
      when 'DELETE' then 'delete'
    end,
    tg_table_name,
    case when tg_op = 'DELETE' then old.id::text else new.id::text end,
    jsonb_build_object('op', tg_op)
  );
  return coalesce(new, old);
end;
$$;

-- Role change guard: only super_admin may change roles (DB-level enforcement)
create or replace function public.protect_role_change()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if new.role is distinct from old.role and not public.is_super_admin() then
    raise exception 'only super_admin may change roles';
  end if;
  return new;
end;
$$;

-- Auto-create a profile when a new auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, display_name)
  values (new.id, 'editor', coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Triggers on profiles
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger profiles_protect_role_change
  before update on public.profiles
  for each row execute function public.protect_role_change();

create trigger profiles_audit
  after insert or update or delete on public.profiles
  for each row execute function public.log_audit();

-- RLS
alter table public.profiles enable row level security;

create policy "profiles select self"
  on public.profiles for select to authenticated
  using (id = auth.uid());

create policy "profiles select admin"
  on public.profiles for select to authenticated
  using (public.is_admin());

create policy "profiles update self"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy "profiles update admin"
  on public.profiles for update to authenticated
  using (public.is_admin());

create policy "profiles delete super_admin"
  on public.profiles for delete to authenticated
  using (public.is_super_admin());

alter table public.audit_logs enable row level security;

create policy "audit_logs select admin"
  on public.audit_logs for select to authenticated
  using (public.is_admin());
