# SKILL — Motion (React)

## Purpose
Implement L1–L2 UI interaction: modals, menus, tabs, layout transitions, hovers.

## When to Use
Component-level animation: dialog/modal enter, mobile nav overlay, tabs, hover reveals, list staggering.

## When NOT to Use
Experience-level scenes (use `gsap`), smooth scrolling (`lenis`), design decisions (`motion-design`).

## Rules
1. Tokens only: `duration-component` 400–500ms, `ease-standard`; L1 at 150–250ms.
2. Respect reduced motion (`motion`'s `useReducedMotion` / `MotionConfig reducedMotion`); keep transitions ≤ 150ms there.
3. Animate transforms/opacity; no layout animation without `layout` justification.
4. Don't animate off-screen; mount-aware (`initial/animate/exit`).
5. Keep it accessible: focus management lives in the component, not the animation.

## Workflow
1. Classify level (L1/L2) per `motion-design`.
2. Implement with tokens; ensure exit animations complete fast (≤ duration-component).
3. Verify reduced motion + keyboard behavior.

## Examples
- Mobile menu: full-screen overlay, staggered links at `stagger-micro`, `ease-standard`, exits fast.
- Modal: scale/fade enter 400ms, focus trap + ESC; exit ≤ 250ms.

## Common Mistakes
Bouncy curves; animating height/width; ignoring reduced motion; exit animations that block interaction.

## Validation Checklist
- [ ] Tokens used; L1/L2 scope
- [ ] Reduced-motion path verified
- [ ] No layout-property animation; accessible focus intact

## Related Documentation
`docs/MOTION_SYSTEM.md` §3/§5/§7, `docs/ACCESSIBILITY.md`
