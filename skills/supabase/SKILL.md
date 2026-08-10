# SKILL — Supabase (Core)

## Purpose
Correctly use Supabase: clients, queries, relations, migrations, generated types.

## When to Use
Any task touching the database, queries, or Supabase tooling.

## When NOT to Use
Auth flows (`supabase-auth`), storage (`supabase-storage`), RLS policy design (`supabase-rls`).

## Rules
1. Use the JS client; never raw SQL string interpolation.
2. Four clients only (`SUPABASE.md` §2): browser (anon), server (anon), middleware (anon), admin (service role, server-only, justified).
3. Prefer relational selects (`select('*, collection(*)')`) to avoid N+1; one query per view where practical.
4. Migrations are the only schema path (`supabase/migrations/`); regenerate types after schema change.
5. Respect RLS: write queries anon/server clients can execute; never bypass with service role casually.
6. Always select explicit columns (`select('id, name, slug')`), never `*` in production code.

## Workflow
1. Read `DATABASE.md` for schema, `SUPABASE.md` for client choice.
2. Query via the appropriate client; shape data into domain types in `services/`.
3. After schema change: migration → apply → `supabase gen types` → commit types.

## Examples
- `listPublishedProducts()`: server client, `.eq('status','published')`, order by `featured` desc, `created_at` desc.
- Product with notes: `select('*, product_ingredients(*, ingredient(*))')`.

## Common Mistakes
N+1 loops; selecting `*`; using admin client without justification; hand-editing production schema; forgetting type regeneration.

## Validation Checklist
- [ ] Correct client per context; RLS respected
- [ ] No N+1; explicit columns
- [ ] Types regenerated after schema changes
- [ ] Tests cover the query paths

## Related Documentation
`docs/SUPABASE.md`, `docs/DATABASE.md`, `docs/ARCHITECTURE.md` §6
