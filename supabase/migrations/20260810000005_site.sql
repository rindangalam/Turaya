-- ============================================================
-- 0005 Site: homepage_sections, site_settings, seo_metadata
-- ============================================================

-- homepage_sections
create table public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  headline text,
  subheadline text,
  body text,
  image_path text,
  button_label text,
  button_url text,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index homepage_sections_sort_idx on public.homepage_sections (sort_order);

create trigger homepage_sections_set_updated_at
  before update on public.homepage_sections
  for each row execute function public.set_updated_at();

alter table public.homepage_sections enable row level security;

create policy "homepage_sections select public"
  on public.homepage_sections for select to anon
  using (visible = true);

create policy "homepage_sections select authenticated"
  on public.homepage_sections for select to authenticated
  using (true);

create policy "homepage_sections insert editor"
  on public.homepage_sections for insert to authenticated
  with check (public.is_editor());

create policy "homepage_sections update editor"
  on public.homepage_sections for update to authenticated
  using (public.is_editor());

create policy "homepage_sections delete editor"
  on public.homepage_sections for delete to authenticated
  using (public.is_editor());

-- site_settings (contact/brand info; single settings singleton)
create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Turaya',
  tagline text,
  logo_path text,
  contact_email text,
  contact_phone text,
  address text,
  instagram_url text,
  tiktok_url text,
  whatsapp_number text,
  announcement text,
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

create trigger site_settings_audit
  after insert or update or delete on public.site_settings
  for each row execute function public.log_audit();

alter table public.site_settings enable row level security;

create policy "site_settings select public"
  on public.site_settings for select to anon, authenticated
  using (true);

create policy "site_settings update admin"
  on public.site_settings for update to authenticated
  using (public.is_admin());

create policy "site_settings insert admin"
  on public.site_settings for insert to authenticated
  with check (public.is_admin());

create policy "site_settings delete super_admin"
  on public.site_settings for delete to authenticated
  using (public.is_super_admin());

-- seo_metadata
create table public.seo_metadata (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  title text,
  description text,
  canonical_url text,
  og_image_path text,
  robots text default 'index, follow',
  updated_at timestamptz not null default now(),
  unique (page)
);

create trigger seo_metadata_set_updated_at
  before update on public.seo_metadata
  for each row execute function public.set_updated_at();

alter table public.seo_metadata enable row level security;

create policy "seo_metadata select public"
  on public.seo_metadata for select to anon, authenticated
  using (true);

create policy "seo_metadata insert admin"
  on public.seo_metadata for insert to authenticated
  with check (public.is_admin());

create policy "seo_metadata update admin"
  on public.seo_metadata for update to authenticated
  using (public.is_admin());

create policy "seo_metadata delete super_admin"
  on public.seo_metadata for delete to authenticated
  using (public.is_super_admin());
