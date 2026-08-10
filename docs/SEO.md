# SEO — Turaya Search Strategy

> Metadata, structured data, sitemap/robots, and CMS integration for search quality.

---

## 1. Principles

- Every public page: unique `title` (≤ 60 chars), `description` (≈ 150 chars), canonical URL.
- Titles/descriptions come from CMS where the resource has SEO fields (`DATABASE.md` §1),
  with code fallbacks per route.
- One canonical origin: the public site URL (never index `/admin`).
- No duplicate content across slugs; slugs unique per table.
- Structured data must validate (`schema.org` + Rich Results Test) before release.

## 2. Metadata Builders (`src/lib/seo`)

- `buildMetadata({ title, description, path, ogImage, robots })` — used by every
  `generateMetadata`; default OG size 1200×630.
- Route defaults: homepage, section pages, resource pages (product/collection/post).
- `alternates.canonical` always set.

## 3. OpenGraph & Twitter

- OG: `og:title`, `og:description`, `og:image` (absolute URL), `og:type`
  (`website` / `article` / `product`), `og:url`.
- Twitter: summary_large_image.
- OG image source priority: resource `og_image` → cover image → brand default
  (generated via `/api/og` with brand typography, cached).

## 4. Structured Data (JSON-LD)

| Schema | Where |
|---|---|
| `Organization` | Root layout (name, logo, url, contact) |
| `Product` | `/products/[slug]` (name, description, image, sku = slug; omit offers when no price) |
| `CollectionPage` + `BreadcrumbList` | `/collections/[slug]` |
| `Article` | `/journal/[slug]` (headline, author, datePublished = `published_at`) |
| `BreadcrumbList` | Product, collection, journal routes |
| `FAQPage` | `/faq` (from CMS items; only if ≥ 2 entries) |

No fake reviews/ratings; no offer markup without real pricing.

## 5. Sitemap & Robots

- `src/app/sitemap.ts`: homepage + published collections + published products + published
  journal + gallery + static pages, lastModified from `updated_at`. Excludes drafts/archived/admin.
- `src/app/robots.ts`: production → allow all, sitemap URL; preview/dev → `noindex` (per `VERCEL_ENV`).

## 6. CMS Integration

- Admin SEO page + per-resource SEO fields (`FEATURES.md` A6).
- CMS can set: title, description, og image, canonical override, robots per resource.
- Placeholder fields carry `[PLACEHOLDER]` marker; production gate blocks placeholder
  titles/descriptions from publishing (Sprint 18).

## 7. Technical Requirements

- SSR/SSG renders metadata server-side; no client-side SEO.
- `next/font` with `display: swap`; no LCP-blocking fonts.
- Images: descriptive `alt`; filename slugs optional; `next/image` with explicit dimensions.
- Perf prerequisites (LCP/CLS/INP) in `PERFORMANCE.md` — they are SEO signals.

## 8. Validation Checklist

- [ ] Unique titles/descriptions on every public route (script check)
- [ ] Canonical correct per environment
- [ ] JSON-LD validates (Organization, Product, Article, Breadcrumb, FAQ)
- [ ] Sitemap lists only indexable URLs; robots correct per env
- [ ] OG renders and links correct
- [ ] No admin/draft URLs indexable
