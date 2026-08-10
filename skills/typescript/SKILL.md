# SKILL — TypeScript

## Purpose
Write strict, readable, maintainable TypeScript per project conventions.

## When to Use
Any code written in this repository.

## When NOT to Use
SQL migrations, prose documentation.

## Rules
1. `strict: true`; no `any`, `ts-ignore`, `ts-expect-error` without documented justification.
2. Prefer explicit types at boundaries; inference inside functions.
3. Generated Supabase types are the DB contract (`lib/supabase/database.types.ts`); hand-typed domain models live in `src/types` and must not drift.
4. Unions over enums for domain values (`type Role = 'super_admin' | 'admin' | 'editor'`).
5. Server action results: `type ActionResult<T> = { ok: true; data: T } | { ok: false; fieldErrors?: ...; formError?: string }`.
6. `satisfies` for literal object validation; avoid casts.

## Workflow
1. Model the domain type first, then the function.
2. Import generated DB types for Supabase row shapes.
3. Write tests for validation/edge types (`TESTING.md` §2).

## Examples
- `getProductBySlug(slug: string): Promise<ProductWithNotes | null>` — service returns domain type.
- Zod schema infers input type: `z.infer<typeof createProductSchema>`.

## Common Mistakes
`any` to silence errors; over-narrowing; duplicating DB shapes by hand; untyped server action returns.

## Validation Checklist
- [ ] No `any`/ts-ignore; strict passes
- [ ] Types match generated Supabase types where applicable
- [ ] Actions return typed results

## Related Documentation
`docs/CODE_STYLE.md`, `docs/API.md`, `docs/DATABASE.md`
