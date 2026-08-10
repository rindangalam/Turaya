-- ============================================================
-- 0003 Editorial: gallery_items, journal_categories,
--             journal_tags, journal_posts, post_tags
--
-- SELECT split: anon -> published-only; authenticated -> all rows.
-- journal_posts: editors write own-scope, admins manage any post.
-- ============================================================

-- gallery_items
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  alt text not null default '',
  caption text,
  category text,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gallery_items_sort_idx on public.gallery_items (sort_order);

create trigger gallery_items_set_updated_at
  before update on public.gallery_items
  for each row execute function public.set_updated_at();

alter table public.gallery_items enable row level security;

create policy "gallery_items select public"
  on public.gallery_items for select to anon
  using (status = 'published');

create policy "gallery_items select authenticated"
  on public.gallery_items for select to authenticated
  using (true);

create policy "gallery_items insert editor"
  on public.gallery_items for insert to authenticated
  with check (public.is_editor());

create policy "gallery_items update editor"
  on public.gallery_items for update to authenticated
  using (public.is_editor());

create policy "gallery_items delete editor"
  on public.gallery_items for delete to authenticated
  using (public.is_editor());

-- journal_categories
create table public.journal_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.journal_categories enable row level security;

create policy "journal_categories select all"
  on public.journal_categories for select to anon, authenticated
  using (true);

create policy "journal_categories insert editor"
  on public.journal_categories for insert to authenticated
  with check (public.is_editor());

create policy "journal_categories update editor"
  on public.journal_categories for update to authenticated
  using (public.is_editor());

create policy "journal_categories delete editor"
  on public.journal_categories for delete to authenticated
  using (public.is_editor());

-- journal_tags
create table public.journal_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.journal_tags enable row level security;

create policy "journal_tags select all"
  on public.journal_tags for select to anon, authenticated
  using (true);

create policy "journal_tags insert editor"
  on public.journal_tags for insert to authenticated
  with check (public.is_editor());

create policy "journal_tags update editor"
  on public.journal_tags for update to authenticated
  using (public.is_editor());

create policy "journal_tags delete editor"
  on public.journal_tags for delete to authenticated
  using (public.is_editor());

-- journal_posts
create table public.journal_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null,
  cover_image_path text,
  author_id uuid references public.profiles (id) on delete set null,
  category_id uuid references public.journal_categories (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index journal_posts_status_published_idx on public.journal_posts (status, published_at desc);

create trigger journal_posts_set_updated_at
  before update on public.journal_posts
  for each row execute function public.set_updated_at();

create trigger journal_posts_audit
  after insert or update or delete on public.journal_posts
  for each row execute function public.log_audit();

alter table public.journal_posts enable row level security;

create policy "journal_posts select public"
  on public.journal_posts for select to anon
  using (status = 'published' and deleted_at is null);

create policy "journal_posts select authenticated"
  on public.journal_posts for select to authenticated
  using (true);

create policy "journal_posts insert editor"
  on public.journal_posts for insert to authenticated
  with check (public.is_editor() and (author_id is null or author_id = auth.uid()));

create policy "journal_posts update editor"
  on public.journal_posts for update to authenticated
  using (public.is_editor() and (author_id is null or author_id = auth.uid()))
  with check (public.is_editor() and (author_id is null or author_id = auth.uid()));

create policy "journal_posts delete editor"
  on public.journal_posts for delete to authenticated
  using (public.is_editor() and (author_id is null or author_id = auth.uid()));

create policy "journal_posts update admin"
  on public.journal_posts for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "journal_posts delete admin"
  on public.journal_posts for delete to authenticated
  using (public.is_admin());

-- post_tags
create table public.post_tags (
  post_id uuid not null references public.journal_posts (id) on delete cascade,
  tag_id uuid not null references public.journal_tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

alter table public.post_tags enable row level security;

create policy "post_tags select public"
  on public.post_tags for select to anon
  using (
    exists (
      select 1 from public.journal_posts p
      where p.id = post_id and p.status = 'published' and p.deleted_at is null
    )
  );

create policy "post_tags select authenticated"
  on public.post_tags for select to authenticated
  using (true);

create policy "post_tags insert editor"
  on public.post_tags for insert to authenticated
  with check (public.is_editor());

create policy "post_tags update editor"
  on public.post_tags for update to authenticated
  using (public.is_editor());

create policy "post_tags delete editor"
  on public.post_tags for delete to authenticated
  using (public.is_editor());
