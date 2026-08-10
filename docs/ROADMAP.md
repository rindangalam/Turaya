# ROADMAP — Turaya

> High-level plan from greenfield to production. Detailed breakdown: `SPRINTS.md`, `TASKS.md`.

---

## 1. Goal

Deliver a production-ready luxury perfume brand experience (public site) with a secure,
maintainable CMS admin (Super Admin / Admin / Editor) built on Next.js + Supabase —
designed, engineered, and documented as a real product.

## 2. Phases

| Phase | Sprint(s) | Deliverables | Dependencies | Risks | Acceptance criteria |
|---|---|---|---|---|---|
| **Discovery** | 0 | Content reality check, decisions on brand content, design direction, stack confirmation | — | Missing real content → placeholder policy | All decisions recorded in docs; placeholder policy approved |
| **Architecture & Docs** | 1 | Full doc set: architecture, design system, motion system, database, supabase, auth, RBAC, features, SEO, a11y, performance, security, testing, deployment, roadmap, sprints, tasks, skills | Phase 0 | Doc drift | Cross-check passes; no contradictions |
| **Design System** | 2 | Tokens (color/type/space/radius/shadow/motion), fonts, primitives, motion primitives, reduced-motion support | Phase 1 | Template feel | UI built purely from tokens; a11y contrast verified |
| **Database + RLS** | 3 | Migrations for all tables, RLS policies per role, indexes, triggers (timestamps/audit), storage buckets, seed script | Phase 1 | Policy gaps | RLS matrix test passes; service role never in client |
| **Auth + RBAC** | 4 | Supabase Auth flows, session refresh middleware, role-based guards, admin role seeding, audit of logins | Phase 3 | Session edge cases | Login/logout/recovery flows tested; roles enforced server-side |
| **Admin Shell** | 5 | `/admin` layout, navigation, dashboard overview, messages inbox shell, settings page, SEO page | Phase 4 | Dashboard bloat | All admin routes guard by role; CRUD scaffolding ready |
| **Homepage CMS** | 6 | `homepage_sections` CRUD, section ordering/visibility, dashboard integration | Phase 5 | Over-configuration | Section order/visibility drives homepage; UI code owns layout |
| **Product CMS** | 7 | Products CRUD, images upload, draft/publish/archive, search/filter/sort, product SEO metadata | Phase 5 | Image handling | Full product lifecycle; RLS enforced |
| **Collections + Ingredients** | 8 | Collections CRUD + ordering/featured; ingredients CRUD + product_ingredients mapping with note stages | Phase 7 | Data modeling drift | Collection/product/ingredient relations consistent with DATABASE.md |
| **Gallery CMS** | 9 | Gallery upload/delete/reorder/categorize/alt/caption | Phase 5 | Large media | Upload validation enforced; lightbox data ready |
| **Journal CMS** | 10 | Posts draft/publish, categories, tags, cover, SEO | Phase 5 | — | Article lifecycle + JSON-LD data ready |
| **Public Website** | 11 | All public routes, editorial homepage, product experience, gallery, contact form (server action + rate limit) | Phases 6–10 | Template feel | All routes render from CMS data; states handled |
| **Motion System** | 12 | Hero timeline, scroll storytelling, nav interactions, page transitions, reduced-motion paths | Phase 11 | Motion budget | Motion tokens used; budget respected; reduced-motion verified |
| **SEO** | 13 | Metadata builders, OG images, sitemap, robots, JSON-LD (Organization/Product/Article/Breadcrumb) | Phase 11 | Duplicate metadata | Structured data validates in Google tools |
| **Accessibility** | 14 | Full WCAG 2.2 AA audit, keyboard/focus pass, screen reader pass, contrast fixes | Phases 11–12 | Focus traps | Audit checklist zero critical/high issues |
| **Performance** | 15 | Image pipeline audit, JS budget, streaming, CLS fixes, Lighthouse targets | Phase 11 | Over-optimization | LCP < 2.5s, CLS < 0.1, INP < 200ms |
| **Testing** | 16 | Unit suite, integration tests, Playwright E2E critical flows | Phases 7–14 | Flaky E2E | All suites green in CI |
| **Security Review** | 17 | RLS audit, auth audit, input/upload validation audit, headers, dependency audit | Phase 16 | — | Zero critical/high findings |
| **Production Prep** | 18 | Env config, content review gate (no placeholders), analytics opt-in, error monitoring, docs final pass | Phase 17 | Placeholders leak | Preflight checklist 100% |
| **Deployment** | 19 | Vercel + Supabase production, CI/CD, rollback plan, post-launch checklist | Phase 18 | — | Production live; monitoring active |

## 3. Cross-Cutting Concerns (all phases)

- Accessibility and performance are evaluated from Sprint 11 onward and continuously after.
- Documentation updates are part of every sprint's Definition of Done.
- No real content: everything is placeholder-marked until provided (`CONTENT_GUIDELINES.md`).

## 4. Out of Scope (v1)

- Ecommerce checkout/payments (experience is profile-led; commerce can be a later phase).
- Multi-language rendering (structure supports future i18n; content remains English).
- Realtime collaboration, notifications, push.
