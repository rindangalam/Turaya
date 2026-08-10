# Documentation Index — Turaya

> How to navigate this documentation set. Source-of-truth priority:
> **PROJECT_RULES.md → AGENT.md → ARCHITECTURE.md → feature specs → DATABASE.md →
> DESIGN_SYSTEM.md → MOTION_SYSTEM.md → task specs → existing code.**

---

## 1. Reading Order

| Step | Doc | Why |
|---|---|---|
| 1 | `../PROJECT_CONTEXT.md` | Who Turaya is; placeholder policy |
| 2 | `../PROJECT_RULES.md` | MUST/SHOULD/MAY/MUST NOT rules |
| 3 | `../AGENT.md` | Engineering constitution + implementation protocol |
| 4 | `../SKILL.md` | Skill system usage |
| 5 | `ARCHITECTURE.md` | Structure, routes, boundaries, decisions |
| 6 | Domain docs (below) | As the task requires |

## 2. Document Map

| Doc | Content | Read before |
|---|---|---|
| `ARCHITECTURE.md` | Structure, routes, stack decisions, data access | Any code task |
| `DATABASE.md` | Tables, constraints, migrations | Any DB/schema task |
| `SUPABASE.md` | Clients, RLS matrix, storage, audit, realtime | Any Supabase task |
| `AUTH.md` / `RBAC.md` | Auth flows; role matrices | Auth/admin tasks |
| `API.md` | Server actions + route handler contract | Any mutation/endpoint |
| `FEATURES.md` | Per-page specs + states | Any page/feature task |
| `DESIGN_SYSTEM.md` | Tokens, type, color, components | Any UI task |
| `MOTION_SYSTEM.md` | Motion tokens, levels, budget, reduced-motion | Any animation task |
| `SEO.md` / `ACCESSIBILITY.md` / `PERFORMANCE.md` / `SECURITY.md` | Quality specs + checklists | Any release-quality task |
| `TESTING.md` | Test strategy and gates | Any feature implementation |
| `DEPLOYMENT.md` | Envs, CI/CD, rollback, go-live | Deployment tasks |
| `CODE_STYLE.md` | Conventions, dependency rule, review gate | Any code task |
| `CONTENT_GUIDELINES.md` | Placeholder policy, copy standards | Any content/seed task |
| `ROADMAP.md` / `SPRINTS.md` / `TASKS.md` | Phases, sprints, task breakdown | Planning/status |

## 3. Cross-Check Protocol

Run before every sprint close and after schema/motion/design changes:

1. **Rules conformance**: every MUST in `PROJECT_RULES.md` has a home doc; no doc contradicts a MUST.
2. **Schema consistency**: `DATABASE.md` tables ↔ `SUPABASE.md` RLS matrix ↔ `RBAC.md` permissions — every table has policies; every role's row access matches RBAC.
3. **Route consistency**: `ARCHITECTURE.md` routes ↔ `FEATURES.md` specs ↔ `SEO.md` metadata requirements.
4. **Token consistency**: `DESIGN_SYSTEM.md` tokens ↔ `MOTION_SYSTEM.md` tokens ↔ `FEATURES.md` interactions.
5. **Plan consistency**: `TASKS.md` tasks ↔ `SPRINTS.md` exit criteria ↔ `ROADMAP.md` phases.
6. **No stale decisions**: decision log entries (below) still accurate.

Result is recorded in the sprint report; contradictions are fixed in place.

## 4. Decision Log

| Date | Decision | Doc |
|---|---|---|
| Sprint 0 | Placeholder content policy; docs before code | `CONTENT_GUIDELINES.md` |
| Sprint 0 | npm as package manager | `CODE_STYLE.md` |
| Sprint 0 | Design direction: warm neutrals + bronze; Cormorant Garamond + Manrope | `DESIGN_SYSTEM.md` |
| Sprint 0 | Prisma not used initially; Supabase SQL + generated types | `ARCHITECTURE.md` §2 |
| Sprint 0 | Realtime disabled until a real requirement exists | `SUPABASE.md` §6 |
| Sprint 0 | No global `media` table; per-entity images + storage conventions | `DATABASE.md` §6 |
| Sprint 0 | Roles as enum on `profiles`; no roles/permissions tables | `DATABASE.md` §6 |
| Sprint 0 | Soft delete for content; hard delete for join rows/messages | `DATABASE.md` §0 |
| Sprint 0 | Vitest + Testing Library + Playwright; axe in CI | `TESTING.md` |
| Sprint 0 | Vercel + Supabase; forward-only migrations; PITR backup | `DEPLOYMENT.md` |
| Sprint 2 | Next.js 16: Turbopack default, ESLint CLI (no `next lint`), `proxy.ts` replaces `middleware.ts` (nodejs runtime) | `ARCHITECTURE.md` §3, `AUTH.md` |
| Sprint 2 | shadcn/ui base-nova (Base UI) themed with Turaya tokens; `@base-ui/react` primitive set | `DESIGN_SYSTEM.md` |
| Sprint 2 | Motion tokens implemented in `src/lib/motion.ts`; primitives `Reveal/Parallax/SplitLines/Magnetic/LenisProvider` | `MOTION_SYSTEM.md` |
