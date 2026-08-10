# SKILL — GSAP

## Purpose
Implement experience-level animation: timelines, ScrollTrigger scenes, masking, text reveals.

## When to Use
Hero timeline, scroll storytelling, pinned scenes, image masking, horizontal gallery scrub.

## When NOT to Use
UI micro-interactions/modals (use `motion`), smooth scrolling (use `lenis`), any L1–L2 motion.

## Rules
1. Import narrowly: `import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'` — tree-shaking.
2. Guard with `gsap.matchMedia()`: reduced-motion and viewport conditions; nothing runs off-screen.
3. `invalidateOnRefresh` for ScrollTrigger; kill timelines on route change/unmount.
4. Transforms/opacity only; `will-change` sparingly.
5. Sync with Lenis via `ScrollTrigger.scrollerProxy` (or `lenis.on('scroll', ScrollTrigger.update)`).
6. One composition per scene; exits faster than entrances.

## Workflow
1. Design the scene on paper first (`motion-design` skill).
2. Build timeline with tokens (`ease-luxury`, durations, stagger).
3. Wrap in `matchMedia` guards; register cleanup.
4. Verify reduced-motion and mobile fallbacks.

## Examples
- Hero: `gsap.timeline()` staged reveal — backdrop, brand type, product, copy, CTA, scroll cue.
- Storytelling: pinned section with text progression, `scrub: 1`, `invalidateOnRefresh`.

## Common Mistakes
Global timelines without cleanup; running on reduced motion; animating layout properties; heavy scrub on mobile; ScrollTrigger without Lenis sync.

## Validation Checklist
- [ ] matchMedia guard (reduced-motion + viewport)
- [ ] Cleanup on unmount; no leaked triggers
- [ ] Tokens respected; Lenis synced
- [ ] LCP/INP unaffected

## Related Documentation
`docs/MOTION_SYSTEM.md` §9, `docs/PERFORMANCE.md`, `skills/motion-design`
