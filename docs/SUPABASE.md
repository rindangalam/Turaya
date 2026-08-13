# SUPABASE — Turaya Platform Configuration

> How Supabase is configured and used: projects, clients, RLS matrix, storage, audit,
> migrations, realtime policy. Schema details: `DATABASE.md`. Auth: `AUTH.md`. Roles: `RBAC.md`.

---

## 1. Projects & Environments

| Environment | Purpose |
|---|---|
| Hosted (`yuzsroqibdylpqihrbsh`) | Live dev project — ref `yuzsroqibdylpqihrbsh`, region `ap-southeast-1`. All migrations `0000`–`0008` + `seed.sql` applied; admin user bootstrapped. |
| Local (`supabase start`) | Optional; migrations authored locally (requires Docker) |
| Preview | Per-PR branch projects (or shared preview project) |
| Production | Live data; **never** run destructive SQL manually |

Keys: anon (client-safe), service_role (server-only), `DATABASE_URL` (tooling).
Environment validation: `src/lib/env.ts` fails fast in dev when vars are missing.
`.env.local` (gitignored) holds the three live keys. No `DATABASE_URL` needed for
the app itself.

**Remote SQL (no CLI/Docker):** the Management API `POST
https://api.supabase.com/v1/projects/{ref}/database/query` with body `{"query": "<sql>"}`
and `Authorization: Bearer <access token>`. The access token lives outside the repo
(user-owned, rotate after use) — never commit it.

## 2. Clients

| Client | Where | Key | Notes |
|---|---|---|---|
| `lib/supabase/browser.ts` | Client components | anon | RLS-enforced; sessions via cookies |
| `lib/supabase/server.ts` | Server components/actions | anon | Reads session from cookies |
| `lib/supabase/proxy.ts` | `src/proxy.ts` (Next 16 proxy, nodejs runtime) | anon | Session refresh only; returns `{ client, response }` so refreshed cookies are written onto the outgoing response |
| `lib/supabase/admin.ts` | Server only | service_role | Bypasses RLS; **restricted** to justified flows (role bootstrap, system tasks). Never imported from client code. |

All clients use `cookieEncoding: "base64url"`: Next.js strips `"` from cookie values (RFC 6265
cookie-octet), which corrupts the raw JSON session; base64url keeps values safe.
Session cookie name is `<storageKey>` where `storageKey = sb-<ref>-auth-token` and `ref` is the
first hostname label of `NEXT_PUBLIC_SUPABASE_URL` (local dev: `sb-127-auth-token`).

## 3. RLS Policy Matrix

Principle: the **database is the authorization boundary**. Client-side hiding is not authorization.

All authenticated users are staff. SELECT policies are therefore split:
`anon` sees published-only rows; `authenticated` sees **all** rows (staff must see drafts,
and `INSERT/UPDATE ... RETURNING` — used by the CMS — requires the returned row to be
visible under SELECT policies).

| Table | anon (public) | editor | admin | super_admin |
|---|---|---|---|---|
| `profiles` | — | select self, update self (non-role fields) | select all, update all | all |
| `audit_logs` | — | — | select | select (+ purge) |
| `collections` | select published | CRUD | all | all |
| `categories` | select published | CRUD | all | all |
| `products` | select published | CRUD | all | all |
| `product_images` | via published product | CRUD | all | all |
| `collection_products` | via published collection | CRUD | all | all |
| `ingredients` | select published | CRUD | all | all |
| `product_ingredients` | via published product | CRUD | all | all |
| `gallery_items` | select published | CRUD | all | all |
| `journal_posts` | select published | CRUD (own rows) | all | all |
| `journal_categories` | select | CRUD | all | all |
| `journal_tags` | select | CRUD | all | all |
| `post_tags` | via published post | CRUD | all | all |
| `testimonials` | select published | CRUD | all | all |
| `store_locations` | select published | CRUD | all | all |
| `faq_items` | select published | CRUD | all | all |
| `contact_messages` | insert (public form) | select/update (staff inbox) | +delete | all |
| `homepage_sections` | select visible=true | CRUD | all | all |
| `site_settings` | select (all fields are public contact/brand info) | — | update | all |
| `seo_metadata` | select | select | all | all |

Notes:
- "CRUD" for editors = insert/update/delete guarded by `public.is_editor()`; admin policies
  use `public.is_admin()`/`is_super_admin()`. All three are `security definer` SQL functions
  reading `profiles.role` (see migration `0001`).
- `journal_posts` writes are own-scope for editors (`author_id = auth.uid()` or null);
  admins can update/delete any post.
- Role changes are blocked at the DB level: a `protect_role_change` trigger on `profiles`
  allows role updates only for super_admin (error `P0001: only super_admin may change roles`).
- **RLS + RETURNING caveat:** with RLS enabled, `INSERT/UPDATE/DELETE ... RETURNING` requires
  the returned row to be visible under the table's SELECT policies, otherwise Postgres aborts
  with `new row violates row-level security policy`. This is why authenticated SELECT policies
  are `using (true)`. `contact_messages` has no anon SELECT policy, so the public contact form
  must use a minimal insert (supabase-js without `.select()` → `Prefer: return=minimal`).
- `audit_logs` is append-only: no INSERT/UPDATE/DELETE policies exist (trigger writes as definer).

## 4. Storage

### Buckets

| Bucket | Public? | Uploaders | Contents |
|---|---|---|---|
| `products` | public (rendered) | editor+ | product photography |
| `gallery` | public | editor+ | editorial gallery |
| `journal` | public | editor+ | post covers |
| `branding` | public | admin+ | brand assets, OG images, hero imagery |

Public buckets are read-only for anon (anon SELECT policy on `storage.objects` only).
Upload/update/delete policies check `is_editor()`/`is_admin()` by bucket
(see migration `0006`).

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
tables: products, collections, journal_posts, profiles, site_settings), plus
explicit service-side calls for login/logout/publish transitions.

| Event examples | `action` value |
|---|---|
| Login success/failure | `auth.login`, `auth.login_failed` |
| Product created | `products.create` |
| Product updated | `products.update` |
| Product archived | `products.archive` (service-side) |
| Publish/unpublish | `products.publish`, `products.unpublish` (service-side) |
| Journal post updated | `journal_posts.update` |
| Profile role change | `user.role_change` (service-side; DB trigger blocks non-super_admin) |
| Settings update | `site_settings.update` |

Trigger `action` format: `<table>.<create|update|delete>`; `resource` = table name,
`resource_id` = row id. Seed-time writes are recorded with `actor_id` NULL.

`audit_logs` is immutable and admin-readable; super_admin can purge with justification.

## 6. Realtime Policy

**Disabled by default.** No channel subscriptions unless a real requirement exists
(e.g., admin collaboration). If adopted, enforce via `postgres_changes` + RLS-filtered
subscriptions only; never subscribe with the service role from client code.

## 7. Migrations & Tooling

- CLI: `supabase link`, `supabase db push`, local `supabase start` / `supabase db reset`.
  Without local Docker/CLI, apply remote SQL via the Management API
  `/v1/projects/{ref}/database/query` (see §1). PowerShell gotcha: `Get-Content -Raw`
  output can serialize as an object in JSON bodies — build bodies with
  `[System.IO.File]::ReadAllText(...)` + `ConvertTo-Json -Compress` and post via
  `curl --data-binary @file`; keep the temp JSON file BOM-free for the auth API.
- Every migration includes its RLS policies; a migration that touches a table must
  update the policy matrix here and in `RBAC.md`.
- Migrations `0000`–`0008`: base trigger fn → profiles/audit/helpers → catalog → editorial
  → community → site → storage → grants (table/sequence/function privileges for
  `anon`/`authenticated`/`service_role` + default privileges; **required** for any API access)
  → ingredients `sort_order`.
- `supabase gen types typescript --local` committed after schema changes
  (→ `src/lib/supabase/database.types.ts`); last schema change (`ingredients.sort_order`,
  migration `0008`) was synced by hand.
- Seed script: `supabase/seed.sql` (idempotent, placeholder-marked content, safe to re-run).
- **Relationship ambiguity:** since `collection_products` exists there are two FKs between
  `products` and `collections`. Queries embedding `collections(name)` from `products` must
  disambiguate with the FK hint `collections!products_collection_id_fkey(name)`
  (`src/services/products.ts:listProducts`). Embeds from a junction table itself
  (`collection_products -> products(name)`) stay unambiguous.

## 8. Anti-Patterns (forbidden)

- Anon key used with elevated grants; service role in client bundle; RLS disabled;
  SELECT from `auth.users` publicly; storage buckets writable by anon; raw SQL string
  interpolation in queries (use the JS client / parameter binding).
