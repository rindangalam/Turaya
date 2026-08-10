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

## Sprint 6 — Homepage CMS
- **Goals**: Homepage driven by CMS sections.
- **Deliverables**: `homepage_sections` CRUD, ordering/visibility, homepage composition reading sections.
- **Tasks**: T06
- **Exit criteria**: Changing section order/visibility updates public homepage; UI code owns layout.

## Sprint 7 — Product CMS
- **Goals**: Full product lifecycle in admin.
- **Deliverables**: Products list (search/filter/sort), create/edit (draft/publish/archive), image upload via storage, product SEO fields.
- **Tasks**: T07
- **Exit criteria**: Product CRUD with upload validation; RLS enforced; audit logs written.

## Sprint 8 — Collections + Ingredients
- **Goals**: Collections and ingredient structures in admin.
- **Deliverables**: Collections CRUD + ordering/featured; categories CRUD; ingredients CRUD; note-stage mapping (top/heart/base).
- **Tasks**: T08
- **Exit criteria**: Relations consistent with DATABASE.md; UI reflects ordering.

## Sprint 9 — Gallery CMS
- **Goals**: Editorial gallery management.
- **Deliverables**: Upload/delete/reorder/categorize; alt text + caption; storage integration.
- **Tasks**: T09
- **Exit criteria**: Upload validation enforced; ordering persisted.

## Sprint 10 — Journal CMS
- **Goals**: Journal authoring.
- **Deliverables**: Posts draft/publish, categories, tags, cover image, SEO fields.
- **Tasks**: T10
- **Exit criteria**: Article lifecycle; published-only visible publicly.

## Sprint 11 — Public Website
- **Goals**: All public routes from CMS data.
- **Deliverables**: Homepage, about, philosophy, collections, products, ingredients, gallery, journal, contact (form), stores, faq, privacy, terms; `not-found`/`loading`/`error` boundaries; skeleton states.
- **Tasks**: T11
- **Exit criteria**: Every public route renders from CMS; contact form validated + rate-limited; no raw errors.

## Sprint 12 — Motion System
- **Goals**: Experience-level motion per MOTION_SYSTEM.md.
- **Deliverables**: Hero timeline (GSAP), scroll storytelling, navigation transitions, page transitions, hover/preview interactions, reduced-motion paths.
- **Tasks**: T12
- **Exit criteria**: Motion budget respected; `prefers-reduced-motion` fully functional.

## Sprint 13 — SEO
- **Goals**: Complete search metadata.
- **Deliverables**: Metadata builders, OG image generation, sitemap, robots, JSON-LD (Organization, Product, Article, Breadcrumb).
- **Tasks**: T13
- **Exit criteria**: Structured data validates; sitemap/robots correct per environment.

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
