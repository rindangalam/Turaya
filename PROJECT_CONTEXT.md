# PROJECT_CONTEXT — Turaya

> Source of truth for **who Turaya is** and **what this product is**.
> This is the first document to read. Everything else in the repository defers to it for identity, and to `PROJECT_RULES.md` for rules.

---

## 1. Project Identity

| Field | Value |
|---|---|
| Project name | Turaya |
| Product | Luxury perfume brand company profile + product experience |
| Admin product | CMS + admin dashboard for managing the public site |
| Primary stack | Next.js (App Router) + Supabase |
| Deployment | Vercel (web) + Supabase (backend platform) |
| Status | Greenfield — documentation phase complete, implementation begins Sprint 2+ |

Turaya is **not** a generic company profile, ecommerce template, or SaaS dashboard.
It is a premium digital brand experience with a real content management layer behind it.

## 2. Brand Positioning

- **Category**: Luxury / artisanal fragrance.
- **Tone**: Calm, editorial, sophisticated, modern. Never loud, never generic.
- **References (quality benchmark only — never copied)**: Aesop, Le Labo, Byredo, Jo Malone, Maison Margiela, Dior Beauty, Apple.
- **Feeling**: Perfume is worn; the site must make the visitor *feel* the fragrance — craftsmanship, emotion, atmosphere.

## 3. Product Surfaces

| Surface | Audience | Goal |
|---|---|---|
| Public website (`/`) | Visitors, potential customers, press | Communicate brand, sell/lead to fragrance experience, build trust |
| Admin (`/admin`) | Super Admin, Admin, Editor | Manage content, media, SEO, settings safely and efficiently |

## 4. Content Status

> **Important.** As of the documentation phase, **no real Turaya brand content exists in this repository.**

Until real content is provided, ALL copy, fragrance names, ingredients, imagery, and facts are
**placeholders and MUST be marked as such**. Never present invented information as real brand
information.

- Convention: `[PLACEHOLDER — description]` inline, plus the content manifest in `docs/CONTENT_GUIDELINES.md`.
- Seed data: realistic *structure*, clearly-marked placeholder *content*.
- Any future real content replaces placeholders; placeholders never ship to production behind real content.

## 5. Brand Language

- Primary content language: **English** (default).
- Copy must be specific, sensory, and restrained. No filler, no clichés ("unleash your senses", "luxury at its finest" — banned).
- Structure for future localization; do not hardcode language assumptions into logic.

## 6. Key Constraints Carried From The Constitution

- Security: RLS is mandatory on every protected table; service role key is server-only.
- Architecture: feature-oriented (`src/features/*`); Server Components by default.
- Quality: no AI slop — every UI, interaction, and animation must earn its place.
- Process: documentation first; architecture changes require the change-control protocol (`PROJECT_RULES.md` §CHANGE).

## 7. Success Criteria

1. The public site reads as a designed, premium brand experience — not a template.
2. CMS editors can manage all public content without code changes.
3. WCAG 2.2 AA target; LCP < 2.5s, CLS < 0.1, INP < 200ms on reference hardware.
4. No security bypasses: RLS enforced, authorization server-side.
5. All documentation stays truthful: placeholders marked, contradictions resolved.
