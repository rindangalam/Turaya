# DESIGN_SYSTEM — Turaya

> The visual language of Turaya, formalized as tokens. No arbitrary design values in code.
> Motion tokens live in `MOTION_SYSTEM.md`.

---

## 1. Design Direction

Turaya's visual language: **editorial, minimal, cinematic, calm, modern luxury.**

- Editorial composition over decorative layout.
- Whitespace is a material, not an empty area.
- Typography carries most of the emotional weight.
- Imagery is photographic, atmospheric, restrained (muted light, natural textures).
- One accent moment per viewport. Never compete.
- References (quality only, never copied): Aesop, Le Labo, Byredo, Jo Malone, Apple.

**Banned**: excessive rounded cards, excessive gradients, glassmorphism, random glow,
random particles, floating elements, fake statistics, icon soup.

## 2. Color System

Palette derives from warm neutrals (paper/ink) with a single bronze accent.

### Raw tokens

| Token | Value | Usage |
|---|---|---|
| `ink-950` | `#141210` | Deepest backgrounds (footer, night sections) |
| `ink-900` | `#1C1A17` | Primary background (night), near-black |
| `ink-800` | `#2A2722` | Elevated dark surfaces |
| `ink-700` | `#3A362F` | Dark borders, hover surfaces |
| `ink-600` | `#55503F` | Dark muted text |
| `ink-500` | `#6E675C` | Muted text (on light) |
| `ink-300` | `#A39B8D` | Placeholder text, disabled (on light) |
| `paper-50` | `#F7F4EE` | Primary light background (ivory) |
| `paper-100` | `#F1EDE4` | Elevated light surfaces |
| `paper-200` | `#E8E2D4` | Light borders, subtle fills |
| `paper-300` | `#DCD4C2` | Hover fills on light |
| `bronze-400` | `#C2A678` | Bronze hover state |
| `bronze-500` | `#A98D5F` | **Primary accent** (labels, rules, small marks) |
| `bronze-600` | `#8F7649` | Accent on light, pressed state |
| `amber-glow` | `#E6C9A0` | Light accent (night surfaces, glow-free highlight) |

### Semantic tokens

| Token | Value | Purpose |
|---|---|---|
| `background` | `paper-50` (light) / `ink-950` (night) | Page background |
| `foreground` | `ink-900` / `paper-50` | Primary text |
| `muted` | `ink-500` / `ink-300` | Secondary text (ink-300 night ≈ 4.9:1 on ink-950) |
| `border` | `paper-200` / `ink-700` | Hairline borders |
| `accent` | `bronze-500` | Interactive accent, labels |
| `danger` | `#B34A3E` (light) / `#E07B6E` (night) | Errors (WCAG 4.5:1 on paper/ink) |
| `success` | `#3E7A4F` (light) / `#6FBF82` (night) | Success feedback |
| `focus` | `bronze-600` / `bronze-400` | Visible focus ring (2px) |

### Contrast contract (enforced)

- Body text: `ink-900` on `paper-50` and `paper-50` on `ink-950` → ≥ 12:1 ✅
- Muted text: `ink-500` on `paper-50` → **4.6:1** ✅ (body-sized)
- `bronze-500` on `paper-50` → ≈ 3.2:1 — **accent only**: large text ≥ 24px, icons, rules, or non-text indicators. Never body text on paper.
- `bronze-500` on `ink-950` → ≈ 2.9:1 — accent only on dark (large/icon/decorative).
- Focus rings: `bronze-600`/`bronze-400` at 2px offset → contrast ≥ 3:1 against adjacent.
- Danger/success tokens above chosen to pass 4.5:1 on their paired surfaces.

## 3. Typography

| Role | Family | Weights | Notes |
|---|---|---|---|
| Display | **Cormorant Garamond** | 300, 400, 500 | Editorial serif; large headlines, hero, quotes |
| Body/UI | **Manrope** | 400, 500, 600, 700 | Modern sans; body, nav, buttons, admin |

Loaded via `next/font/google` (`Cormorant_Garamond`, `Manrope`), `display: swap`.
Letter-spacing: display headlines `-0.01em`; overlines/labels `0.16em` uppercase.

### Type scale (fluid where noted)

| Step | Size / Line-height | Usage |
|---|---|---|
| `display-xl` | clamp(3rem, 7vw, 5.5rem) / 1.05 | Hero headline |
| `display-lg` | clamp(2.25rem, 4.5vw, 3.75rem) / 1.1 | Section headlines |
| `display-md` | clamp(1.75rem, 3vw, 2.5rem) / 1.15 | Sub-headlines, product titles |
| `heading-lg` | 1.5rem / 1.3 | Card/product titles |
| `heading-md` | 1.25rem / 1.4 | Admin headings, modal titles |
| `body-lg` | 1.125rem / 1.7 | Editorial paragraphs |
| `body` | 1rem / 1.7 | Default text |
| `body-sm` | 0.875rem / 1.6 | Secondary text |
| `overline` | 0.75rem / 1.2, 0.16em, uppercase | Labels, eyebrow, section markers |
| `caption` | 0.75rem / 1.5 | Captions, meta |

## 4. Spacing & Layout

- Spacing scale (4px base): `0, 1(4), 2(8), 3(12), 4(16), 6(24), 8(32), 10(40), 12(48), 16(64), 20(80), 24(96), 32(128)`.
- Container: `max-w-[1440px]` with fluid gutters `clamp(1.25rem, 4vw, 4rem)`.
- Editorial measure: prose max-width `65ch`; display lines `20ch` max per line where meaningful.
- Grid: 12-column desktop, 6-column tablet, 4-column mobile. Sections choose asymmetric editorial columns (e.g., 5/7, 4/6/2).

## 5. Breakpoints

| Name | Range | Behavior |
|---|---|---|
| mobile | < 640px | Single column, bottom-safe tap targets |
| tablet | 640–1023px | 6-col, nav collapses |
| desktop | 1024–1439px | 12-col, full nav |
| large | ≥ 1440px | Container caps at 1440px |

## 6. Radius, Borders, Shadows

| Token | Value |
|---|---|
| `radius-sm` | 4px (inputs, buttons) |
| `radius-md` | 8px (cards, admin) |
| `radius-full` | 9999px (pills) |
| Border | `1px solid border` — hairline, editorial |
| Shadow | `shadow-soft`: `0 1px 2px rgb(20 18 16 / 0.04), 0 8px 24px rgb(20 18 16 / 0.06)` |
| Shadow (raised) | `shadow-lifted`: `0 2px 4px rgb(20 18 16 / 0.05), 0 16px 48px rgb(20 18 16 / 0.12)` |
| Night shadows | same family, lower opacity (0.25/0.45) |

Cards stay **quiet**: subtle border, no big radius, no glow. Radius is a tool, not decoration.

## 7. Z-index Scale

| Layer | Value |
|---|---|
| base | 0 |
| sticky-nav | 40 |
| header (mobile menu) | 50 |
| overlay/backdrop | 60 |
| modal/dialog | 70 |
| lightbox | 80 |
| cursor (custom) | 90 |

## 8. Components (inventory)

- **Navigation**: transparent-on-hero → solid-on-scroll (`paper-50`/backdrop-blur), hairline border on scroll. Mobile: full-screen overlay menu.
- **Buttons**: primary (ink fill, paper text), outline (hairline border), text/arrow link (underline reveal). Rounded `radius-sm` unless pill variant. Hover: subtle fill shift + arrow move (see MOTION_SYSTEM).
- **Cards**: product card (image + overline + title + note hint), no generic 3-column grid repetition.
- **Forms**: inputs with visible labels, 4px radius, focus ring per §2, error + description text.
- **Dialog**: centered, `radius-md`, overlay `ink-950/60`, ESC + focus trap.
- **Accordion/FAQ**: border-top hairline rows, plus icon rotation.
- **Footer**: ink-950, overline columns, minimal.

## 9. Imagery Direction

- Photography: muted light, natural textures, human-scale craft (hands, glass, botanicals).
- Editorial crop: 4:5 products, 3:2 editorial, 16:9 hero/wide; always with explicit dimensions.
- No stock clichés (no floating perfume bottles on clouds). Alt text mandatory.

## 10. Admin vs Public

- Public: experience-first, editorial, generous type.
- Admin: density-first, clarity-first. Same tokens, smaller scale, subtle motion only.
- Admin never uses hero-level animation or scroll storytelling.
