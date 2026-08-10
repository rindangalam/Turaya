# SKILL — Supabase RLS

## Purpose
Design, write, and verify Row Level Security policies per the role matrix.

## When to Use
Creating tables, writing policies, auditing data access, seed data, policy tests.

## When NOT to Use
Auth flows, storage object policies (bucket-level, see `supabase-storage`).

## Rules
1. Every protected table has policies; matrix in `SUPABASE.md` §3 is authoritative.
2. Reuse SQL helper functions: `is_editor()`, `is_admin()`, `is_super_admin()` (`is_authenticated` for any authed user).
3. Public = SELECT published/visible rows only. Never public SELECT on drafts, settings internals, messages, audit.
4. Append-only tables (audit_logs) get no UPDATE/DELETE policies.
5. Service role bypasses RLS — restrict its use to justified flows only.
6. A migration that touches a table must update the RLS matrix + `RBAC.md`.

## Workflow
1. Identify table + roles from matrix.
2. Write policies (e.g., `create policy ... for select to authenticated using (is_editor())`).
3. Test: anon cannot read drafts; editor cannot touch settings; admin can; super_admin everything.
4. Document any change in `SUPABASE.md` matrix.

## Examples
- `products` SELECT: `to anon using (status = 'published' and deleted_at is null)`.
- Editor INSERT: `to authenticated using (is_editor()) with check (is_editor())`.

## Common Mistakes
`using (true)` for content tables; forgetting `deleted_at is null`; public read of contact data; service-role queries in user flows.

## Validation Checklist
- [ ] Matrix updated; helpers reused
- [ ] Policy tests: anon/editor/admin/super_admin scenarios pass
- [ ] No public access to protected columns/tables

## Related Documentation
`docs/SUPABASE.md` §3, `docs/DATABASE.md`, `docs/RBAC.md`, `docs/SECURITY.md`
