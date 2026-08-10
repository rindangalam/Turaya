# SKILL — Next.js Architecture

## Purpose
Apply Turaya's Next.js conventions: App Router structure, RSC-first boundary, routing, layouts, metadata, streaming.

## When to Use
Any task creating/editing routes, layouts, page files, route handlers, middleware, metadata, or deciding server vs client.

## When NOT to Use
Pure Supabase/DB tasks, design-token tasks, copywriting.

## Rules
1. Server Components by default; `"use client"` only for interaction, browser APIs, local state, animation, events.
2. Pages compose sections; business logic lives in `services/` + `features/`, never in `page.tsx`.
3. Route trees: public + admin only (`ARCHITECTURE.md` §4). New routes need justification.
4. Data fetching server-side; pass serializable props across boundaries.
5. Metadata via `generateMetadata` + `lib/seo` builders — never client-side SEO.
6. `loading.tsx`, `error.tsx`, `not-found.tsx` per segment where meaningful.

## Workflow
1. Read `ARCHITECTURE.md` §3–5 and `FEATURES.md` for the target page.
2. Decide RSC/CC per the boundary table.
3. Implement route/segment; wire metadata builder.
4. Define loading/error/empty states.
5. Typecheck + lint + tests.

## Examples
- Homepage: server page that fetches sections (service) and renders section components; only hero/gallery primitives are client.
- Product page: server page + client gallery/notes components receiving data as props.

## Common Mistakes
Marking whole pages client; client-side fetching when RSC can do it; giant `page.tsx`; props that are not serializable; missing boundaries.

## Validation Checklist
- [ ] Route exists in ARCHITECTURE.md tree (or decision recorded)
- [ ] Minimal client JS; RSC default
- [ ] Metadata/canonical set; states defined
- [ ] `tsc --noEmit`, lint, tests pass

## Related Documentation
`docs/ARCHITECTURE.md`, `docs/FEATURES.md`, `docs/API.md`, `docs/SEO.md`, `docs/PERFORMANCE.md`
