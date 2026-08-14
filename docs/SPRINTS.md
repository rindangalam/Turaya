# SPRINTS — Turaya

> Execution plan per sprint. Each sprint lists goals, deliverables, exit criteria, and the
> tasks it depends on (IDs refer to `TASKS.md`). Sprints are sequential; a sprint is done
> only when its exit criteria pass.

---

## Sprint 0 — Discovery
- **Goals**: Confirm content reality, design direction, stack.
- **Deliverables**: Locked decisions; placeholder policy; final stack (Next.js App Router, TS strict, Tailwind, shadcn/ui, GSAP+Motion+Lenis, Supabase, npm).
- **Exit criteria**: Decisions recorded in docs; no open questions block Sprint 1.
- **Status**: ✅ Completed during the documentation phase.

## Sprint 1 — Architecture & Documentation
- **Goals**: Complete, contradiction-free documentation set; skill system.
- **Deliverables**: All docs in `docs/` + root constitutions + `skills/*`.
- **Tasks**: T01
- **Exit criteria**: Cross-check passes (docs/README §Cross-check); no implementation code.

## Sprint 2 — Design System
- **Goals**: Token-driven design foundation.
- **Deliverables**: Tailwind tokens from DESIGN_SYSTEM.md, fonts via next/font, shadcn/ui themed, motion primitives (`Reveal`, `Parallax`, `SplitLines`, `Magnetic`), reduced-motion utility.
- **Tasks**: T02
- **Exit criteria**: No hardcoded design values; contrast of token pairs verified; components render server-first.

## Sprint 3 — Supabase Database + RLS
- **Goals**: Schema, policies, buckets, seeds.
- **Deliverables**: Migrations (all tables per DATABASE.md), RLS policies per SUPABASE.md matrix, timestamps/audit triggers, storage buckets (products, gallery, hero, journal, branding), seed script with placeholder-marked content.
- **Tasks**: T03
- **Exit criteria**: RLS matrix tests pass; `supabase gen types` succeeds; seeds idempotent.

## Sprint 4 — Authentication + RBAC
- **Goals**: Auth flows and role enforcement.
- **Deliverables**: Supabase Auth (login, logout, session, password recovery), middleware session refresh, role guard helpers (`lib/auth`), admin route protection, audit of logins.
- **Tasks**: T04
- **Exit criteria**: Role matrix (RBAC.md) enforced on routes and data; E2E login flow green.

## Sprint 5 — Admin Shell
- **Goals**: Functional admin foundation.
- **Deliverables**: `/admin` layout + navigation, dashboard (overview, recent activity, content stats, drafts), messages inbox, settings + SEO pages (read/edit), toasts + list states.
- **Tasks**: T05
- **Exit criteria**: All admin routes require auth + role; lists have loading/empty/error states.
- **Status**: ✅ Completed.

## Sprint 6 — Homepage CMS
- **Goals**: Homepage driven by CMS sections.
- **Deliverables**: `homepage_sections` CRUD, ordering/visibility, homepage composition reading sections.
- **Tasks**: T06
- **Exit criteria**: Changing section order/visibility updates public homepage; UI code owns layout.
- **Status**: ✅ Completed.

## Sprint 7 — Product CMS
- **Goals**: Full product lifecycle in admin.
- **Deliverables**: Products list (search/filter/sort), create/edit (draft/publish/archive), image upload via storage, product SEO fields.
- **Tasks**: T07
- **Exit criteria**: Product CRUD with upload validation; RLS enforced; audit logs written.
- **Status**: ✅ Completed.

## Sprint 8 — Collections + Ingredients
- **Goals**: Collections and ingredient structures in admin.
- **Deliverables**: Collections CRUD + ordering/featured; categories CRUD; ingredients CRUD; note-stage mapping (top/heart/base).
- **Tasks**: T08
- **Exit criteria**: Relations consistent with DATABASE.md; UI reflects ordering.
- **Status**: ✅ Completed.

## Sprint 9 — Gallery CMS
- **Goals**: Editorial gallery management.
- **Deliverables**: Upload/delete/reorder/categorize; alt text + caption; storage integration.
- **Tasks**: T09
- **Exit criteria**: Upload validation enforced; ordering persisted.
- **Status**: ✅ Completed.

## Sprint 10 — Journal CMS
- **Goals**: Journal authoring.
- **Deliverables**: Posts draft/publish, categories, tags, cover image, SEO fields.
- **Tasks**: T10
- **Exit criteria**: Article lifecycle; published-only visible publicly.
- **Status**: ✅ Completed.

## Sprint 11 — Public Website
- **Goals**: All public routes from CMS data.
- **Deliverables**: Public route group with navigation/footer, homepage, about, philosophy, collections, products, ingredients, gallery, journal, contact (form), stores, faq, privacy, terms; `not-found`/`loading`/`error` boundaries; skeleton states.
- **Tasks**: T11
- **Exit criteria**: Every public route renders from CMS; contact form validated + rate-limited; no raw errors.
- **Status**: ✅ Completed.
  - Public services: published-only queries in `products`, `collections`, `categories`, `ingredients`, `gallery`, `journal`; new `faq`, `stores`, `testimonials`; `seo.getSeoMetadata(page)`.
  - `src/app/(public)/` route group: `layout.tsx` (announcement + `PublicNav` + `PublicFooter`), homepage moved from `src/app/page.tsx`.
  - Contact feature: `lib/validation/contact.ts`, `features/contact/actions.ts` (honeypot + in-memory 5/hour/IP rate limit), `contact-form.tsx` (useActionState).
  - Pages: `/`, `/products` (+`[slug]` with gallery, notes pyramid, related, breadcrumb), `/collections` (+`[slug]`), `/ingredients`, `/gallery` (empty state), `/journal` (+`[slug]`), `/contact`, `/about`, `/philosophy`, `/stores`, `/faq`, `/privacy`, `/terms`; group + root `not-found`, `loading`, `error`.
  - Verified: `tsc` + lint green; browser E2E of all public routes incl. category filter, empty state, mobile menu, contact submission (DB row confirmed + cleaned), 404s; admin unaffected.

## Sprint 12 — Motion System
- **Goals**: Experience-level motion per MOTION_SYSTEM.md.
- **Deliverables**: Hero timeline (GSAP), scroll storytelling, navigation transitions, page transitions, hover/preview interactions, reduced-motion paths.
- **Tasks**: T12
- **Exit criteria**: Motion budget respected; `prefers-reduced-motion` fully functional.
- **Status**: ✅ Completed.
  - `motion-provider.tsx` (replaces `lenis-provider`): registers GSAP + ScrollTrigger, syncs Lenis via `gsap.ticker` (`autoRaf:false`), `ScrollTrigger.refresh()` on route change; skipped on `prefers-reduced-motion` and on `/admin`.
  - `HeroTimeline` (L3, GSAP `matchMedia`): overline → word mask reveal (stagger 120ms) → body → CTA, `ease-luxury`, budget ≤1.2s; subtle image scale settle; CTA wrapped in `Magnetic` (≤6px, desktop only). Replaces the old hero `Reveal`/`SplitLines` composition.
  - `StoryScene` (L3, ScrollTrigger): homepage `story` section — pinned crossfade (max 3 scenes), scrub progress line, `anticipatePin`; reduced-motion renders static stacked paragraphs. Section seeded (`Kisah`, sort 2, About → 3) in `seed.sql` and applied live.
  - Navigation L1: underline reveal on desktop nav links (`after:` scale-x, 250ms) + existing mobile overlay stagger.
  - Page transitions: `(public)/template.tsx` fade + 12px rise, 350ms `ease-luxury`, interruptible; reduced-motion → instant swap (no wrapper). Uses `usePrefersReducedMotion` (live `useSyncExternalStore`), not motion's cached hook.
  - `CursorPreview`: cursor-following image preview on `/collections` cards (`data-preview-src`), desktop-only (`pointer: fine` + `lg`), spring-follow, hidden on reduced-motion/touch.
  - `MOTION` easings retyped as mutable beziers (`Bezier`) for GSAP; reduced-motion emulation via `matchMedia` override verified: no hero anim, static story, no pin/Lenis, instant transitions.
  - Verified: `tsc` + lint green; browser E2E — hero timeline settles, story pin + scrub math correct (progress 0.223 at expected scroll), mobile pin works, page transition wrapper normal/absent reduced, CursorPreview shows on `data-preview-src`, mobile menu intact, `/admin` unaffected, no new console errors.

## Sprint 13 — SEO
- **Goals**: Complete search metadata.
- **Deliverables**: Metadata builders, OG image generation, sitemap, robots, JSON-LD (Organization, Product, Article, Breadcrumb).
- **Tasks**: T13
- **Exit criteria**: Structured data validates; sitemap/robots correct per environment.
- **Status**: ✅ Completed.
  - `src/lib/seo/`: `site.ts` (`getSiteUrl`/`getAbsoluteUrl` from `NEXT_PUBLIC_SITE_URL`, dev fallback), `metadata.ts` (`buildMetadata` — canonical, OG 1200×630, Twitter summary_large_image, robots passthrough), `jsonld.ts` (Organization, Product, BreadcrumbList, CollectionPage, Article, FAQPage builders).
  - `src/services/seo.ts`: `buildPageMetadata({page, path, fallbackTitle, fallbackDescription})` merges CMS fields (title/description/canonical/og_image_path/robots) into `buildMetadata`; titles containing "Turaya" are emitted absolute to avoid the root template doubling the brand.
  - JSON-LD: Organization (root layout, from `site_settings` incl. logo/contact/sameAs); Product + BreadcrumbList on `/products/[slug]` (sku = slug, offers only when price set); CollectionPage + Breadcrumb on `/collections/[slug]`; Article + Breadcrumb on `/journal/[slug]` (datePublished = `published_at`); FAQPage on `/faq` only when ≥2 published items.
  - `src/app/sitemap.ts`: static routes + published products/collections/posts, `lastModified` from `updated_at`, excludes drafts/archived/admin.
  - `src/app/robots.ts`: preview/dev → disallow all; production → allow all + sitemap + `/admin` disallow.
  - `src/app/api/og/route.tsx`: ImageResponse brand card (noir/ivory/champagne, Cormorant Garamond + Figtree via runtime TTF fetch with module cache, `title`/`overline` query params). Note: satori requires TTF/OTF (woff2 → "Unsupported OpenType signature").
  - `NEXT_PUBLIC_SITE_URL` added to `.env.example` + `.env.local`.
  - All 16 public routes verified: unique titles, canonical, absolute OG image, robots meta; sitemap/robots correct per env; JSON-LD present on product/collection/journal pages; `/api/og` renders 1200×630 PNG.
  - Verified: `tsc` + lint green; browser E2E across every public route + detail pages; admin/login unaffected.

## Sprint 14 — Accessibility
- **Goals**: WCAG 2.2 AA audit pass.
- **Deliverables**: Keyboard/focus audit, screen-reader audit, contrast fixes, form labels, dialogs, reduced-motion verification.
- **Tasks**: T14
- **Exit criteria**: Zero critical/high issues on audit checklist (ACCESSIBILITY.md).

## Sprint 15 — Performance
- **Goals**: Performance targets.
- **Deliverables**: Image pipeline audit, JS budget, streaming, CLS fixes, Lighthouse optimization.
- **Tasks**: T15
- **Exit criteria**: LCP < 2.5s, CLS < 0.1, INP < 200ms on reference hardware.

## Sprint 16 — Testing
- **Goals**: Full automated coverage of critical paths.
- **Deliverables**: Unit suites (validation, services, utils), integration (server actions, Supabase), Playwright E2E (login, product CRUD, publish, public product page, contact form).
- **Tasks**: T16
- **Exit criteria**: All suites green in CI.

## Sprint 17 — Security Review
- **Goals**: Zero critical/high findings.
- **Deliverables**: RLS audit, auth audit, validation audit, headers, dependency audit, rate limiting check.
- **Tasks**: T17
- **Exit criteria**: SECURITY.md checklist complete; findings fixed.

## Sprint 18 — Production Preparation
- **Goals**: Shippable state.
- **Deliverables**: Env configuration, placeholder content review gate, analytics opt-in, error monitoring, final docs pass.
- **Tasks**: T18
- **Exit criteria**: Preflight checklist 100%; no placeholders in production-visible content.

## Sprint 19 — Deployment
- **Goals**: Live production.
- **Deliverables**: Vercel production deploy, Supabase production project, CI/CD pipeline, rollback plan, post-launch checklist.
- **Tasks**: T19
- **Exit criteria**: Production live; monitoring active; rollback documented.

---

## Rollover Rules
- If a sprint's exit criteria are not met, its incomplete tasks roll into the next sprint
  before new work starts (exception: documentation fixes may proceed in parallel).
