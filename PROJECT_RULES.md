# PROJECT_RULES — Turaya

> Deterministic rulebook for every agent and engineer working in this repository.
> Rules are classified **MUST / SHOULD / MAY / MUST NOT**. When in doubt, ask.
> This document is the second-highest authority (after product requirements, see `docs/README.md`).

---

## 1. Documentation & Process

| Level | Rule |
|---|---|
| MUST | Read `AGENT.md`, this file, `PROJECT_CONTEXT.md`, and `docs/README.md` before any implementation. |
| MUST | Follow the Implementation Protocol (PHASE 1–14) in `AGENT.md` for every feature. |
| MUST | Update affected documentation when a feature, schema, or token changes. |
| MUST | Use the change-control protocol below when a change impacts architecture. |
| MUST NOT | Invent architecture during implementation. |
| MUST NOT | Declare a feature done merely because it compiles. |

### CHANGE CONTROL

If implementation requires an architecture change: **STOP**. Write the change as
`docs/decisions/YYYY-MM-DD-title.md` covering: current architecture, proposed change, reason,
impact, alternatives, migration. Only after the decision is recorded does implementation continue.

## 2. Architecture

| Level | Rule |
|---|---|
| MUST | Use the feature-oriented structure defined in `docs/ARCHITECTURE.md`. |
| MUST | Default to Server Components; client components only for interaction/browser APIs/local state/animation/events. |
| MUST | Keep routing within the public and admin route trees defined in `docs/ARCHITECTURE.md`; new routes need justification. |
| MUST | Extract logic into `src/services/`, `src/lib/`, and feature modules — no business logic in page components. |
| MUST NOT | Create a giant `components/` folder containing unrelated business logic. |
| MUST NOT | Add a dependency without passing the Dependency Rule (`docs/CODE_STYLE.md` §Dependencies). |

## 3. Supabase, Database & Security

| Level | Rule |
|---|---|
| MUST | Enforce access with Row Level Security on every protected table; policies per role. |
| MUST | Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. |
| MUST | Authorize server-side; frontend hiding is NOT authorization. |
| MUST | Validate all inputs server-side (zod or equivalent). |
| MUST | Validate uploads: file type, size, and MIME; store media via Supabase Storage. |
| MUST | Follow `docs/DATABASE.md` schema; schema changes go through migrations + this document. |
| MUST | Log auditable mutations per `docs/SUPABASE.md` §Audit. |
| MUST NOT | Expose raw database errors to the client. |
| MUST NOT | Bypass RLS with the service role key except in explicitly justified server-only service code. |

## 4. Design & UI

| Level | Rule |
|---|---|
| MUST | Use tokens from `docs/DESIGN_SYSTEM.md` — no arbitrary colors, spacing, radius, or type values. |
| MUST | Use tokens from `docs/MOTION_SYSTEM.md` — no arbitrary durations or easings. |
| MUST | Respect `prefers-reduced-motion`. |
| MUST | Define loading, empty, error, and success states for every major feature. |
| MUST | Pass the Interaction Quality Rule (usability / information / brand / emotion / navigation). |
| SHOULD | Prefer editorial, minimal, intentional layouts over decorative ones. |
| MUST NOT | Add sections, components, or animations just because a template has them. |
| MUST NOT | Use generic marketing copy or lorem ipsum in any deliverable. |

## 5. Accessibility

| Level | Rule |
|---|---|
| MUST | Target WCAG 2.2 AA (`docs/ACCESSIBILITY.md`). |
| MUST | Use semantic HTML, keyboard support, focus management, labels, and alt text. |
| MUST | Never depend on hover for essential functionality. |
| MUST | Ensure animation never blocks content understanding. |

## 6. SEO & Performance

| Level | Rule |
|---|---|
| MUST | Implement metadata, OpenGraph, canonical, sitemap, robots, and JSON-LD per `docs/SEO.md`. |
| MUST | Use `next/image` with explicit dimensions; lazy loading by default, priority only when justified. |
| MUST | Monitor LCP, CLS, INP targets from `docs/PERFORMANCE.md`. |
| MUST NOT | Ship unoptimized images or videos, layout-shifting media, or render-blocking client JS without justification. |

## 7. Testing & Quality

| Level | Rule |
|---|---|
| MUST | Pass TypeScript strict, ESLint, and Prettier before completion. |
| MUST | Write tests for validation, business logic, and utilities (`docs/TESTING.md`). |
| MUST | Run the full test suite before marking work done. |
| SHOULD | Cover critical flows with Playwright E2E. |
| MUST NOT | Use `any`, `ts-ignore`, or `ts-expect-error` without documented justification. |

## 8. Content

| Level | Rule |
|---|---|
| MUST | Mark all placeholder content explicitly (`[PLACEHOLDER — ...]`) per `docs/CONTENT_GUIDELINES.md`. |
| MUST | Never present invented content as real brand information. |
| MUST NOT | Ship placeholders to production without a review gate flag. |

## 9. Git & Collaboration

| Level | Rule |
|---|---|
| MUST | Use branches: `main`, `develop`, `feature/*`, `fix/*`, `refactor/*`. |
| MUST | Write conventional commits: `feat(scope): message`, `fix(scope): message`, `docs(scope): message`, etc. |
| MUST | Keep commits focused; avoid giant unrelated commits. |
| MUST NOT | Commit secrets, `.env` files, or local artifacts. |

## 10. Definition of Done (every task)

1. Implementation complete.
2. TypeScript passes. 3. Lint passes. 4. Tests pass.
5. Responsive checked. 6. Accessibility checked. 7. Loading/error/empty states handled.
8. Animation reviewed; reduced motion handled.
9. Performance considered (image sizes, JS budget, LCP/CLS/INP).
10. Documentation updated. 11. Architecture respected. 12. No unnecessary duplication.
13. No AI slop. 14. Code review gate passed (`docs/CODE_STYLE.md` §Review).
