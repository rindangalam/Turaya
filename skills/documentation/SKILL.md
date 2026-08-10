# SKILL — Documentation

## Purpose
Keep documentation truthful, current, and contradiction-free — documentation-first workflow.

## When to Use
Every task (read first), and whenever a change affects architecture, schema, tokens, or process.

## When NOT to Use
When documentation conflicts with approved decisions — surface the conflict instead (stop-and-report).

## Rules
1. Read before implementing: hierarchy in `docs/README.md` §1.
2. Docs are the source of truth; code follows docs, not vice versa.
3. After any change: update affected docs (architecture, schema, RLS matrix, features, tokens, decision log).
4. Change control: architecture-impacting changes require a decision record first (`PROJECT_RULES.md` §CHANGE CONTROL).
5. No generic motivational filler — dense, actionable, specific.
6. Keep the decision log (`docs/README.md` §4) current.

## Workflow
1. Read relevant docs (per source-of-truth hierarchy).
2. Implement. 3. Update docs affected by the change.
4. Run cross-check protocol (`docs/README.md` §3) for significant changes.

## Examples
- New table added → migration + `DATABASE.md` + RLS matrix in `SUPABASE.md` + `RBAC.md` + decision log if architectural.
- New motion token → `MOTION_SYSTEM.md` only.

## Common Mistakes
Skipping docs; silently changing architecture; leaving stale RLS matrices; filler documentation.

## Validation Checklist
- [ ] Affected docs updated
- [ ] Cross-check passes; no contradictions
- [ ] Decision log current

## Related Documentation
`docs/README.md`, `PROJECT_RULES.md` §1, `AGENT.md` §4
