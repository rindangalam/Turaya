# MOTION_SYSTEM — Turaya

> Motion tokens and rules. Every animation in the product must derive from this document.
> Design tokens live in `DESIGN_SYSTEM.md`.

---

## 1. Motion Principles

1. **Motion communicates, never decorates.** Every animation passes the Interaction Quality Rule:
   usability, information, brand, emotion, or navigation — at least one.
2. **Respect the hierarchy.** Level 1 (micro) and Level 2 (component) do most of the work;
   Level 3 (experience) is reserved for the hero and key storytelling moments.
3. **Budget.** Total motion budget is spent on: hero > navigation > brand storytelling >
   product experience > gallery > CTA > micro-interactions. Everything else stays still.
4. **Reduced motion is a first-class state**, not an afterthought.

## 2. Motion Tokens

### Duration

| Token | Value | Level |
|---|---|---|
| `duration-micro` | 150ms | L1 micro (button hover, icon, link underline) |
| `duration-quick` | 250ms | L1–L2 (nav hover, accordion) |
| `duration-component` | 400–500ms | L2 (cards, gallery, modal, menu) |
| `duration-experience` | 800–1200ms | L3 (hero timeline, storytelling, page transition) |

### Easing

| Token | Value | Use |
|---|---|---|
| `ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | UI defaults |
| `ease-luxury` | `cubic-bezier(0.16, 1, 0.3, 1)` | Experience-level, entrances (calm settle, no bounce) |
| `ease-soft` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Fades/opacity only |
| `ease-exit` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Exits (faster out) |

**Never** use bouncy/elastic curves. The brand moves like a drop settling — smooth, decelerating.

### Stagger & delay

| Token | Value | Use |
|---|---|---|
| `stagger-micro` | 40ms | L1 groups (nav links) |
| `stagger-component` | 80ms | L2 groups (cards, list rows) |
| `stagger-experience` | 120–160ms | L3 reveals (hero, storytelling) |
| Max delay | 600ms | Never make the user wait longer |

## 3. Motion Levels

### L1 — Micro (150–250ms)
- Link underline reveal, button fill/arrow, icon nudges, accordion chevron, focus states.
- Rules: instant response; no opacity-only fades for interactive states (use transform/color).

### L2 — Component (400–500ms)
- Product card hover (image scale 1.03–1.05, meta reveal), gallery, modal/dialog, menu, dropdown, tabs.
- Rules: 1 property change per state where possible; hover starts within 50ms of pointer enter;
  tap states on touch; elements enter with `ease-standard` + slight translate.

### L3 — Experience (800–1200ms)
- Hero timeline, scroll storytelling (ScrollTrigger pin/replace), page transitions, horizontal gallery.
- Rules: single composition per scene; exits faster than entrances; every scene passes the budget.

## 4. Scroll Rules

- Use `ScrollTrigger` only where a scene gains meaning from scroll (hero, story progression, gallery).
- Default reveals: one `Reveal` primitive (fade + 24px rise + `ease-luxury`, 800ms, stagger 80ms).
- Never pin longer than one viewport per scene without justification.
- Horizontal gallery: drag/swipe on touch, drag + scroll wheel on desktop; must be restful on reduce-motion (becomes horizontal scroll, no scrub).
- No scroll-jacking, no infinite parallax on body copy.

## 5. Hover & Interaction Rules

- Hover must never be required for essential content (touch parity).
- Magnetic buttons: translate ≤ 6px, spring to rest ≤ 150ms, desktop only.
- Custom cursor: optional, desktop only, never blocks clicks, hides with native cursor on touch and reduced-motion.
- Image previews (cursor-following): desktop only, `position: fixed` layer, pointer-events none.

## 6. Page Transitions

- Fast (≤ 400ms total), fade + slight rise (8–16px), `ease-luxury`.
- Interruptible: navigation stays responsive; content renders progressively; no blocking loading screens.
- Respect reduced motion → instant content swap, no overlay.
- Shared-element continuity only where genuinely informative (e.g., product card → product page image).

## 7. Reduced Motion Behavior

When `prefers-reduced-motion: reduce`:
- All L3 animation disabled: no timelines, no ScrollTrigger scrub, no pinned scenes.
- Reveals become instant visibility (no fade/rise), or remain static.
- Micro/component: keep opacity/color transitions ≤ 150ms; disable translate/scale-based motion.
- Lenis smooth scroll disabled (native scroll).
- Custom cursor disabled. Marquee pauses or converts to static.
- Motion components: use `motion.reduce` / CSS `@media (prefers-reduced-motion: reduce)` overrides.
- GSAP: `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` guard.

## 8. Motion Budget (spend order)

| Priority | Surface | Motion type |
|---|---|---|
| 1 | Hero | Full L3 timeline |
| 2 | Navigation | L1 + menu transition L2 |
| 3 | Brand storytelling | L3 scroll scenes (max 3 scenes on homepage) |
| 4 | Product experience | L2 reveals + pyramid interaction |
| 5 | Gallery | L2 drag/lightbox |
| 6 | CTA | L1 magnetic + reveal |
| 7 | Micro | L1 throughout |

Anything not in the table stays static by default.

## 9. Technology Assignment

| Library | Domain |
|---|---|
| GSAP | Hero timeline, ScrollTrigger scenes, image masking, text line reveals (L3) |
| Motion (React) | Modals, menus, tabs, layout transitions, hover micro (L1–L2) |
| Lenis | Smooth scroll (desktop), disabled on reduced-motion/touch when unnecessary |

Integration notes: initialize Lenis + GSAP ScrollTrigger sync once in a shared provider; keep both behind the reduced-motion guard.
