# SKILL — UI Engineering

## Purpose
Build accessible, reusable, performant components on shadcn/ui primitives.

## When to Use
Creating or refactoring any component.

## When NOT to Use
Copywriting, page composition strategy (that's `ux-design` + `FEATURES.md`).

## Rules
1. One responsibility per component; compose; no giant components.
2. Server-first: keep components RSC unless interaction requires client.
3. States: default, hover, focus, active, disabled, loading, error, empty, success — where applicable.
4. Semantic HTML; keyboard operable; `aria-*` correct; visible focus.
5. Reuse: search the repo before creating new components/hooks/utils.
6. Pass the Interaction Quality Rule (`AGENT.md` §6) — no decoration-only UI.

## Workflow
1. Check `components/ui` + existing features for reuse.
2. Implement with tokens; define all applicable states.
3. Keyboard + screen reader pass; axe check.

## Examples
- ProductCard: link-wrapped card, image (next/image, dims), overline, title, note hint; hover: image scale + meta reveal (motion tokens).
- NotesPyramid: buttons with `aria-expanded` controlling a region; keyboard operable.

## Common Mistakes
Duplicating existing components; client components with no client need; missing states; non-semantic markup; decorative interactions.

## Validation Checklist
- [ ] Reuse checked; single responsibility
- [ ] All states defined; a11y pass (axe)
- [ ] Tokens used; no layout shift

## Related Documentation
`docs/DESIGN_SYSTEM.md`, `docs/ACCESSIBILITY.md`, `docs/FEATURES.md`, `docs/MOTION_SYSTEM.md`
