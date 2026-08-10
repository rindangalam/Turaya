# SKILL — Content

## Purpose
Write and mark content per the placeholder policy and copy standards.

## When to Use
Any copy, seed data, CMS content, alt text, metadata descriptions.

## When NOT to Use
Structural UI decisions (that's `ux-design`/`ui-engineering`).

## Rules
1. No real brand content exists yet → all content is `[PLACEHOLDER — …]`-marked (`CONTENT_GUIDELINES.md` §1).
2. Never invent facts: no founders, dates, statistics, claims.
3. Banned language: clichés, superlative spam, fake scarcity; prefer sensory, specific, restrained copy.
4. Titles ≤ 8 words; descriptions ≤ 155 chars; every image has meaningful alt.
5. Factual claims require sources; otherwise placeholder.
6. Placeholder scan blocks production deploys (Sprint 18 gate).

## Workflow
1. Check the content manifest (`CONTENT_GUIDELINES.md` §7) for existing placeholders.
2. Draft copy specific to the surface (purpose/goal from `FEATURES.md`).
3. Mark placeholders; keep manifest updated.

## Examples
- Product description: sensory, concrete; claims about ingredients = placeholder-marked.
- Seed data: realistic structure + slugs, honest `[PLACEHOLDER]` text — never lorem ipsum.

## Common Mistakes
Lorem ipsum; inventing brand facts; generic marketing copy; shipping placeholders as real content.

## Validation Checklist
- [ ] Placeholders marked and listed in manifest
- [ ] No invented facts/statistics
- [ ] Copy standards met; alt text present

## Related Documentation
`docs/CONTENT_GUIDELINES.md`, `PROJECT_CONTEXT.md` §4, `docs/FEATURES.md`
