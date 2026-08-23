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
npm run dev          # development server (all routes)
npm run build        # full production build (all routes)
npm run build:target # isolated build per deployment target — docs/DEPLOYMENT.md §3
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
```

The public site and the admin CMS are deployed as **two separate Vercel
projects** from this repo (`NEXT_PUBLIC_APP_TARGET=public|admin`); `/admin` on
the public deployment does not exist and answers 404. See `docs/DEPLOYMENT.md`.

## Branching

`main` (production) · `develop` (integration) · `feature/*` / `fix/*` / `refactor/*`

## Status

Sprints 1–13 complete (Design System → CMS admin: settings, homepage, products,
collections, categories, ingredients, relations, gallery, journal, testimonials,
stores, SEO, messages → Public website: homepage, products, collections, ingredients,
gallery, journal, contact, about, philosophy, stores, faq, privacy, terms, nav/footer,
boundaries → Motion system: hero timeline, scroll storytelling, page transitions,
cursor preview, reduced-motion paths → SEO: metadata builders, canonical/OG/Twitter,
JSON-LD (Organization/Product/Article/Breadcrumb/FAQ), sitemap, robots, OG image API)
— see `docs/SPRINTS.md`.

Connected to the hosted Supabase project (ref `yuzsroqibdylpqihrbsh`, region
`ap-southeast-1`): all migrations `0000`–`0008` + seed applied, admin user
bootstrapped, verified end-to-end in the browser. See `docs/SUPABASE.md`.
