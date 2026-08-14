-- ============================================================
-- Seed: placeholder content (idempotent; safe to re-run)
-- ============================================================

-- site_settings singleton (if empty)
insert into public.site_settings (id, site_name, tagline, contact_email, announcement)
select
  '00000000-0000-0000-0000-000000000001',
  'Turaya',
  'Aromatik dari negeri sendiri',
  'hello@turaya.id',
  'Koleksi terbaru telah hadir'
where not exists (select 1 from public.site_settings);

-- collections
insert into public.collections (id, name, slug, description, status, featured, sort_order)
select c.*
from (values
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'Koleksi Pertama', 'koleksi-pertama', 'Koleksi peluncuran Turaya.', 'published', true, 1)
) as c(id, name, slug, description, status, featured, sort_order)
where not exists (select 1 from public.collections where slug = c.slug);

-- categories
insert into public.categories (id, name, slug, description, status, sort_order)
select c.*
from (values
  ('b0000000-0000-0000-0000-000000000001'::uuid, 'Parfum', 'parfum', 'Parfum EDP Turaya.', 'published', 1),
  ('b0000000-0000-0000-0000-000000000002'::uuid, 'Home Fragrance', 'home-fragrance', 'Lilin dan aroma ruangan.', 'published', 2)
) as c(id, name, slug, description, status, sort_order)
where not exists (select 1 from public.categories where slug = c.slug);

-- products
insert into public.products (id, name, slug, tagline, description, category_id, collection_id, size, price, status, featured)
select p.*
from (values
  ('c0000000-0000-0000-0000-000000000001'::uuid,
   'Turaya No. 1', 'turaya-no-1', 'Aroma pembuka',
   'Parfum pertama Turaya.', 'b0000000-0000-0000-0000-000000000001'::uuid,
   'a0000000-0000-0000-0000-000000000001'::uuid, '50 ml', 450000.00, 'published', true)
) as p(id, name, slug, tagline, description, category_id, collection_id, size, price, status, featured)
where not exists (select 1 from public.products where slug = p.slug);

-- ingredients
insert into public.ingredients (id, name, slug, origin, description, status)
select i.*
from (values
  ('d0000000-0000-0000-0000-000000000001'::uuid, 'Kayu Cendana', 'kayu-cendana', 'Nusa Tenggara Timur', 'Aroma hangat dan lembut.', 'published'),
  ('d0000000-0000-0000-0000-000000000002'::uuid, 'Melati', 'melati', 'Jawa Barat', 'Aroma floral yang khas.', 'published'),
  ('d0000000-0000-0000-0000-000000000003'::uuid, 'Vanili', 'vanili', 'Jawa Timur', 'Aroma manis dan creamy.', 'published')
) as i(id, name, slug, origin, description, status)
where not exists (select 1 from public.ingredients where slug = i.slug);

-- product_ingredients (fragrance pyramid)
insert into public.product_ingredients (product_id, ingredient_id, note_stage, position)
select 'c0000000-0000-0000-0000-000000000001',
       'd0000000-0000-0000-0000-000000000002', 'top', 1
where not exists (
  select 1 from public.product_ingredients
  where product_id = 'c0000000-0000-0000-0000-000000000001'
    and ingredient_id = 'd0000000-0000-0000-0000-000000000002'
);

insert into public.product_ingredients (product_id, ingredient_id, note_stage, position)
select 'c0000000-0000-0000-0000-000000000001',
       'd0000000-0000-0000-0000-000000000001', 'heart', 1
where not exists (
  select 1 from public.product_ingredients
  where product_id = 'c0000000-0000-0000-0000-000000000001'
    and ingredient_id = 'd0000000-0000-0000-0000-000000000001'
);

insert into public.product_ingredients (product_id, ingredient_id, note_stage, position)
select 'c0000000-0000-0000-0000-000000000001',
       'd0000000-0000-0000-0000-000000000003', 'base', 1
where not exists (
  select 1 from public.product_ingredients
  where product_id = 'c0000000-0000-0000-0000-000000000001'
    and ingredient_id = 'd0000000-0000-0000-0000-000000000003'
);

-- journal categories + tags
insert into public.journal_categories (id, name, slug)
select c.*
from (values
  ('e0000000-0000-0000-0000-000000000001'::uuid, 'Cerita', 'cerita')
) as c(id, name, slug)
where not exists (select 1 from public.journal_categories where slug = c.slug);

insert into public.journal_tags (id, name, slug)
select t.*
from (values
  ('f0000000-0000-0000-0000-000000000001'::uuid, 'Bahan Lokal', 'bahan-lokal')
) as t(id, name, slug)
where not exists (select 1 from public.journal_tags where slug = t.slug);

-- journal post
insert into public.journal_posts (id, title, slug, excerpt, body, category_id, status, published_at)
select j.*
from (values
  ('aa000000-0000-0000-0000-000000000001'::uuid,
   'Selamat datang di Turaya', 'selamat-datang-di-turaya',
   'Perjalanan kami dimulai.',
   'Turaya lahir dari kecintaan pada aroma nusantara.',
   'e0000000-0000-0000-0000-000000000001'::uuid, 'published', now())
) as j(id, title, slug, excerpt, body, category_id, status, published_at)
where not exists (select 1 from public.journal_posts where slug = j.slug);

insert into public.post_tags (post_id, tag_id)
select 'aa000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001'
where not exists (
  select 1 from public.post_tags
  where post_id = 'aa000000-0000-0000-0000-000000000001'
    and tag_id = 'f0000000-0000-0000-0000-000000000001'
);

-- testimonials
insert into public.testimonials (id, quote, author, title, status, featured, sort_order)
select t.*
from (values
  ('ab000000-0000-0000-0000-000000000001'::uuid,
   'Aromanya benar-benar khas Nusantara.', 'Anisa P.', 'Penggemar parfum', 'published', true, 1)
) as t(id, quote, author, title, status, featured, sort_order)
where not exists (select 1 from public.testimonials where id = t.id);

-- store locations
insert into public.store_locations (id, name, address, city, country, phone, email, status, sort_order)
select s.*
from (values
  ('ac000000-0000-0000-0000-000000000001'::uuid,
   'Butik Turaya Bandung', 'Jl. Braga No. 88', 'Bandung', 'Indonesia', '+62 812-0000-0000', 'bandung@turaya.id', 'published', 1)
) as s(id, name, address, city, country, phone, email, status, sort_order)
where not exists (select 1 from public.store_locations where id = s.id);

-- FAQ
insert into public.faq_items (id, question, answer, category, status, sort_order)
select f.*
from (values
  ('ad000000-0000-0000-0000-000000000001'::uuid,
   'Apakah produk Turaya menggunakan bahan lokal?', 'Ya, seluruh aroma kami bersumber dari bahan-bahan nusantara.', 'Produk', 'published', 1)
) as f(id, question, answer, category, status, sort_order)
where not exists (select 1 from public.faq_items where id = f.id);

-- homepage sections
insert into public.homepage_sections (id, name, slug, headline, subheadline, body, button_label, button_url, sort_order, visible)
select h.*
from (values
  ('ae000000-0000-0000-0000-000000000001'::uuid, 'Hero', 'hero',
   'Aroma dari negeri sendiri', 'Parfum dan home fragrance dengan bahan lokal pilihan.',
   'Temukan koleksi kami.', 'Lihat Koleksi', '/collections', 1, true),
  ('ae000000-0000-0000-0000-000000000003'::uuid, 'Kisah', 'story',
   'Kisah di balik setiap aroma', 'Dari kampung ke meja tuang.',
   'Setiap aroma Turaya dimulai di kampung halaman para petani dan peracik.

Bahan-bahan lokal dikeringkan, disuling, dan dirayakan dengan sabar.

Dari tangan mereka, cerita itu dituang ke dalam setiap botol yang sampai ke tanganmu.', NULL, NULL, 2, true),
  ('ae000000-0000-0000-0000-000000000002'::uuid, 'About', 'about',
   'Tentang Turaya', 'Setiap aroma punya cerita.',
   'Turaya adalah rumah aroma nusantara.', NULL, NULL, 3, true)
) as h(id, name, slug, headline, subheadline, body, button_label, button_url, sort_order, visible)
where not exists (select 1 from public.homepage_sections where slug = h.slug);

-- seo_metadata
insert into public.seo_metadata (id, page, title, description)
select s.*
from (values
  ('af000000-0000-0000-0000-000000000001'::uuid, 'home', 'Turaya — Aroma dari negeri sendiri', 'Parfum dan home fragrance nusantara.'),
  ('af000000-0000-0000-0000-000000000002'::uuid, 'collections', 'Koleksi — Turaya', 'Koleksi parfum dan home fragrance Turaya.'),
  ('af000000-0000-0000-0000-000000000003'::uuid, 'journal', 'Journal — Turaya', 'Cerita dan artikel dari Turaya.')
) as s(id, page, title, description)
where not exists (select 1 from public.seo_metadata where page = s.page);
