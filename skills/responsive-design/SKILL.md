# SKILL — Responsive Design

## Purpose
Design for mobile, tablet, desktop, large desktop independently — never shrink-to-fit.

## When to Use
Any layout, component, or interaction with responsive impact.

## When NOT to Use
Token definition (`design-system`), animation choice (`motion-design`).

## Rules
1. Breakpoints per `DESIGN_SYSTEM.md` §5: mobile <640, tablet 640–1023, desktop 1024–1439, large ≥1440.
2. Content-first mobile: single column, touch targets ≥ 44px, no hover dependencies.
3. Desktop: cursor, hover, magnetic, parallax, large parallax allowed.
4. Mobile: tap, swipe, scroll, drag — never hover-dependent essentials.
5. Fluid type via clamps (`display-*` tokens); container caps at 1440px.
6. Scroll scenes collapse to stacked sections on mobile; horizontal galleries → swipe.

## Workflow
1. Design layout per breakpoint (mobile-first).
2. Implement with fluid tokens; verify each breakpoint in devtools.
3. Check interaction parity: hover vs touch.

## Examples
- Hero type: `display-xl` clamp — scales fluidly; nav collapses to overlay menu at tablet.
- Notes pyramid: grid on desktop, vertical accordion on mobile.

## Common Mistakes
Desktop-first shrinking; hover-only interactions; fixed pixel widths; ignoring 1600+ screens.

## Validation Checklist
- [ ] 375/768/1280/1600 verified
- [ ] Touch targets ≥ 44px; no hover-essential functions
- [ ] Fluid type; no overflow/CLS

## Related Documentation
`docs/DESIGN_SYSTEM.md` §4–5, `docs/ACCESSIBILITY.md`, `docs/MOTION_SYSTEM.md` §5
