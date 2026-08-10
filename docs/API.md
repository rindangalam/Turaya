# API — Turaya Server Interfaces

> How the application exposes and mutates data: **Server Actions** for mutations,
> **Route Handlers** for webhooks/callbacks/downloads and non-form endpoints.
> This is an interface contract — implementations must conform.

---

## 1. Interface Principles

- Every mutation is a **Server Action** with: zod validation → auth/role guard →
  business logic (service) → Supabase write → audit log → typed result.
- Actions return `{ ok: true, data } | { ok: false, fieldErrors?, formError? }`.
  Never return thrown strings or raw DB errors.
- Route handlers: JSON only; validate method, content-type, size; rate-limited where needed.
- All endpoints are RLS-constrained server-side; admin endpoints require role guards.

## 2. Server Action Inventory

### Auth (`features/auth/actions.ts`)
| Action | Guard | Notes |
|---|---|---|
| `login` | — | rate-limited; audit `auth.login`/`auth.login_failed` |
| `logout` | auth | audit `auth.logout` |
| `requestPasswordReset` | — | never reveals account existence |
| `resetPassword` | auth (token) | — |

### Products (`features/admin/products/actions.ts`)
| Action | Guard |
|---|---|
| `createProduct` / `updateProduct` | editor+ |
| `archiveProduct` | editor+ (soft delete) |
| `publishProduct` / `unpublishProduct` | editor+ (audit) |
| `uploadProductImage` / `deleteProductImage` | editor+ (storage validation) |
| `deleteProduct` | admin+ (hard delete of archived only) |

### Collections / Categories / Ingredients
- `create/update/archive/deleteCollection` (editor+), `setCollectionFeatured`, `reorderCollectionProducts`
- `create/update/deleteCategory` (editor+)
- `create/update/archive/deleteIngredient` (editor+), `setProductNotes` (product_ingredients mapping)

### Gallery / Journal / Testimonials / FAQ / Stores
- Gallery: `uploadGalleryItem`, `deleteGalleryItem`, `reorderGalleryItems`, `updateGalleryItem`
- Journal: `createPost`, `updatePost`, `publishPost`, `unpublishPost`, `archivePost`, tags/categories management
- Testimonials: `create/update/archiveTestimonial`, `setFeatured`
- FAQ: `create/update/deleteFaqItem` (ordering)
- Stores: `create/update/archiveStoreLocation`

### Site
- `updateSettings` (admin+)
- `updateSeoMetadata` (admin+)
- Homepage: `updateHomepageSection`, `reorderHomepageSections`, `toggleSectionVisibility` (editor+)

### Public
- `sendContactMessage` (public; honeypot + rate limit; creates `contact_messages`)
- `updateMessageStatus` (editor+)

## 3. Route Handler Inventory

| Route | Purpose | Auth |
|---|---|---|
| `POST /api/auth/callback` (if needed) | OAuth/magic-link callback relay | — |
| `GET /api/sitemap.xml` | sitemap (or static generation) | public |
| `GET /api/og` (image) | OG image generation endpoint | public, cached |
| `POST /api/webhooks/*` | reserved (Supabase webhooks) | signature-verified |

No REST CRUD mirrors of server actions — avoid duplicate surface area.

## 4. Service Layer Contract

- `src/services/<domain>.ts` exports pure-ish functions used by actions/pages:
  e.g. `listPublishedProducts()`, `getProductBySlug(slug)`, `createProduct(input)`.
- Services never read request objects; they take validated DTOs.
- Query helpers (`listPublishedProducts`) reuse an RLS-safe server client.

## 5. Error Contract

- Client receives: `{ ok:false, fieldErrors: { [field]: string[] } }` or
  `{ ok:false, formError: string }` — human-readable, no internals.
- Server logs: full error with stack via logger; never echoed to client.
- NotFound in pages: `notFound()` (404 page) — for unpublished/archived content.

## 6. Rate Limiting & Validation Summary

| Surface | Rule |
|---|---|
| `login` | 5 attempts/15 min per email+IP |
| `sendContactMessage` | 5/hour per IP + honeypot |
| Uploads | type/size per `SUPABASE.md` §4 |
| All inputs | zod schema per action (shared `lib/validation`) |

## 7. Testing Surface

- Unit: zod schemas, services, guards.
- Integration: actions against test Supabase (RLS active), route handlers.
- E2E: login, product CRUD, publish flow, contact form (see `TESTING.md`).
