# TESTING — Turaya Testing Strategy

> Unit (Vitest) · Integration (Supabase) · E2E (Playwright) · Manual/visual.
> A feature is not done until its tests pass (`PROJECT_RULES.md` §10).

---

## 1. Stack

| Layer | Tool | Runs |
|---|---|---|
| Unit | Vitest + Testing Library + user-event | `npm test` |
| Integration | Vitest against test Supabase (RLS active) | `npm test` |
| E2E | Playwright (Chromium; webkit/firefox smoke) | `npm run test:e2e` |
| Lint/type | ESLint + `tsc --noEmit` + Prettier | `npm run lint` / `npm run typecheck` |
| Accessibility | axe-core in Playwright | E2E suite |

## 2. Unit Tests (targets)

- `lib/validation` — every zod schema: valid/invalid/malformed inputs.
- `lib/utils` — slugify, formatters, cn.
- `lib/auth/guards` — role logic, missing-session behavior.
- `services/*` — domain logic with mocked Supabase client (RLS handled in integration).
- `lib/storage` — path sanitization, MIME/size rules.
- SEO builders — metadata shape for each route type.

## 3. Integration Tests (Supabase)

Against a disposable test project (RLS **enabled**):

- Public anon client: cannot read drafts/archived; reads published only.
- Editor client: CRUD own content; cannot touch settings/users.
- Admin client: settings/SEO/users read; role-change denied without super_admin.
- Server actions: validation failures → typed error objects; success paths write + audit.
- Storage: upload validation rejects bad MIME/size.

## 4. E2E Flows (Playwright)

| Flow | Covers |
|---|---|
| Login/logout/recovery | Auth sprint; wrong-password message; role redirects |
| Product CRUD + publish | Admin lifecycle; published product visible publicly; draft invisible |
| Collection/ingredient editing | Relations + ordering |
| Contact form | Success, validation errors, honeypot + rate limit |
| Journal publish | Draft → published visibility |
| Public homepage | Renders CMS sections; section hidden when invisible |
| Gallery lightbox | Keyboard + focus trap |

Accessibility: axe on homepage, product page, contact, admin list/form.

## 5. Manual / Visual Checklist (per sprint with UI)

- Responsive: 375 / 768 / 1280 / 1600 widths.
- Reduced motion emulation on hero + storytelling.
- Keyboard-only pass on nav, product page, gallery, contact.
- Typography/whitespace review against DESIGN_SYSTEM.md.
- Animation review against MOTION_SYSTEM.md budget.

## 6. CI Integration

- PR: typecheck → lint → unit+integration → build → Playwright (preview) → Lighthouse thresholds.
- `main`: same gates + deploy.
- Coverage gate: unit ≥ 80% for `lib/` and `services/`; critical E2E flows must pass (no coverage gate on E2E).

## 7. Fixtures & Data

- Test data = realistic placeholder content (CONTENT_GUIDELINES.md), never lorem ipsum.
- Seeds are idempotent (`supabase/seed`); tests reset between runs.
