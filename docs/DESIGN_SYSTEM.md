# DESIGN_SYSTEM — Turaya

> The visual language of Turaya, formalized as tokens. No arbitrary design values in code.
> Motion tokens live in `MOTION_SYSTEM.md`.

---

## 1. Design Direction

Turaya's visual language: **dark luxury — cinematic, restrained, modern.**
Noir surfaces, champagne gold accents, ivory text; a private-club perfumery feel.

- Dark-first: the public site is **dark-only** (no light mode for visitors).
- Editorial composition over decorative layout; darkness is the canvas.
- Typography carries most of the emotional weight (Cormorant display on noir).
- One accent moment per viewport (champagne). Never compete.
- Imagery is photographic, low-key, atmospheric (deep shadows, candlelight, amber glass).
- References (quality only, never copied): Tom Ford, Diptyque, Frederic Malle, Byredo.

**Banned**: excessive rounded cards, excessive gradients, glassmorphism, random glow,
random particles, floating elements, fake statistics, icon soup.

## 2. Color System

Palette derives from cool charcoal neutrals (noir) + warm ivory text + a single
champagne gold accent.

### Raw tokens

| Token | Value | Usage |
|---|---|---|
| `noir-950` | `#0B0B0C` | **Primary background** (page, footer) |
| `noir-900` | `#141416` | Elevated dark surfaces (cards) |
| `noir-800` | `#1D1D21` | Inputs, hover surfaces |
| `noir-700` | `#26262B` | Borders on dark |
| `noir-600` | `#3A3A41` | Dark muted fills |
| `noir-500` | `#5C5C64` | Muted fills (charts) |
| `noir-400` | `#76767E` | Disabled borders |
| `noir-300` | `#8E8E96` | Placeholder text, disabled |
| `ivory-50` | `#F5F2EC` | **Primary text** (warm off-white) |
| `ivory-100` | `#ECE7DD` | Secondary text, primary button fill |
| `ivory-200` | `#DDD6C8` | Hairline fills |
| `ivory-300` | `#C9C1B0` | Muted text on dark |
| `champagne-300` | `#E3C98F` | Focus ring, hover accent, large accent |
| `champagne-400` | `#D4B577` | Interactive accent, focus ring |
| `champagne-500` | `#C9A96A` | **Primary accent** (labels, rules, small marks) |
| `champagne-600` | `#A8894F` | Accent pressed/disabled state |

### Semantic tokens (dark luxury — public)

| Token | Value | Purpose |
|---|---|---|
| `background` | `noir-950` | Page background |
| `foreground` | `ivory-50` | Primary text |
| `muted` | `noir-800` / `ivory-300` | Muted surfaces / secondary text |
| `border` | `noir-700` | Hairline borders |
| `accent` | `champagne-500` | Interactive accent, labels |
| `danger` | `#E07B6E` | Errors (≥ 4.5:1 on noir-950) |
| `success` | `#6FBF82` | Success feedback |
| `focus` | `champagne-400` | Visible focus ring (2px) |

### Admin-neutral tokens (light, utilitarian)

The admin panel (§10) runs on a **separate light scale** built from neutral
grays (`neutral-50`–`neutral-950`): `background = neutral-50`,
`foreground = neutral-900`, `border = neutral-200`, `primary = neutral-900`,
`destructive = #B4232C`. No brand colors in admin. These live in `:root` and
are re-declared under the `.admin` scope in `globals.css`.

### Contrast contract (enforced)

- Body text: `ivory-50` on `noir-950` → **≈ 14:1** ✅
- Muted text: `ivory-300` on `noir-950` → **≈ 5.9:1** ✅ (body-sized)
- `champagne-500` on `noir-950` → ≈ 6.3:1 — safe for **labels and small text**;
  `champagne-600` on `noir-950` → ≈ 4.6:1 — secondary accent only.
- Focus rings: `champagne-400` at 2px offset → contrast ≥ 3:1 against adjacent.
- Danger/success tokens above chosen to pass 4.5:1 on their paired surfaces.
- Admin light scale: text `neutral-900` on `neutral-50` → **≈ 16:1** ✅;
  muted `neutral-600` on `neutral-50` → **≈ 4.6:1** ✅.

## 3. Typography

| Role | Family | Weights | Notes |
|---|---|---|---|
| Display | **Cormorant Garamond** | 300, 400, 500 | Editorial serif; large headlines, hero, quotes |
| Body/UI | **Figtree** | 400, 500, 600, 700 | Humanist sans; body, nav, buttons, admin |

Loaded via `next/font/google` (`Cormorant_Garamond`, `Figtree`), `display: swap`.
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
| Shadow | `shadow-soft`: `0 1px 2px rgb(11 11 12 / 0.25), 0 8px 24px rgb(11 11 12 / 0.35)` |
| Shadow (raised) | `shadow-lifted`: `0 2px 4px rgb(11 11 12 / 0.3), 0 16px 48px rgb(11 11 12 / 0.45)` |

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

- **Navigation**: transparent-on-hero → solid-on-scroll (`noir-950/90` + backdrop-blur), hairline border on scroll. Mobile: full-screen overlay menu.
- **Buttons**: primary (ivory fill, noir text), outline (hairline border), text/arrow link (underline reveal). Rounded `radius-sm` unless pill variant. Hover: subtle fill shift + arrow move (see MOTION_SYSTEM).
- **Cards**: product card (image + overline + title + note hint), no generic 3-column grid repetition.
- **Forms**: inputs with visible labels, 4px radius, focus ring per §2, error + description text.
- **Dialog**: centered, `radius-md`, overlay `noir-950/80`, ESC + focus trap.
- **Accordion/FAQ**: border-top hairline rows, plus icon rotation.
- **Footer**: noir-950, overline columns, minimal.

## 9. Imagery Direction

- Photography: low-key, cinematic — deep shadows, candlelight, amber glass, natural textures.
- Editorial crop: 4:5 products, 3:2 editorial, 16:9 hero/wide; always with explicit dimensions.
- No stock clichés (no floating perfume bottles on clouds). Alt text mandatory.

## 10. Admin vs Public

- Public: dark-only luxury; experience-first, editorial, generous type, champagne accents.
- Admin: **separate light, neutral, utilitarian surface** — no brand colors, density-first,
  clarity-first, smaller scale, subtle motion only. Enforced by the `.admin` token scope in
  `globals.css` applied on the `/admin` layout wrapper.
- Admin never uses hero-level animation or scroll storytelling.
