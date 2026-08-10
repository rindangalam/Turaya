# CODE_STYLE — Turaya Code Quality Conventions

> TypeScript strict, ESLint, Prettier, readable over clever. Package manager: **npm**.

---

## 1. Tooling

| Tool | Config |
|---|---|
| TypeScript | `strict: true`; no `any`, no `ts-ignore`, no `ts-expect-error` without documented justification |
| ESLint | Next.js flat config + recommended TS + react-hooks + a11y plugins |
| Prettier | 2-space, single quotes, trailing commas, 100 col print width |
| npm | `package-lock.json` committed; `npm ci` in CI |

## 2. Naming

- Files: `kebab-case` (`product-card.tsx`, `get-product.ts`); feature folders kebab-case.
- Components: `PascalCase` exports; constants `UPPER_SNAKE`; types/interfaces `PascalCase`.
- DB types generated from Supabase; domain types in `src/types` — don't hand-maintain duplicates.

## 3. Component Rules

- Server Component by default; `"use client"` only for interaction/browser APIs/local state/animation/events.
- Props typed; `children` accepted where sensible; no prop drilling (compose or context).
- One responsibility per component; extract sections/forms/cards/modals/animation/data access.
- A `page.tsx` should compose sections — no page files hundreds of lines long.
- shadcn/ui primitives are the base; theme via tokens (`DESIGN_SYSTEM.md`), fork only with justification.

## 4. Data & Server Code

- All mutations in server actions (`API.md` §2) with zod validation + guards.
- Services in `src/services`; pages call services, services own Supabase queries.
- Never import `lib/supabase/admin.ts` (service role) into client code or actions that
  run with user context without justification.
- Errors: typed results (`{ ok:false, ... }`), never thrown strings.

## 5. Dependencies (Dependency Rule)

Before adding a dependency:
1. Is it necessary? 2. Can the current stack solve it? 3. Does it improve maintainability?
4. Does it improve the product?

Prefer fewer dependencies. Pin exact versions; audit for criticals (`npm audit` gate).

## 6. Git & Commits

- Branching: `main`, `develop`, `feature/*`, `fix/*`, `refactor/*`.
- Conventional commits: `feat(homepage): add hero experience`, `fix(auth): resolve session issue`,
  `refactor(animation): simplify hero timeline`, `docs(architecture): update CMS architecture`.
- Focused commits; no giant unrelated changes. Never commit secrets.

## 7. Code Review Gate

Before completion, review (and fix issues from): architecture · security · performance ·
accessibility · UX · UI · animation · SEO · testing · documentation. Then record in the
report: files changed, validation run, remaining risks.

## 8. Formatting & Hygiene

- No comments unless they explain *why* (not what); no dead code; no unused imports (lint-enforced).
- Tailwind classes ordered per Prettier plugin config; tokens only (no raw hex in components).
- Placeholder content marked `[PLACEHOLDER]` per `CONTENT_GUIDELINES.md`.
