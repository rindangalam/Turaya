# PERFORMANCE — Turaya Performance Specification

> Targets and rules. Animation must never destroy performance.
> Reference hardware: mid-range laptop (M-series class), Chrome, 4G throttled.

---

## 1. Targets

| Metric | Target | Tool |
|---|---|---|
| LCP | < 2.5s | Lighthouse + Web Vitals |
| CLS | < 0.1 | Lighthouse + Web Vitals |
| INP | < 200ms | Web Vitals (field-appropriate lab proxy) |
| TBT | < 300ms | Lighthouse |
| Lighthouse Performance | ≥ 90 | CI thresholds |
| JS budget | ≤ 200KB gz initial client JS (excluding fonts) | bundlesize checks |

## 2. Core Rules

1. **Server Components by default** — minimal client JS (`ARCHITECTURE.md` §5).
2. **Images** (`next/image`): explicit width/height (zero CLS), `sizes` set, lazy by
   default; `priority` + `fetchPriority="high"` only for LCP (hero). AVIF/WebP via
   Vercel image optimization. Max upload 8MB (web-optimized at ingest where possible).
3. **Fonts**: `next/font` with `display: swap`; preload only the display face used above
   the fold; no font over-fetching (subsets).
4. **Streaming**: `loading.tsx`/suspense boundaries for CMS-heavy sections; keep above-fold
   static where possible. No client-side fetch waterfalls.
5. **Animation**: transforms/opacity only; `will-change` sparingly; ScrollTrigger scenes
   `invalidateOnRefresh`; Lenis rAF ticker stops on visibility change; all animation
   behind `IntersectionObserver`/ScrollTrigger scrub — never animate off-screen.
6. **Data**: one query per view where practical (joins via Supabase `select` relations);
   no N+1; `revalidate`/ISR only where content is slow-moving (public pages can be
   statically generated at build/preview time; admin always dynamic).
7. **Code**: tree-shaking (import `gsap/ScrollTrigger` explicitly), lazy-load client
   chunks (`dynamic()`), no unused deps.

## 3. Measurement & CI

- Lighthouse CI on preview builds (thresholds §1).
- Web Vitals logger in production (respect privacy; opt-in analytics per `DEPLOYMENT.md`).
- Manual check: DevTools performance trace on homepage + product page (mobile emulation).

## 4. Known Heavy Spots (plan)

| Spot | Mitigation |
|---|---|
| Hero imagery | `priority` LCP image, WebP, ≤ 1.2MB, preload |
| Gallery | Virtualized/lazy tiles; intersection-based loading; no full-res until lightbox |
| GSAP timelines | gated by `matchMedia` (reduced-motion + viewport), killed on route change |
| Journal markdown | render server-side; no client MD runtime |

## 5. Acceptance Gate

A feature is not done if it moves LCP/CLS/INP beyond targets on reference hardware or
adds > 30KB gz to initial client JS without justification.
