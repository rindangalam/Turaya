# SKILL — Testing

## Purpose
Write the right tests at the right level: unit, integration, E2E, manual/visual.

## When to Use
Every feature implementation and bug fix.

## When NOT to Use
Writing the feature itself without tests.

## Rules
1. Unit (Vitest + Testing Library): validation schemas, utils, guards, services (mocked client), storage rules, SEO builders.
2. Integration: against test Supabase with RLS **enabled** — role access scenarios.
3. E2E (Playwright): login, product CRUD+publish, collection/ingredient edits, contact form, journal publish, homepage sections, gallery lightbox; axe in suite.
4. Coverage gate: `lib/` + `services/` ≥ 80%; critical E2E must pass.
5. Test data = realistic placeholder content, never lorem ipsum; seeds idempotent.
6. PR gates: typecheck → lint → unit/integration → build → E2E → Lighthouse.

## Workflow
1. Write/update tests alongside implementation.
2. Run local suites; fix flakes.
3. Verify CI gate passes.

## Examples
- RLS integration: anon cannot select drafts; editor cannot touch settings.
- E2E publish flow: create product as editor → publish → public page shows it; draft invisible.

## Common Mistakes
Testing implementation details; skipping RLS-enabled integration; flaky E2E selectors; no empty/error state tests.

## Validation Checklist
- [ ] Unit/integration/E2E green in CI
- [ ] Coverage gate met
- [ ] RLS scenarios covered; a11y checks in E2E

## Related Documentation
`docs/TESTING.md`, `docs/API.md` §7, `docs/SUPABASE.md` §3
