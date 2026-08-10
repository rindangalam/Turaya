# SKILL.md — Turaya Skill System

> How to discover, load, and use the repository's skills.
> Skills live in `skills/<skill-name>/SKILL.md`. Each is written per the requirements in
> `docs/README.md` §Skills and covers: purpose, when to use, when not to use, rules,
> workflow, examples, common mistakes, validation checklist, related documentation.

---

## 1. What Skills Are

Skills are focused, loadable instruction sets for a single discipline. They encode the
project's conventions so any agent can execute a task the way the project expects.

## 2. Skill Index

| Skill | Use when |
|---|---|
| `nextjs-architecture` | Routing, layouts, RSC/CC decisions, Next.js conventions |
| `typescript` | Typing, strict mode, generics, avoiding `any` |
| `supabase` | Querying, migrations, clients, database conventions |
| `supabase-auth` | Auth flows, sessions, callbacks, middleware |
| `supabase-storage` | Buckets, uploads, validation, URLs |
| `supabase-rls` | Policies, roles, security definer functions |
| `prisma` | Prisma usage — **only if** Prisma is adopted (see `docs/ARCHITECTURE.md` §Prisma decision) |
| `design-system` | Tokens, typography, color, spacing, components |
| `ui-engineering` | Building accessible, reusable UI components |
| `ux-design` | Interaction-first design, states, information hierarchy |
| `motion-design` | Choosing and budgeting animation |
| `gsap` | Timelines, ScrollTrigger, hero/storytelling animation |
| `motion` | UI interaction, modals, navigation, layout transitions |
| `lenis` | Smooth scrolling integration |
| `responsive-design` | Mobile/tablet/desktop behavior, touch vs. pointer |
| `accessibility` | WCAG 2.2 AA, keyboard, focus, aria, reduced motion |
| `seo` | Metadata, OG, JSON-LD, sitemap, canonical |
| `performance` | LCP/CLS/INP, images, JS budget, streaming |
| `security` | RLS, validation, uploads, headers, secrets |
| `testing` | Vitest, Testing Library, Playwright, coverage |
| `code-review` | The Code Review Gate, review checklist |
| `documentation` | Doc-first workflow, updating docs, change control |
| `content` | Placeholder policy, copy guidelines, seed data |

## 3. Workflow

1. Before a task, check the index above and load every skill that matches the task.
2. Load the skill (skill tool / read `skills/<name>/SKILL.md`).
3. Follow the skill's workflow and validation checklist.
4. After the task, if the skill content became stale, update it (documentation-first).

## 4. Rules

- Skills encode **project-specific** conventions — they take priority over generic knowledge.
- A skill's "When not to use" section is binding.
- If two skills conflict, the higher authority is `PROJECT_RULES.md` → `AGENT.md` → skill files.
- Never treat skills as decoration; every skill must be actionable and used.
