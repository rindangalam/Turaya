-- ============================================================
-- 0006 Storage buckets + object policies
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('branding',  'branding',  true),
  ('products',  'products',  true),
  ('gallery',   'gallery',   true),
  ('journal',   'journal',   true)
on conflict (id) do nothing;

-- Public read for all buckets (images are served on the public site)
create policy "storage public read"
  on storage.objects for select to anon, authenticated
  using (bucket_id in ('branding', 'products', 'gallery', 'journal'));

-- Editor+ can write to content buckets
create policy "storage editor write"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('products', 'gallery', 'journal')
    and public.is_editor()
  );

create policy "storage editor update"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('products', 'gallery', 'journal')
    and public.is_editor()
  );

create policy "storage editor delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('products', 'gallery', 'journal')
    and public.is_editor()
  );

-- Admin+ for branding (logo etc.)
create policy "storage admin branding write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'branding' and public.is_admin());

create policy "storage admin branding update"
  on storage.objects for update to authenticated
  using (bucket_id = 'branding' and public.is_admin());

create policy "storage admin branding delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'branding' and public.is_admin());
