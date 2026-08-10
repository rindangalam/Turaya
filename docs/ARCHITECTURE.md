# ARCHITECTURE — Turaya

> The architectural source of truth. Any implementation that touches structure, routing,
> data flow, or boundaries must conform to this document.
> Change control applies (see `PROJECT_RULES.md` §CHANGE CONTROL).

---

## 1. Architecture Principles

1. **RSC-first.** Server Components by default; Client Components only for interaction,
   browser APIs, local state, animation, and event handlers.
2. **Feature-oriented.** Business logic is organized by feature, not by layer.
3. **Server as the security boundary.** All mutations go through server actions /
   route handlers with server-side authorization and validation.
4. **CMS controls content, not structure.** Database drives content; application code
   drives layout and behavior.
5. **Intentional dependencies.** Every dependency passes the Dependency Rule.
6. **No duplicated logic.** Shared logic lives once in `src/services`, `src/lib`, or the owning feature.

## 2. Technology Stack (decided)

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js (App Router, latest stable) | RSC, streaming, file routing, Vercel parity |
| Language | TypeScript strict | Safety, maintainability |
| Styling | Tailwind CSS (CSS-first config) | Token-driven, consistent |
| Components | shadcn/ui primitives | Accessible base, themed via tokens |
| Animation | GSAP + Motion + Lenis | GSAP for experience-level; Motion for UI-level; Lenis for smooth scroll |
| Data | Supabase JS client (server + browser) | Single platform: Postgres, Auth, Storage, RLS |
| ORM | **None initially (decision below)** | — |
| Validation | zod | Server-side input validation |
| Tests | Vitest + Testing Library + Playwright | See `TESTING.md` |
| Package manager | npm | Available on dev machine; no lockfile conflicts |
| Deployment | Vercel + Supabase | See `DEPLOYMENT.md` |

### Decisions with rationale

- **Prisma: not used initially.** Supabase provides SQL migrations + a typed client via
  `supabase-js` and generated TypeScript types (`supabase gen types`). Introducing Prisma
  adds a second migration/ORM layer competing with Supabase's own. Revisit **only** when a
  concrete justification appears (e.g., complex relational queries in service code).
- **Realtime: not used initially.** No current requirement justifies a websocket channel.
  Enable per-feature when a real requirement exists (e.g., live admin collaboration).
- **Route Handlers + Server Actions both exist** — Server Actions for mutations,
  Route Handlers for webhooks/callbacks/file downloads and non-form GET endpoints.

## 3. Repository Structure

```
src/
  app/                      # Next.js App Router (routes only, thin)
    (public)/               # public site routes
    (admin)/                # /admin routes (behind auth+RBAC)
    api/                    # route handlers
    layout.tsx / root layout, fonts, providers
    sitemap.ts, robots.ts, manifest.ts
  components/
    ui/                     # shadcn/ui + restyled primitives
    layout/                 # header, footer, navigation, shell
    shared/                 # cross-feature presentational components
    animations/             # animation primitives (Reveal, Parallax, SplitLines, Magnetic, Cursor)
  features/
    homepage/
    products/
    collections/
    ingredients/
    gallery/
    journal/
    testimonials/
    contact/
    stores/
    admin/                  # dashboard, products admin, collections admin, ...
    auth/
  lib/
    supabase/               # clients (server/browser/middleware/service), types
    auth/                   # session helpers, guards, RBAC helpers
    validation/             # zod schemas (shared server+client)
    seo/                    # metadata builders, JSON-LD builders
    storage/                # storage helpers (buckets, upload validation)
    utils/                  # cn, formatters, slugify, etc.
  services/                 # domain services (products, collections, journal, ...)
  hooks/                    # shared client hooks
  types/                      # shared domain types (non-generated)
  proxy.ts                    # auth session refresh (Next 16 `proxy` convention; nodejs runtime)
supabase/
  migrations/               # SQL migrations (Supabase CLI)
  seed/                     # seed data scripts
docs/                       # this documentation set
skills/                     # skill definitions
```

## 4. Route Trees

### Public routes (justified set)

```
/                          # homepage — editorial brand experience
/about                     # brand introduction + story
/philosophy                # brand philosophy
/collections               # index of collections
/collections/[slug]        # collection detail (products in collection)
/products                  # fragrance index
/products/[slug]           # product editorial page
/ingredients               # ingredient stories
/gallery                   # editorial gallery
/journal                   # journal index
/journal/[slug]            # journal article
/contact                   # contact + message form
/stores                    # store locations
/faq                       # frequently asked questions
/privacy                   # privacy policy
/terms                     # terms of service
```

Additional public routes require justification (e.g., `/search`, `/lookbook`).

### Admin routes

```
/admin                     # dashboard (overview, stats, recent activity, drafts)
/admin/products            # list + filters (CRUD)
/admin/products/new        # create product
/admin/products/[id]       # edit product
/admin/collections         # collections CRUD (ordering, featured)
/admin/categories          # categories CRUD
/admin/ingredients         # ingredients CRUD
/admin/gallery             # gallery management (upload, reorder, categorize)
/admin/journal             # journal posts CRUD (draft/publish, categories, tags)
/admin/testimonials        # testimonials CRUD
/admin/stores              # store locations CRUD
/admin/messages            # contact messages inbox
/admin/seo                 # global + per-resource SEO metadata
/admin/users               # user management (admin+)
/admin/settings            # brand, contact, social, hours (admin+)
```

## 5. Server / Client Boundary

| Concern | Side |
|---|---|
| Data fetching for pages | Server (RSC) |
| Mutations | Server Actions (server) |
| Auth/session | Server (helpers in `lib/auth`) |
| Hover/preview/magnetic/custom cursor | Client |
| Scroll animation / Lenis | Client |
| Forms (interactive) | Client shells + Server Actions |
| Modals/dialogs | Client |
| Marketing/SEO metadata | Server (`generateMetadata`) |

Rules:
- Never fetch with a client-side effect when a server component can do it.
- Pass serializable props only across the boundary.
- If a component needs client hooks, keep the data fetching server-side and pass data in.

## 6. Data Access Pattern

1. **Server page/action** creates a Supabase client for the requesting user (anon or authed).
2. Query through **RLS-enforced tables** — the database is the authorization boundary.
3. Domain logic in `src/services/<domain>.ts`; pages compose services.
4. All user input passes a zod schema in the server action before touching the DB.
5. The service role client (`lib/supabase/admin.ts`) is used **only** where RLS cannot apply
   and the use is explicitly justified (e.g., confirming a user's role before impersonation-free flows).
   Prefer RLS-compatible queries.

## 7. Error Handling Pattern

- Public pages: `not-found()` for missing content; `error.tsx` boundaries; no raw DB errors.
- Server actions: return `{ ok: true, data } | { ok: false, fieldErrors, formError }` — never throw strings to the client.
- Admin: inline field errors + toast feedback; loading/empty/error states per list and form.
- Log server-side failures (audit + error log) without exposing internals.

## 8. Environment Variables

| Variable | Client-visible? | Usage |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon key (RLS-enforced client) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Never** | Server-only admin operations |
| `DATABASE_URL` / `DIRECT_URL` | **Never** | Migration/tooling only |

Validate presence at startup in dev (`lib/env.ts`).

## 9. Deployment Topology

- **Vercel**: preview per PR (from `develop`/feature branches), production from `main`.
- **Supabase**: hosted project; migrations applied via CI (Supabase CLI) or documented manual step.
- No long-lived background jobs in v1; cron/edge functions only if a requirement appears.
