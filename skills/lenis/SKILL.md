# SKILL — Lenis

## Purpose
Integrate smooth scrolling without harming performance or accessibility.

## When to Use
Desktop smooth scroll for the public site.

## When NOT to Use
Reduced-motion environments (disable), mobile where native scroll suffices, admin (keep native).

## Rules
1. Initialize once in a shared provider; never per-component.
2. Sync with GSAP ScrollTrigger (`ScrollTrigger.scrollerProxy` or scroll event forwarding).
3. Disable on `prefers-reduced-motion: reduce` (native scroll).
4. Pause/resume on tab visibility; keep rAF ticker efficient.
5. `data-lenis-prevent` for nested scrollable areas (lightbox/overlays).

## Workflow
1. Add provider with reduced-motion guard.
2. Wire ScrollTrigger sync.
3. Verify native-scroll fallback and overlay scrolling.

## Examples
- Provider: `lenis = new Lenis({ autoRaf: true })`, guarded by `matchMedia('(prefers-reduced-motion: no-preference)')`.
- ScrollTrigger: `lenis.on('scroll', ScrollTrigger.update)`.

## Common Mistakes
Multiple instances; no reduced-motion guard; breaking overlay scroll; forgetting ScrollTrigger sync (scroll-jank).

## Validation Checklist
- [ ] Single instance, guarded by reduced motion
- [ ] ScrollTrigger synced; visibility-aware
- [ ] Overlays scroll correctly; fallback native works

## Related Documentation
`docs/MOTION_SYSTEM.md` §7/§9, `skills/gsap`
