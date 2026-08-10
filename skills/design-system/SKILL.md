# SKILL — Design System

## Purpose
Build UI strictly from Turaya design tokens: color, type, spacing, radius, shadow, z-index, components.

## When to Use
Any UI work: new components, pages, admin screens, styling decisions.

## When NOT to Use
Motion decisions (that's `motion-design`); content/copy decisions.

## Rules
1. No raw design values in components — tokens only (`DESIGN_SYSTEM.md`).
2. Contrast contract §2 is binding: bronze accent never body text on paper; body text ≥ 4.5:1.
3. Editorial, minimal, calm: no excessive radius/gradients/glass/glow/particles.
4. shadcn/ui primitives themed via tokens; fork only with justification.
5. One accent moment per viewport.
6. Public = editorial scale; admin = density-first (same tokens, `DESIGN_SYSTEM.md` §10).

## Workflow
1. Read `DESIGN_SYSTEM.md`; map need to tokens.
2. Build/restyle component with token classes only.
3. Verify contrast pairs used; responsive behavior at 4 breakpoints.

## Examples
- Button: `bg-ink-900 text-paper-50 hover:bg-ink-800`, radius-sm, focus ring bronze.
- Section label: overline token (0.75rem, 0.16em, uppercase, bronze-500 for large only).

## Common Mistakes
Hex values in components; random spacing/radius; accent used for body text; template-looking card grids.

## Validation Checklist
- [ ] Tokens only; no hardcoded values
- [ ] Contrast contract respected
- [ ] Admin/public separation honored

## Related Documentation
`docs/DESIGN_SYSTEM.md`, `docs/ACCESSIBILITY.md`, `docs/CODE_STYLE.md` §3
