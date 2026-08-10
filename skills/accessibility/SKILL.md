# SKILL — Accessibility

## Purpose
Meet WCAG 2.2 AA: semantics, keyboard, focus, screen readers, contrast, reduced motion.

## When to Use
Every component and page; any UI change.

## When NOT to Use
Writing content (that's `content`), motion design (that's `motion-design`).

## Rules
1. Native elements first; one `h1` per page; heading order.
2. Visible focus everywhere; focus trap + return in dialogs/lightbox.
3. Labels on all inputs; `aria-live` for dynamic updates; `alt` on images.
4. Contrast contract (`DESIGN_SYSTEM.md` §2): body ≥ 4.5:1; accent large/icon only.
5. Reduced motion honored (`MOTION_SYSTEM.md` §7).
6. Touch targets ≥ 44px; no hover-only functions.
7. Errors: summary + focus to first error + `aria-describedby`.

## Workflow
1. Build semantically; verify keyboard-only flow.
2. Run axe (Playwright) + manual screen-reader spot checks.
3. Emulate reduced motion and contrast-check token pairs used.

## Examples
- Mobile menu: button `aria-expanded`/`aria-controls`, ESC close, focus returned on close.
- Notes pyramid: buttons + `aria-expanded`, panel is a region, keyboard operable.

## Common Mistakes
Focus loss in overlays; missing labels; unlabelled icon buttons; hover-only interactions; `aria-hidden` on interactive content.

## Validation Checklist
- [ ] Keyboard-only pass; focus visible/ordered
- [ ] axe zero critical/high
- [ ] Labels/alt/aria correct; contrast verified
- [ ] Reduced-motion verified

## Related Documentation
`docs/ACCESSIBILITY.md`, `docs/DESIGN_SYSTEM.md` §2, `docs/MOTION_SYSTEM.md` §7
