# SKILL — SEO

## Purpose
Implement metadata, structured data, sitemap, robots per the SEO spec.

## When to Use
Any public route, metadata change, CMS SEO fields, structured data, sitemap work.

## When NOT to Use
Content quality (that's `content`), performance tooling (that's `performance`).

## Rules
1. Unique title (≤60) + description (≈150) + canonical per public page; from CMS when the resource has SEO fields.
2. Metadata via `generateMetadata` + `lib/seo` builders; never client-side.
3. JSON-LD: Organization (layout), Product, CollectionPage+Breadcrumb, Article, FAQPage — validate before release.
4. No fake reviews/offers; no offer markup without real pricing.
5. Sitemap: indexable only (no drafts/archived/admin). Robots: `noindex` outside production.
6. OG images absolute URL; OG image fallback via `/api/og` (cached).

## Workflow
1. Check `SEO.md` + feature spec for the route's schema needs.
2. Build/verify metadata + JSON-LD; add to sitemap if indexable.
3. Validate: Rich Results Test + sitemap/robots per env.

## Examples
- Product page: `generateMetadata` from `getProductBySlug` (title, description, OG from first image); JSON-LD Product with `sku: slug`, no offers.
- Journal: Article schema with `datePublished: published_at`.

## Common Mistakes
Duplicated/blank titles; relative OG URLs; drafts in sitemap; invalid JSON-LD; client-side SEO.

## Validation Checklist
- [ ] Unique metadata + canonical; OG absolute
- [ ] JSON-LD validates; no fake data
- [ ] Sitemap/robots correct per environment

## Related Documentation
`docs/SEO.md`, `docs/FEATURES.md`, `docs/ARCHITECTURE.md` §4
