# TASKS — Turaya

> Task breakdown per sprint. Format follows the Task System (Section 62):
> ID, Objective, Scope, Dependencies, Files, Acceptance Criteria, Testing, Documentation.
> Sprint-level context lives in `SPRINTS.md`.

---

## T01 — Documentation Set (Sprint 1)
- **Objective**: Produce the complete, contradiction-free documentation set.
- **Scope**: All root constitutions, `docs/*`, skills; git init; `.gitignore`; `.env.example`.
- **Dependencies**: Sprint 0 decisions.
- **Files**: `AGENT.md`, `SKILL.md`, `PROJECT_RULES.md`, `PROJECT_CONTEXT.md`, `docs/*`, `skills/*`, `.env.example`, `.gitignore`
- **Acceptance criteria**: Cross-check passes (see `docs/README.md` §Cross-check); no application code.
- **Testing**: Manual cross-reference review.
- **Documentation**: This task's output IS the documentation.

## T02 — Design System Implementation (Sprint 2)
- **Objective**: Token-driven design foundation in code.
- **Scope**: Tailwind tokens, fonts, shadcn/ui theming, motion primitives, reduced-motion utility.
- **Dependencies**: T01.
- **Files**: `src/app/globals.css`, `src/app/layout.tsx`, `tailwind.config`, `src/components/animations/*`, `src/components/ui/*`
- **Acceptance criteria**: Tokens match DESIGN_SYSTEM.md; no hardcoded values in new code; contrast verified.
- **Testing**: Visual review; contrast check script.
- **Documentation**: DESIGN_SYSTEM.md updated if tokens evolve.

## T03 — Database Migrations + RLS (Sprint 3)
- **Objective**: Schema per DATABASE.md with RLS per SUPABASE.md matrix.
- **Scope**: All tables, indexes, constraints, triggers, buckets, seeds.
- **Dependencies**: T01.
- **Files**: `supabase/migrations/*`, `supabase/seed/*`
- **Acceptance criteria**: RLS matrix tests pass; `supabase gen types` succeeds; seeds idempotent.
- **Testing**: SQL policy tests; role-based query tests.
- **Documentation**: DATABASE.md, SUPABASE.md.

## T04 — Auth + RBAC (Sprint 4)
- **Objective**: Supabase Auth flows + role enforcement.
- **Scope**: Login/logout/session/recovery, middleware refresh, guards, audit logins.
- **Dependencies**: T03.
- **Files**: `src/lib/auth/*`, `src/middleware.ts`, `src/features/auth/*`
- **Acceptance criteria**: RBAC matrix enforced on routes; no role-based data leaks.
- **Testing**: Playwright login flow; unit tests for guards.
- **Documentation**: AUTH.md, RBAC.md.

## T05 — Admin Shell (Sprint 5)
- **Objective**: Functional admin foundation.
- **Scope**: Layout, nav, dashboard, messages, settings, SEO pages, list states.
- **Dependencies**: T04.
- **Files**: `src/app/(admin)/*`, `src/features/admin/*`
- **Acceptance criteria**: Role-guarded routes; loading/empty/error states everywhere.
- **Testing**: Role-based route tests; E2E admin access.
- **Documentation**: FEATURES.md (admin).

## T06 — Homepage CMS (Sprint 6)
- **Objective**: Homepage composed from `homepage_sections`.
- **Scope**: Section CRUD, ordering, visibility.
- **Dependencies**: T05.
- **Files**: `src/features/homepage/*`, `src/features/admin/homepage/*`
- **Acceptance criteria**: Ordering/visibility changes render publicly.
- **Testing**: Integration tests for section queries.
- **Documentation**: FEATURES.md, DATABASE.md (if schema changes).

## T07 — Product CMS (Sprint 7)
- **Objective**: Full product lifecycle.
- **Scope**: CRUD, draft/publish/archive, images, SEO fields, search/filter/sort.
- **Dependencies**: T05.
- **Files**: `src/features/products/*`, `src/features/admin/products/*`
- **Acceptance criteria**: Lifecycle complete; upload validation; audit logs written.
- **Testing**: Unit (validation), integration (actions), E2E (publish flow).
- **Documentation**: FEATURES.md, SUPABASE.md (storage usage).

## T08 — Collections + Ingredients CMS (Sprint 8)
- **Objective**: Collections/categories/ingredients management.
- **Scope**: CRUD + ordering/featured + note-stage mapping.
- **Dependencies**: T07.
- **Files**: `src/features/collections/*`, `src/features/ingredients/*`, admin equivalents
- **Acceptance criteria**: Relations match DATABASE.md; ordering respected in UI.
- **Testing**: Integration tests for relations.
- **Documentation**: DATABASE.md, FEATURES.md.

## T09 — Gallery CMS (Sprint 9)
- **Objective**: Editorial gallery management.
- **Scope**: Upload/delete/reorder/categorize, alt/caption.
- **Dependencies**: T05.
- **Files**: `src/features/gallery/*`, `src/features/admin/gallery/*`
- **Acceptance criteria**: Upload validation enforced; ordering persisted.
- **Testing**: Storage integration tests.
- **Documentation**: SUPABASE.md (storage), FEATURES.md.

## T10 — Journal CMS (Sprint 10)
- **Objective**: Journal authoring.
- **Scope**: Posts draft/publish, categories, tags, cover, SEO.
- **Dependencies**: T05.
- **Files**: `src/features/journal/*`, `src/features/admin/journal/*`
- **Acceptance criteria**: Published-only visible publicly; SEO fields stored.
- **Testing**: E2E publish flow.
- **Documentation**: FEATURES.md, SEO.md.

## T11 — Public Website (Sprint 11)
- **Objective**: All public routes from CMS data.
- **Scope**: All routes in ARCHITECTURE.md §4; boundaries; contact form.
- **Dependencies**: T06–T10.
- **Files**: `src/app/(public)/*`, `src/features/*`
- **Acceptance criteria**: Every route renders from CMS; no raw errors; states handled.
- **Testing**: E2E per route; a11y smoke.
- **Documentation**: FEATURES.md, SEO.md.

## T12 — Motion System (Sprint 12)
- **Objective**: Experience-level motion per MOTION_SYSTEM.md.
- **Scope**: Hero, storytelling, navigation, page transitions, hover previews, reduced motion.
- **Dependencies**: T11.
- **Files**: `src/components/animations/*`, feature-level animation components
- **Acceptance criteria**: Budget respected; reduced-motion functional.
- **Testing**: Manual visual; reduced-motion emulation tests.
- **Documentation**: MOTION_SYSTEM.md.

## T13 — SEO (Sprint 13)
- **Objective**: Complete search metadata.
- **Scope**: Metadata builders, OG images, sitemap, robots, JSON-LD.
- **Dependencies**: T11.
- **Files**: `src/lib/seo/*`, `src/app/sitemap.ts`, `src/app/robots.ts`
- **Acceptance criteria**: Structured data validates; env-correct robots/sitemap.
- **Testing**: Validator checks (schema.org, Google).
- **Documentation**: SEO.md.

## T14 — Accessibility Pass (Sprint 14)
- **Objective**: WCAG 2.2 AA audit pass.
- **Scope**: Keyboard/focus, screen reader, contrast, forms, dialogs, reduced motion.
- **Dependencies**: T11–T12.
- **Files**: across public + admin surfaces
- **Acceptance criteria**: Zero critical/high audit issues.
- **Testing**: a11y audit checklist; axe runs in CI.
- **Documentation**: ACCESSIBILITY.md.

## T15 — Performance Pass (Sprint 15)
- **Objective**: LCP/CLS/INP targets.
- **Scope**: Images, JS budget, streaming, CLS fixes.
- **Dependencies**: T11.
- **Files**: across app; `src/lib/seo` metadata images
- **Acceptance criteria**: Targets met on reference hardware.
- **Testing**: Lighthouse CI thresholds.
- **Documentation**: PERFORMANCE.md.

## T16 — Testing Suite (Sprint 16)
- **Objective**: Full automated coverage.
- **Scope**: Unit, integration, E2E per TESTING.md.
- **Dependencies**: T03–T13.
- **Files**: `src/**/*.test.*`, `e2e/*`
- **Acceptance criteria**: All suites green in CI.
- **Testing**: The suite itself.
- **Documentation**: TESTING.md.

## T17 — Security Review (Sprint 17)
- **Objective**: Zero critical/high findings.
- **Scope**: RLS/auth/validation/uploads/headers/deps audit.
- **Dependencies**: T16.
- **Files**: any affected by findings
- **Acceptance criteria**: SECURITY.md checklist complete.
- **Testing**: Manual audit + automated scans.
- **Documentation**: SECURITY.md.

## T18 — Production Preparation (Sprint 18)
- **Objective**: Shippable state.
- **Scope**: Env config, placeholder gate, analytics opt-in, monitoring, docs final pass.
- **Dependencies**: T17.
- **Files**: `.env*`, `src/lib/env.ts`, monitoring config
- **Acceptance criteria**: Preflight 100%; no placeholders in production content.
- **Testing**: Preflight checklist run.
- **Documentation**: DEPLOYMENT.md.

## T19 — Deployment (Sprint 19)
- **Objective**: Live production.
- **Scope**: Vercel + Supabase prod, CI/CD, rollback plan.
- **Dependencies**: T18.
- **Files**: CI workflow, deployment configs
- **Acceptance criteria**: Production live; monitoring active.
- **Testing**: Post-launch checklist.
- **Documentation**: DEPLOYMENT.md.
