# Turaya

Luxury perfume brand experience + CMS admin, built with Next.js (App Router) + Supabase.

## Documentation

Documentation is the source of truth. Start at `docs/README.md` (index, reading order,
cross-check protocol, decision log) and the root constitutions:

- `AGENT.md` — engineering constitution
- `PROJECT_RULES.md` — MUST / SHOULD / MAY / MUST NOT rules
- `PROJECT_CONTEXT.md` — brand identity and placeholder policy
- `SKILL.md` — skill system index

## Stack

Next.js 16 (Turbopack) · TypeScript strict · Tailwind CSS v4 · shadcn/ui (Base UI) ·
GSAP + Motion + Lenis · Supabase (Postgres, Auth, Storage, RLS) · npm

## Commands

```bash
npm run dev        # development server
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Branching

`main` (production) · `develop` (integration) · `feature/*` / `fix/*` / `refactor/*`

## Status

Sprint 2 (Design System) complete — see `docs/SPRINTS.md`.
