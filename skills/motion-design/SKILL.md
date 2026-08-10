# SKILL — Motion Design

## Purpose
Choose, budget, and specify animation that serves content — per the motion system.

## When to Use
Any animated behavior decision: hero, reveals, hover, transitions, storytelling.

## When NOT to Use
Implementing timelines (that's `gsap`), UI transitions (that's `motion`), smooth scroll (`lenis`).

## Rules
1. Tokens only: durations/easings/stagger from `MOTION_SYSTEM.md` §2.
2. Levels: L1 micro, L2 component, L3 experience — spend per budget order (hero > nav > storytelling > product > gallery > CTA > micro).
3. Reduced motion is a first-class state (`MOTION_SYSTEM.md` §7).
4. Animate transforms/opacity only; never layout properties.
5. No bounce/elastic curves; brand moves like a drop settling.
6. Animation must never block content understanding.

## Workflow
1. Classify the motion (level, purpose).
2. Pick tokens; assign library (GSAP L3 / Motion L1–L2 / Lenis scroll).
3. Define reduced-motion alternative.
4. Verify budget order and no off-screen animation.

## Examples
- Hero: L3 GSAP timeline, `ease-luxury`, 800–1200ms, staged reveal.
- Card hover: L2, image scale 1.03–1.05, 400ms, `ease-standard`.
- Button: L1, fill + arrow move, 150ms.

## Common Mistakes
Animating every paragraph/card; bouncy curves; scroll-jacking; forgetting reduced motion; animating layout properties.

## Validation Checklist
- [ ] Tokens used; level appropriate
- [ ] Budget order respected
- [ ] Reduced-motion path verified
- [ ] No layout-property animation

## Related Documentation
`docs/MOTION_SYSTEM.md`, `docs/DESIGN_SYSTEM.md`, `docs/PERFORMANCE.md`
