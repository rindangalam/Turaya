# SKILL — Code Review

## Purpose
Run the Code Review Gate before a feature is complete.

## When to Use
Completion of any feature, task, or significant change.

## When NOT to Use
During initial drafting (review after implementation).

## Rules
1. Review in order: architecture · security · performance · accessibility · UX · UI · animation · SEO · testing · documentation.
2. Fix issues before completion — do not defer silently.
3. Verify: no `any`/ts-ignore; tokens used; RLS respected; no secrets; no duplication; no AI slop; states defined; docs updated.
4. Check Definition of Done (`PROJECT_RULES.md` §10) — all 14 items.

## Workflow
1. Read the diff with context (what problem does it solve?).
2. Walk the review checklist; note findings.
3. Fix findings; re-run validation (typecheck/lint/tests/build).
4. Report: files changed, validation run, residual risks.

## Examples
- New product action: verify zod → guard → RLS-safe query → audit → typed result; tests cover success + failure.

## Common Mistakes
Reviewing only code (missing docs/UX/security); accepting `any`; skipping manual responsive/a11y checks; deferring known issues.

## Validation Checklist
- [ ] All 10 review dimensions passed
- [ ] DoD 14/14; no residual criticals
- [ ] Documentation updated; change control respected

## Related Documentation
`docs/CODE_STYLE.md` §7, `PROJECT_RULES.md` §10, `AGENT.md` §7
