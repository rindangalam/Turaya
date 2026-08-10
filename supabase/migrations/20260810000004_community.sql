-- ============================================================
-- 0004 Community & contact: testimonials, store_locations,
--             faq_items, contact_messages
--
-- SELECT split: anon -> published-only; authenticated -> all rows.
-- contact_messages: public insert only (no SELECT for anon);
-- clients must use minimal insert (no RETURNING / no .select()).
-- ============================================================

-- testimonials
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text not null,
  title text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index testimonials_status_sort_idx on public.testimonials (status, sort_order);

create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

alter table public.testimonials enable row level security;

create policy "testimonials select public"
  on public.testimonials for select to anon
  using (status = 'published');

create policy "testimonials select authenticated"
  on public.testimonials for select to authenticated
  using (true);

create policy "testimonials insert editor"
  on public.testimonials for insert to authenticated
  with check (public.is_editor());

create policy "testimonials update editor"
  on public.testimonials for update to authenticated
  using (public.is_editor());

create policy "testimonials delete editor"
  on public.testimonials for delete to authenticated
  using (public.is_editor());

-- store_locations
create table public.store_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  country text not null,
  phone text,
  email text,
  hours jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger store_locations_set_updated_at
  before update on public.store_locations
  for each row execute function public.set_updated_at();

alter table public.store_locations enable row level security;

create policy "store_locations select public"
  on public.store_locations for select to anon
  using (status = 'published');

create policy "store_locations select authenticated"
  on public.store_locations for select to authenticated
  using (true);

create policy "store_locations insert editor"
  on public.store_locations for insert to authenticated
  with check (public.is_editor());

create policy "store_locations update editor"
  on public.store_locations for update to authenticated
  using (public.is_editor());

create policy "store_locations delete editor"
  on public.store_locations for delete to authenticated
  using (public.is_editor());

-- faq_items
create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger faq_items_set_updated_at
  before update on public.faq_items
  for each row execute function public.set_updated_at();

alter table public.faq_items enable row level security;

create policy "faq_items select public"
  on public.faq_items for select to anon
  using (status = 'published');

create policy "faq_items select authenticated"
  on public.faq_items for select to authenticated
  using (true);

create policy "faq_items insert editor"
  on public.faq_items for insert to authenticated
  with check (public.is_editor());

create policy "faq_items update editor"
  on public.faq_items for update to authenticated
  using (public.is_editor());

create policy "faq_items delete editor"
  on public.faq_items for delete to authenticated
  using (public.is_editor());

-- contact_messages (public insert only; staff read/update)
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create index contact_messages_status_created_idx on public.contact_messages (status, created_at desc);

alter table public.contact_messages enable row level security;

create policy "contact_messages insert public"
  on public.contact_messages for insert to anon, authenticated
  with check (true);

create policy "contact_messages select editor"
  on public.contact_messages for select to authenticated
  using (public.is_editor());

create policy "contact_messages update editor"
  on public.contact_messages for update to authenticated
  using (public.is_editor());

create policy "contact_messages delete admin"
  on public.contact_messages for delete to authenticated
  using (public.is_admin());
