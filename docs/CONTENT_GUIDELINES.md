# CONTENT_GUIDELINES — Turaya Content & Copy

> How content is written, marked, and seeded. Placeholder honesty is non-negotiable
> (`PROJECT_CONTEXT.md` §4, `PROJECT_RULES.md` §8).

---

## 1. Placeholder Policy

- **No real Turaya content exists yet.** All copy, names, facts, imagery in the repo are placeholders unless explicitly provided.
- Inline marker: `[PLACEHOLDER — <what this content is for>]`.
  Example: `[PLACEHOLDER — signature fragrance name]`.
- Placeholders must read as honest drafts, not invented facts. No fake statistics, no invented
  founders, no invented years "since 19XX".
- Seed data uses the same markers (`supabase/seed`).
- **Production gate** (Sprint 18): automated scan fails a deploy if `[PLACEHOLDER]` exists in
  any published resource (title, description, body, alt).
- When real content arrives: replace placeholders, record provenance if needed, update this doc.

## 2. Copy Standards (apply to real content when it arrives)

- **Specific > generic.** Sensory, concrete language ("cold stone, wet citrus rind" —
  not "a refreshing citrusy scent").
- **Banned**: "unleash your senses", "luxury at its finest", "experience true elegance",
  superlative spam, fake scarcity ("limited edition" only if true).
- **Restraint**: short lines; overlines/labels carry structure; body prose ≤ 3 sentences per paragraph.
- **Voice**: calm, assured, editorial. First-person plural ("we") only for craft/provenance claims.
- **No claims** about ingredients/ethics/performance that cannot be verified. Factual content
  requires sources; otherwise placeholder.
- Language: English by default.

## 3. Content Types & Sources

| Type | Source | Status default |
|---|---|---|
| Products, collections, journal, ingredients, FAQ, stores, testimonials, gallery | CMS (admin) | draft until edited + published |
| Legal pages (privacy/terms) | Owner-provided text | static, placeholder-marked until provided |
| Settings (contact, social, hours) | CMS settings | placeholder |

## 4. Editorial Quality

- Titles: specific, ≤ 8 words. Descriptions: ≤ 155 chars (SEO).
- Images: every image has meaningful alt text; captions add information (not "Image 1").
- Testimonials: if placeholder-marked, they must be clearly sample content and **not**
  rendered as real customer quotes in production (gate covers this).
- Journal: factual claims attributed; craft stories must be true or placeholder.

## 5. Seed Data Convention

- Seeds mirror production structure with `[PLACEHOLDER]` content, realistic slugs and
  ordering — never lorem ipsum.
- Idempotent: safe to re-run.
- Separate "demo" from "real": no demo content masquerades as brand content.

## 6. Content Review Workflow (production)

1. Editor writes/edits in CMS (drafts).
2. Review: another editor/admin checks placeholder markers, facts, copy standards.
3. Publish. 4. Placeholder scan runs on deploy. 5. Any placeholder surfaced → block.

## 7. Content Manifest

Keep a living list here of **known placeholder items** so production go-live can be
checked systematically:

| Item | Location | Status |
|---|---|---|
| Brand story, founders | `/about`, homepage intro | `[PLACEHOLDER]` |
| Product names/notes | products seed | `[PLACEHOLDER]` |
| Ingredient facts | ingredients seed | `[PLACEHOLDER]` |
| Imagery | all buckets | placeholder assets only |
| Legal text | `/privacy`, `/terms` | `[PLACEHOLDER]` |
| Testimonials | testimonials seed | `[PLACEHOLDER]` |
| Store locations | stores seed | `[PLACEHOLDER]` |
