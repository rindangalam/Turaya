# SKILL — Prisma

## Purpose
Use Prisma **only if** the project has adopted it (currently: not adopted — see `ARCHITECTURE.md` §2 decision log).

## When to Use
Only when a documented justification has been approved (change control in `PROJECT_RULES.md`). Otherwise: do not use.

## When NOT to Use
Default Turaya data access — Supabase SQL migrations + generated types are the standard.

## Rules
1. Never introduce Prisma without an approved decision; the decision log (`docs/README.md` §4) is the source of truth.
2. If adopted: schema mirrors `DATABASE.md` exactly; migrations replace Supabase CLI migrations only by explicit decision.
3. Service role / connection strings stay server-only.

## Workflow
1. Confirm adoption in decision log.
2. If not adopted: stop and use Supabase tooling instead.

## Examples
(n/a until adopted — placeholder rule: do not invent usage patterns)

## Common Mistakes
Adding Prisma "because it's common"; dual migration systems (Prisma + Supabase CLI) drifting out of sync.

## Validation Checklist
- [ ] Adoption decision recorded; schema matches DATABASE.md
- [ ] No client-bundle exposure of connection strings

## Related Documentation
`docs/ARCHITECTURE.md` §2, `docs/README.md` §4 (decision log), `docs/DATABASE.md`
