-- ============================================================
-- 0002 Catalog: collections, categories, products, images,
--             collection_products, ingredients, product_ingredients
--
-- SELECT policies are split:
--   anon           -> published-only (public site)
--   authenticated  -> all rows (all authenticated users are staff;
--                     required for INSERT/UPDATE ... RETURNING to work
--                     on draft rows under RLS)
-- ============================================================

-- collections
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  story text,
  cover_image_path text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index collections_status_sort_idx on public.collections (status, sort_order);
create index collections_featured_idx on public.collections (featured);

create trigger collections_set_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

create trigger collections_audit
  after insert or update or delete on public.collections
  for each row execute function public.log_audit();

alter table public.collections enable row level security;

create policy "collections select public"
  on public.collections for select to anon
  using (status = 'published' and deleted_at is null);

create policy "collections select authenticated"
  on public.collections for select to authenticated
  using (true);

create policy "collections insert editor"
  on public.collections for insert to authenticated
  with check (public.is_editor());

create policy "collections update editor"
  on public.collections for update to authenticated
  using (public.is_editor());

create policy "collections delete editor"
  on public.collections for delete to authenticated
  using (public.is_editor());

-- categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;

create policy "categories select public"
  on public.categories for select to anon
  using (status = 'published' and deleted_at is null);

create policy "categories select authenticated"
  on public.categories for select to authenticated
  using (true);

create policy "categories insert editor"
  on public.categories for insert to authenticated
  with check (public.is_editor());

create policy "categories update editor"
  on public.categories for update to authenticated
  using (public.is_editor());

create policy "categories delete editor"
  on public.categories for delete to authenticated
  using (public.is_editor());

-- products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text,
  description text,
  story text,
  category_id uuid references public.categories (id) on delete set null,
  collection_id uuid references public.collections (id) on delete set null,
  size text,
  price numeric(10, 2),
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index products_status_idx on public.products (status);
create index products_category_idx on public.products (category_id);
create index products_collection_idx on public.products (collection_id);
create index products_featured_idx on public.products (featured);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger products_audit
  after insert or update or delete on public.products
  for each row execute function public.log_audit();

alter table public.products enable row level security;

create policy "products select public"
  on public.products for select to anon
  using (status = 'published' and deleted_at is null);

create policy "products select authenticated"
  on public.products for select to authenticated
  using (true);

create policy "products insert editor"
  on public.products for insert to authenticated
  with check (public.is_editor());

create policy "products update editor"
  on public.products for update to authenticated
  using (public.is_editor());

create policy "products delete editor"
  on public.products for delete to authenticated
  using (public.is_editor());

-- product_images
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  path text not null,
  alt text not null default '',
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index product_images_product_sort_idx on public.product_images (product_id, sort_order);

alter table public.product_images enable row level security;

create policy "product_images select public"
  on public.product_images for select to anon
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published' and p.deleted_at is null
    )
  );

create policy "product_images select authenticated"
  on public.product_images for select to authenticated
  using (true);

create policy "product_images insert editor"
  on public.product_images for insert to authenticated
  with check (public.is_editor());

create policy "product_images update editor"
  on public.product_images for update to authenticated
  using (public.is_editor());

create policy "product_images delete editor"
  on public.product_images for delete to authenticated
  using (public.is_editor());

-- collection_products
create table public.collection_products (
  collection_id uuid not null references public.collections (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (collection_id, product_id)
);

alter table public.collection_products enable row level security;

create policy "collection_products select public"
  on public.collection_products for select to anon
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.status = 'published' and c.deleted_at is null
    )
  );

create policy "collection_products select authenticated"
  on public.collection_products for select to authenticated
  using (true);

create policy "collection_products insert editor"
  on public.collection_products for insert to authenticated
  with check (public.is_editor());

create policy "collection_products update editor"
  on public.collection_products for update to authenticated
  using (public.is_editor());

create policy "collection_products delete editor"
  on public.collection_products for delete to authenticated
  using (public.is_editor());

-- ingredients
create table public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  origin text,
  description text,
  story text,
  image_path text,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger ingredients_set_updated_at
  before update on public.ingredients
  for each row execute function public.set_updated_at();

alter table public.ingredients enable row level security;

create policy "ingredients select public"
  on public.ingredients for select to anon
  using (status = 'published' and deleted_at is null);

create policy "ingredients select authenticated"
  on public.ingredients for select to authenticated
  using (true);

create policy "ingredients insert editor"
  on public.ingredients for insert to authenticated
  with check (public.is_editor());

create policy "ingredients update editor"
  on public.ingredients for update to authenticated
  using (public.is_editor());

create policy "ingredients delete editor"
  on public.ingredients for delete to authenticated
  using (public.is_editor());

-- product_ingredients (fragrance pyramid)
create table public.product_ingredients (
  product_id uuid not null references public.products (id) on delete cascade,
  ingredient_id uuid not null references public.ingredients (id) on delete cascade,
  note_stage text not null check (note_stage in ('top', 'heart', 'base')),
  position integer not null default 0,
  primary key (product_id, ingredient_id)
);

create index product_ingredients_stage_idx on public.product_ingredients (product_id, note_stage, position);

alter table public.product_ingredients enable row level security;

create policy "product_ingredients select public"
  on public.product_ingredients for select to anon
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published' and p.deleted_at is null
    )
  );

create policy "product_ingredients select authenticated"
  on public.product_ingredients for select to authenticated
  using (true);

create policy "product_ingredients insert editor"
  on public.product_ingredients for insert to authenticated
  with check (public.is_editor());

create policy "product_ingredients update editor"
  on public.product_ingredients for update to authenticated
  using (public.is_editor());

create policy "product_ingredients delete editor"
  on public.product_ingredients for delete to authenticated
  using (public.is_editor());
