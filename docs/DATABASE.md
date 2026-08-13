# DATABASE — Turaya Schema Specification

> The database source of truth. Every table defines PK, FKs, indexes, unique constraints,
> nullability, timestamps, and delete strategy. RLS policies: `SUPABASE.md`.
> Naming: `snake_case`, plural table names, `uuid` PKs, `created_at/updated_at` everywhere.

---

## 0. Conventions

- PK: `id uuid primary key default gen_random_uuid()`.
- Timestamps: `created_at timestamptz not null default now()`, `updated_at timestamptz not null default now()` — updated via trigger.
- Delete strategy: **soft delete** (`deleted_at timestamptz null`) for content entities;
  hard delete for join rows and messages marked as read-prunable.
- `status` values for content: `draft | published | archived` (CHECK constraint).
- Text: `text`; slugs: `text unique`, lowercase, `[a-z0-9-]`.
- All entities carry `seo_title`, `seo_description` columns where CMS manages SEO per resource (rationale: avoids a polymorphic join for the most common case; `seo_metadata` holds per-page meta for static routes).

## 1. Auth & Roles

### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | FK → `auth.users(id)` on delete cascade |
| `role` | text NOT NULL | CHECK in ('super_admin','admin','editor'); default 'editor' |
| `display_name` | text | nullable |
| `created_at`, `updated_at` | timestamptz | — |

- Index: none needed beyond PK (role filter is low-cardinality).
- Roles are enforced in RLS via `profiles.role`. A separate `roles`/`permissions` table is **not justified** at this scale (3 roles, no dynamic grants) — revisit if permissions become user-configurable.

### `audit_logs`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `actor_id` | uuid FK → auth.users | nullable (system events) |
| `action` | text NOT NULL | e.g. `login`, `product.create`, `product.publish` |
| `resource` | text NOT NULL | table/entity name |
| `resource_id` | text | nullable |
| `metadata` | jsonb | extra context, null default |
| `created_at` | timestamptz | — |

- Index: `(resource, resource_id)`, `(actor_id, created_at desc)`.
- Written by a DB trigger function (`log_audit`) or service code — see `SUPABASE.md` §Audit.
- Immutable: no UPDATE/DELETE policies (append-only).

## 2. Catalog

### `collections`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `name` | text NOT NULL | — |
| `slug` | text NOT NULL UNIQUE | — |
| `description` | text | editorial copy |
| `story` | text | long-form brand narrative |
| `cover_image_path` | text | storage path |
| `featured` | boolean NOT NULL default false | — |
| `sort_order` | integer NOT NULL default 0 | — |
| `status` | text NOT NULL default 'draft' | draft/published/archived |
| `seo_title`, `seo_description` | text | nullable |
| `created_at`, `updated_at`, `deleted_at` | timestamptz | — |

- Index: `(status, sort_order)`, `(featured)`.

### `categories`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `name` | text NOT NULL | e.g. `Eau de Parfum`, `Extrait` |
| `slug` | text NOT NULL UNIQUE | — |
| `description` | text | nullable |
| `sort_order` | integer default 0 | — |
| `status` | text default 'published' | — |
| `created_at`, `updated_at`, `deleted_at` | timestamptz | — |

### `products`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `name` | text NOT NULL | — |
| `slug` | text NOT NULL UNIQUE | — |
| `tagline` | text | one-line essence |
| `description` | text | editorial copy |
| `story` | text | long-form fragrance narrative |
| `category_id` | uuid FK → categories | nullable |
| `collection_id` | uuid FK → collections | nullable |
| `size` | text | e.g. `50 ml` |
| `price` | numeric(10,2) | nullable (no ecommerce v1) |
| `featured` | boolean default false | — |
| `status` | text default 'draft' | draft/published/archived |
| `seo_title`, `seo_description` | text | nullable |
| `created_at`, `updated_at`, `deleted_at` | timestamptz | — |

- Indexes: `(status)`, `(category_id)`, `(collection_id)`, `(featured)`, `(slug)`.
- Fragrance pyramid lives in `product_ingredients`.

### `product_images`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `product_id` | uuid FK → products ON DELETE CASCADE | — |
| `path` | text NOT NULL | storage path in `products/` bucket |
| `alt` | text | required for published products |
| `caption` | text | nullable |
| `sort_order` | integer default 0 | — |
| `created_at` | timestamptz | — |

- Index: `(product_id, sort_order)`.

### `collection_products`
| Column | Type | Notes |
|---|---|---|
| `collection_id` | uuid FK → collections ON DELETE CASCADE | composite PK |
| `product_id` | uuid FK → products ON DELETE CASCADE | composite PK |
| `sort_order` | integer default 0 | — |

### `ingredients`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `name` | text NOT NULL | e.g. `Amber`, `Bergamot` |
| `slug` | text NOT NULL UNIQUE | — |
| `origin` | text | provenance |
| `description` | text | sensory + factual description |
| `story` | text | narrative (may be placeholder) |
| `image_path` | text | nullable |
| `status` | text default 'published' | — |
| `sort_order` | integer default 0 | admin ordering |
| `created_at`, `updated_at`, `deleted_at` | timestamptz | — |

### `product_ingredients`
| Column | Type | Notes |
|---|---|---|
| `product_id` | uuid FK → products ON DELETE CASCADE | composite PK |
| `ingredient_id` | uuid FK → ingredients ON DELETE CASCADE | composite PK |
| `note_stage` | text NOT NULL | CHECK in ('top','heart','base') |
| `position` | integer default 0 | order within stage |

- Index: `(product_id, note_stage, position)`.

## 3. Editorial Content

### `gallery_items`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `path` | text NOT NULL | storage path in `gallery/` |
| `alt` | text NOT NULL | — |
| `caption` | text | nullable |
| `category` | text | nullable (e.g. `atelier`, `materials`, `campaign`) |
| `sort_order` | integer default 0 | — |
| `status` | text default 'published' | — |
| `created_at`, `updated_at` | timestamptz | — |

### `journal_posts`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `title` | text NOT NULL | — |
| `slug` | text NOT NULL UNIQUE | — |
| `excerpt` | text | — |
| `body` | text NOT NULL | markdown (safe renderer only) |
| `cover_image_path` | text | nullable |
| `author_id` | uuid FK → profiles | nullable |
| `category_id` | uuid FK → journal_categories | nullable |
| `status` | text default 'draft' | — |
| `published_at` | timestamptz | null until published |
| `seo_title`, `seo_description` | text | nullable |
| `created_at`, `updated_at`, `deleted_at` | timestamptz | — |

- Index: `(status, published_at desc)`.

### `journal_categories`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `name` | text NOT NULL | — |
| `slug` | text NOT NULL UNIQUE | — |
| `created_at` | timestamptz | — |

### `journal_tags`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `name` | text NOT NULL UNIQUE | — |
| `slug` | text NOT NULL UNIQUE | — |
| `created_at` | timestamptz | — |

### `post_tags`
| Column | Type | Notes |
|---|---|---|
| `post_id` | uuid FK → journal_posts ON DELETE CASCADE | composite PK |
| `tag_id` | uuid FK → journal_tags ON DELETE CASCADE | composite PK |

## 4. Community & Contact

### `testimonials`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `quote` | text NOT NULL | — |
| `author` | text NOT NULL | — |
| `title` | text | nullable (role/context) |
| `featured` | boolean default false | — |
| `status` | text default 'draft' | — |
| `sort_order` | integer default 0 | — |
| `created_at`, `updated_at` | timestamptz | — |

### `store_locations`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `name` | text NOT NULL | — |
| `address` | text NOT NULL | — |
| `city` | text NOT NULL | — |
| `country` | text NOT NULL | — |
| `phone` | text | nullable |
| `email` | text | nullable |
| `hours` | jsonb | structured hours, default '{}' |
| `sort_order` | integer default 0 | — |
| `status` | text default 'published' | — |
| `created_at`, `updated_at` | timestamptz | — |

### `faq_items`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `question` | text NOT NULL | — |
| `answer` | text NOT NULL | — |
| `category` | text | nullable |
| `sort_order` | integer default 0 | — |
| `status` | text default 'published' | — |
| `created_at`, `updated_at` | timestamptz | — |

### `contact_messages`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `name` | text NOT NULL | — |
| `email` | text NOT NULL | — |
| `subject` | text | nullable |
| `message` | text NOT NULL | — |
| `status` | text default 'new' | new/read/replied/archived |
| `created_at` | timestamptz | — |

- Index: `(status, created_at desc)`. Public INSERT only; no public SELECT.

## 5. Site Configuration

### `homepage_sections`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `name` | text NOT NULL | display name |
| `slug` | text NOT NULL UNIQUE | section key, e.g. `hero`, `intro`, `featured_collection` |
| `headline` | text | nullable |
| `subheadline` | text | nullable |
| `body` | text | nullable |
| `image_path` | text | storage path |
| `button_label` | text | nullable |
| `button_url` | text | nullable |
| `sort_order` | integer default 0 | — |
| `visible` | boolean default true | — |
| `created_at`, `updated_at` | timestamptz | — |

- Index: `(sort_order)`.
- **CMS controls content, not structure** — the set of `slug` values and their
  rendering is code; the DB orders and toggles visibility.

### `site_settings` (single settings row)
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | singleton (seeded as `00000000-0000-0000-0000-000000000001`) |
| `site_name` | text NOT NULL default 'Turaya' | brand name |
| `tagline` | text | — |
| `logo_path` | text | storage path |
| `contact_email` | text | — |
| `contact_phone` | text | — |
| `address` | text | — |
| `instagram_url` | text | full URL |
| `tiktok_url` | text | full URL |
| `whatsapp_number` | text | — |
| `announcement` | text | short banner text |
| `updated_at` | timestamptz | — |

- No `created_at`/`updated_by` (matches migration); has an audit trigger.
- UPDATE/INSERT: admin-only; DELETE: super_admin.

### `seo_metadata` (per-page)
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | — |
| `page` | text NOT NULL UNIQUE | page key, e.g. `home`, `products` |
| `title`, `description` | text | nullable |
| `canonical_url` | text | nullable |
| `og_image_path` | text | storage path |
| `robots` | text default 'index, follow' | — |
| `updated_at` | timestamptz | — |

- UPDATE/INSERT: admin-only; DELETE: super_admin.

## 6. Entity Decision Log

| Entity from spec | Decision |
|---|---|
| `users` | Supabase `auth.users` + `profiles` (no local users table) |
| `roles` / `permissions` | Not created; role enum + code enforcement is sufficient (justify before adding) |
| `media` | Not created as a global table; per-entity image rows + storage conventions (avoids premature abstraction) |
| `categories` | Created (product categorization) |
| `product_categories` | Not created; single `category_id` per product is enough for v1 |
| `homepage_sections` | Created; structure-driven by code |

## 7. Migrations Workflow

- Migrations in `supabase/migrations/` via Supabase CLI (`YYYYMMDDHHMMSS_name.sql`).
- Never hand-edit production schema; migrations are the only path.
- Type generation: `npx supabase gen types typescript` → commit as `src/lib/supabase/database.types.ts`.
