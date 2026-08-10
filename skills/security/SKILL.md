# SKILL — Security

## Purpose
Apply defense-in-depth: RLS as data boundary, server-side authz, validation, safe uploads, secrets hygiene.

## When to Use
Any server action, query, upload, form, env change, or auth/authorization code.

## When NOT to Use
Policy design specifics (that's `supabase-rls`), auth flows (`supabase-auth`).

## Rules
1. Never trust client input — zod validation on every server action.
2. Service role key server-only; never in client code/logs/env of client scope.
3. Guards on every protected route/action (`requireAuth`/`requireRole`); fail closed.
4. Uploads: MIME allowlist + size caps + sanitized paths.
5. Generic error messages; no raw DB/stack errors to clients.
6. Rate limits: login 5/15min, contact 5/hr/IP, uploads 20/hr/user.
7. Headers: nosniff, referrer policy, frame deny, permissions policy, CSP reviewed.

## Workflow
1. Identify threat surface (mutation, upload, form, env).
2. Apply validation → guard → RLS-compatible query → audit.
3. Verify no secrets in payloads/logs; run audit (`npm audit`).

## Examples
- Contact action: zod schema → honeypot + rate limit → insert `contact_messages` (RLS allows anon insert only) → typed result.
- Upload: MIME/size check → uuid path → storage → DB row.

## Common Mistakes
Client-side-only validation; service role in actions; raw errors; trusting filenames; missing rate limits.

## Validation Checklist
- [ ] Validation + guards before any write
- [ ] No secrets exposed; headers set
- [ ] Rate limits active; audits written
- [ ] Security checklist (`SECURITY.md` §2) green

## Related Documentation
`docs/SECURITY.md`, `docs/SUPABASE.md`, `docs/API.md`, `docs/AUTH.md`
