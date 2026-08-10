# AGENT.md — Turaya Engineering Constitution

> Read this file **first**, then `PROJECT_RULES.md`, `PROJECT_CONTEXT.md`, and `docs/README.md`.
> This document instructs every agent working in this repository. It is permanent.

---

## 1. Identity

You are working on **Turaya**: a luxury perfume brand public experience + CMS admin,
built with Next.js (App Router) + Supabase. See `PROJECT_CONTEXT.md` for identity.

## 2. Non-Negotiable Commitments

1. **Documentation first.** Every task starts by reading the relevant docs.
2. **Architecture first.** Never invent architecture during implementation.
3. **Design first.** Every UI element earns its place; tokens come from the design system.
4. **Security by default.** RLS, server-side authorization, validation, no secrets in client.
5. **Quality over quantity.** Correct, intentional, accessible, performant — never AI slop.
6. **Placeholder honesty.** Never present invented content as real brand information.

## 3. Source of Truth Hierarchy

1. Product requirements
2. `PROJECT_RULES.md`
3. `AGENT.md` (this file)
4. `docs/ARCHITECTURE.md`
5. Feature specifications (`docs/FEATURES.md`)
6. `docs/DATABASE.md`
7. `docs/DESIGN_SYSTEM.md`
8. `docs/MOTION_SYSTEM.md`
9. Task specification (`docs/TASKS.md`)
10. Existing code

If existing code conflicts with approved documentation: **STOP**. Report the conflict
(current behavior, expected behavior, impact, proposed solution). Do not silently change architecture.

## 4. Implementation Protocol

Follow all phases for every feature:

1. **Read documentation** — architecture, features, design, motion, security, testing.
2. **Identify affected architecture** — routes, components, services, data flow.
3. **Identify database impact** — tables, columns, RLS, migrations.
4. **Identify UI/UX impact** — states (default/hover/focus/active/disabled/loading/error/empty/success).
5. **Identify animation impact** — motion levels, tokens, reduced motion.
6. **Identify security impact** — auth, authorization, validation, uploads.
7. **Identify accessibility impact** — keyboard, focus, aria, contrast, semantics.
8. **Identify SEO impact** — metadata, JSON-LD, canonical, sitemap.
9. **Identify tests** — unit, integration, E2E.
10. **Implement.**
11. **Validate** — typecheck, lint, tests, build, manual responsive check.
12. **Review** — run the Code Review Gate (`docs/CODE_STYLE.md` §Review).
13. **Update documentation.**
14. **Report changes** — what changed, where, how it was validated.

## 5. Rules of Engagement

- **Default to Server Components.** Add `"use client"` only with a legitimate reason.
- **Feature-oriented structure.** Business logic lives in `src/features/*`, shared code in `src/components/`, `src/lib/`, `src/services/`, `src/hooks/`.
- **No duplication.** Search the repo before creating a component, hook, utility, or service.
- **Tokens only.** Colors, type, spacing, radius, shadows, motion — all from the design/motion systems.
- **Reuse shadcn/ui** primitives; restyle with design tokens, don't fork randomly.
- **Never expose secrets.** Service role key is server-only. No raw DB errors to clients.
- **Never bypass RLS.** Authorize in server actions/route handlers, then query through RLS.

## 6. AI Slop Check

Before finishing any UI work, answer honestly:

- Why does this section exist? What problem does it solve for the user?
- Is the hierarchy clear and the layout intentional?
- Does it feel like Turaya, or like a template?
- Is the animation meaningful and within the motion budget?
- Is the copy specific (not generic marketing language)?
- Is the component reusable and architecture-respecting?
- Are loading/empty/error/success states defined?

If any answer is "no" or unclear: **STOP, redesign, or ask.** Do not ship it.

## 7. Definition of Done

See `PROJECT_RULES.md` §10. A task is not done until every item passes, including
documentation updates and the code review gate.

## 8. When to Stop and Ask

- Real brand content is needed (never invent it).
- Architecture impact is unclear or the change requires change control.
- A dependency decision is ambiguous.
- Requirements conflict with existing approved documentation.
