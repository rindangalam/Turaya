# ACCESSIBILITY — Turaya Accessibility Specification

> Target: **WCAG 2.2 AA** where practical. Accessibility is a requirement, not a polish item.

---

## 1. Core Requirements

| Area | Requirement |
|---|---|
| Semantics | Native elements first: `header/nav/main/footer/section/article/form`; one `h1` per page; heading order respected |
| Keyboard | Everything operable by keyboard; visible focus everywhere |
| Focus | Focus trap + return focus in dialogs/lightbox; skip link to main content |
| Screen readers | Labels on all inputs; `aria-live` for dynamic updates; `aria-expanded` on disclosure toggles; `alt` on all images |
| Contrast | Text ≥ 4.5:1, large ≥ 3:1, UI components ≥ 3:1 (`DESIGN_SYSTEM.md` §2 contract) |
| Motion | `prefers-reduced-motion` fully honored (`MOTION_SYSTEM.md` §7) |
| Touch | Target size ≥ 44×44px (WCAG 2.2 2.5.8); no hover-only essential functions |
| Errors | Error summary + focus to first error; error text associated via `aria-describedby` |
| Language | `lang` set on `<html>` and for any content in another language |

## 2. Component-Level Rules

- **Navigation**: mobile menu — button with `aria-expanded`/`aria-controls`, ESC closes,
  focus moved to menu, return focus on close.
- **Dialog/Lightbox**: `role="dialog"`, `aria-modal="true"`, labelled by title, focus
  trapped, ESC closes, backdrop click closes (desktop), scroll locked.
- **Accordion/FAQ**: buttons with `aria-expanded` + region; chevron rotates (motion L1).
- **Forms**: visible label for every field; hints via `aria-describedby`; required
  indicated both visually and in `aria-required`; errors inline + summary.
- **Product notes pyramid**: interactive elements are `<button>`s with `aria-expanded`;
  revealed panel is a region; keyboard operable.
- **Custom cursor / previews**: never the only feedback; content available without them.
- **Toasts (admin)**: `role="status"` (success) / `role="alert"` (error), polite region.
- **Skeletons**: `aria-hidden` + real content/label when loaded; never announce "loading" loops.

## 3. Reduced Motion

Per `MOTION_SYSTEM.md` §7: L3 disabled, reveals static, Lenis off, marquee static,
transitions ≤ 150ms. Verify in devtools emulation for both OS settings.

## 4. Testing & Audit

| Level | Method |
|---|---|
| Automated | `axe-core` in CI (Playwright); Lighthouse a11y ≥ 90 |
| Manual | Keyboard-only pass; NVDA/VoiceOver walkthrough of homepage, product page, contact, admin core |
| Focused | Focus order verification; contrast spot checks of all token pairs; reduced-motion emulation |
| Design | All token pairs documented with ratios (`DESIGN_SYSTEM.md` §2) |

## 5. Known Constraints & Exceptions (documented, not silent)

- Bronze accent is decorative/large-text only (contrast ≈ 3.2:1 on paper) — never body text.
- Horizontal gallery: fallback to accessible scrolling with keyboard focus on items.
- Any exception must be recorded here with rationale before release.
