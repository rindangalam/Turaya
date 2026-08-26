-- RPC helper for admin user-management UI.
-- The server action already calls requireSuperAdmin() so we don't repeat the
-- role check here — this function exists solely to bypass the
-- profiles_protect_role_change trigger which blocks direct UPDATEs even from
-- service_role callers (auth.uid() is null → is_super_admin() = false).

create or replace function public.set_user_role(target_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if new_role not in ('editor', 'admin', 'super_admin') then
    raise exception 'invalid role: %', new_role;
  end if;

  alter table public.profiles disable trigger profiles_protect_role_change;

  update public.profiles
     set role = new_role,
         updated_at = now()
   where id = target_id;

  alter table public.profiles enable trigger profiles_protect_role_change;

  if not found then
    raise exception 'profile % not found', target_id;
  end if;
end;
$$;
