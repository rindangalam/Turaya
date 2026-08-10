# SKILL — Supabase Storage

## Purpose
Store and serve media securely: buckets, uploads, validation, public URLs, deletion.

## When to Use
Any media upload, gallery/product/journal images, branding assets, URL handling.

## When NOT to Use
Metadata modeling (that's `DATABASE.md`), RLS policies.

## Rules
1. Buckets per `SUPABASE.md` §4: `products`, `gallery`, `hero`, `journal`, `branding`.
2. Validate server-side: MIME allowlist (jpeg/png/webp/avif; svg only branding), max 8MB photos / 2MB branding.
3. Sanitized paths: `<bucket>/<yyyy>/<mm>/<uuid>.<ext>` — never client filenames.
4. No anon uploads; policies check role per bucket.
5. Delete storage object + DB row in one server action; log failures.
6. Display via `getPublicUrl`; `next/image` with dimensions from DB; `alt` required.

## Workflow
1. Validate input (type/size) in `lib/storage`.
2. Upload to sanitized path; insert metadata row (path, alt, caption, sort_order).
3. Return typed result; audit uploads in audited tables.

## Examples
- `uploadProductImage(file, productId)`: MIME/size check → `storage.from('products').upload` → insert `product_images` → return row.
- Delete: remove object, then delete row (order matters; row is source of truth).

## Common Mistakes
Trusting client filenames/MIME; anon-writable buckets; missing alt; orphaning objects on row delete; uploading before validation.

## Validation Checklist
- [ ] MIME + size enforced; path sanitized
- [ ] No anon write policies; role-guarded uploads
- [ ] Object+row consistency; alt/caption stored
- [ ] Storage tests pass

## Related Documentation
`docs/SUPABASE.md` §4, `docs/SECURITY.md` §Uploads, `docs/API.md` §2
