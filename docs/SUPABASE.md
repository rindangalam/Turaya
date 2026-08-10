# SUPABASE — Turaya Platform Configuration

> How Supabase is configured and used: projects, clients, RLS matrix, storage, audit,
> migrations, realtime policy. Schema details: `DATABASE.md`. Auth: `AUTH.md`. Roles: `RBAC.md`.

---

## 1. Projects & Environments

| Environment | Purpose |
|---|---|
| Local (`supabase start`) | Development, migrations authored locally |
| Preview | Per-PR branch projects (or shared preview project) |
| Production | Live data; **never** run destructive SQL manually |

Keys: anon (client-safe), service_role (server-only), `DATABASE_URL` (tooling).
Environment validation: `src/lib/env.ts` fails fast in dev when vars are missing.

## 2. Clients

| Client | Where | Key | Notes |
|---|---|---|---|
| `lib/supabase/browser.ts` | Client components | anon | RLS-enforced; sessions via cookies |
| `lib/supabase/server.ts` | Server components/actions | anon | Reads session from cookies |
| `lib/supabase/middleware.ts` | Edge middleware | anon | Session refresh only |
| `lib/supabase/admin.ts` | Server only | service_role | Bypasses RLS; **restricted** to justified flows (role bootstrap, system tasks). Never imported from client code. |

## 3. RLS Policy Matrix

Principle: the **database is the authorization boundary**. Client-side hiding is not authorization.

| Table | anon (public) | editor | admin | super_admin |
|---|---|---|---|---|
| `profiles` | — | select self | select all, update all | all |
| `audit_logs` | — | — | select (own org scope) | select |
| `collections` | select status='published' | CRUD own drafts+published | all | all |
| `categories` | select status='published' | CRUD | all | all |
| `products` | select status='published' | CRUD | all | all |
| `product_images` | select via published product | CRUD | all | all |
| `collection_products` | select via published collection | CRUD | all | all |
| `ingredients` | select status='published' | CRUD | all | all |
| `product_ingredients` | select via published product | CRUD | all | all |
| `gallery_items` | select status='published' | CRUD | all | all |
| `journal_posts` | select status='published' | CRUD (self or all) | all | all |
| `journal_categories` | select | CRUD | all | all |
| `journal_tags` | select | CRUD | all | all |
| `post_tags` | via published post | CRUD | all | all |
| `testimonials` | select status='published' | CRUD | all | all |
| `store_locations` | select status='published' | CRUD | all | all |
| `faq_items` | select status='published' | CRUD | all | all |
| `contact_messages` | insert (public form) | select/update (own scope) | all | all |
| `homepage_sections` | select visible=true | CRUD | all | all |
| `site_settings` | select (public fields) | — | update | all |
| `seo_metadata` | select | CRUD | all | all |

Notes:
- "CRUD" for editors = insert/update/delete with `author_id = auth.uid()` where applicable;
  admin policies are `using (true)`/`with check (true)` guarded by `profiles.role`.
- Editor policy helper: `auth.uid() in (select id from profiles where role in ('admin','super_admin','editor'))`.
- Admin helper: `role in ('admin','super_admin')`; Super Admin: `role = 'super_admin'`.
- Policies are defined as reusable SQL functions (`is_editor()`, `is_admin()`, `is_super_admin()`) to keep policy bodies readable and consistent.
- `audit_logs` is append-only: no UPDATE/DELETE policies exist.

## 4. Storage

### Buckets

| Bucket | Public? | Uploaders | Contents |
|---|---|---|---|
| `products` | public (rendered) | editor+ | product photography |
| `gallery` | public | editor+ | editorial gallery |
| `hero` | public | admin+ | hero imagery |
| `journal` | public | editor+ | post covers |
| `branding` | public | admin+ | brand assets, OG images |

Public buckets are read-only for anon (no anon upload policy). Upload/delete policies
check `is_editor()`/`is_admin()` by bucket.

### Upload validation (server-side, in storage service)

- Allowed MIME: `image/jpeg`, `image/png`, `image/webp`, `image/avif` (photos);
  `image/svg+xml` only in `branding`.
- Max size: 8 MB (photos), 2 MB (branding).
- Sanitized path: `<bucket>/<yyyy>/<mm>/<random-uuid>.<ext>` — never trust client filenames.
- Dimensions recorded at upload time when available (from `sharp` on server or client pre-check).
- All public images require `alt` at content level (enforced in UI + validation).

### URL strategy

- `getPublicUrl` for display; no public signed URLs for v1.
- Deletion: remove storage object **and** DB row in the same server action (transactional intent; log failures).

## 5. Audit Logging

Trigger-based for table mutations (`log_audit()` AFTER INSERT/UPDATE/DELETE on audited
tables: products, collections, journal_posts, users/profiles, site_settings), plus
explicit service-side calls for login/logout/publish transitions.

| Event examples | `action` value |
|---|---|
| Login success/failure | `auth.login`, `auth.login_failed` |
| Product created | `product.create` |
| Product updated | `product.update` |
| Product archived | `product.archive` |
| Publish/unpublish | `product.publish`, `product.unpublish` |
| Profile role change | `user.role_change` |
| Settings update | `settings.update` |

`audit_logs` is immutable and admin-readable; super_admin can purge with justification.

## 6. Realtime Policy

**Disabled by default.** No channel subscriptions unless a real requirement exists
(e.g., admin collaboration). If adopted, enforce via `postgres_changes` + RLS-filtered
subscriptions only; never subscribe with the service role from client code.

## 7. Migrations & Tooling

- CLI: `supabase link`, `supabase db push`, local `supabase start`.
- Every migration includes its RLS policies; a migration that touches a table must
  update the policy matrix here and in `RBAC.md`.
- `supabase gen types` committed after schema changes.
- Seed script: `supabase/seed/seed.sql` (idempotent, placeholder-marked content).

## 8. Anti-Patterns (forbidden)

- Anon key used with elevated grants; service role in client bundle; RLS disabled;
  SELECT from `auth.users` publicly; storage buckets writable by anon; raw SQL string
  interpolation in queries (use the JS client / parameter binding).
