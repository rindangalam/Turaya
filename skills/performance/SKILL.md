# SKILL — Performance

## Purpose
Meet LCP < 2.5s, CLS < 0.1, INP < 200ms, ≤ 200KB gz initial client JS.

## When to Use
Any feature, image, animation, or data-fetching change; CI thresholds.

## When NOT to Use
Token design, content decisions.

## Rules
1. RSC-first; minimal client JS; lazy-load client chunks with `dynamic()`.
2. Images: `next/image` with explicit dims + `sizes`; lazy default; `priority` only for LCP; web-optimized at ingest.
3. Fonts via `next/font`, `display: swap`; no over-fetching.
4. Animation: transforms/opacity only; no off-screen animation; ScrollTrigger `invalidateOnRefresh`.
5. One query per view where practical; no N+1; no client fetch waterfalls.
6. Streaming/skeletons for CMS-heavy sections; keep above-fold static.

## Workflow
1. Profile the change against §1 targets (Lighthouse mobile).
2. Optimize hot spots (hero image, gallery tiles, JS chunks).
3. Verify no CLS from images/fonts; confirm Web Vitals.

## Examples
- Hero: single LCP image `priority` + preload, WebP, ≤ 1.2MB; display type via `next/font` swap.
- Gallery: intersection-based lazy tiles; full-res only in lightbox.

## Common Mistakes
Huge unoptimized images; animating layout; client fetching waterfalls; heavy JS on initial load; many web fonts.

## Validation Checklist
- [ ] Targets met on reference hardware
- [ ] Images optimized; no layout shift
- [ ] JS budget respected; no off-screen animation

## Related Documentation
`docs/PERFORMANCE.md`, `docs/ARCHITECTURE.md` §5, `docs/MOTION_SYSTEM.md`
