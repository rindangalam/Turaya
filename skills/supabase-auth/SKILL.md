# SKILL — Supabase Auth

## Purpose
Implement and maintain authentication: login, logout, sessions, password recovery, route protection.

## When to Use
Auth flows, session handling, middleware, protected routes, login/logout actions.

## When NOT to Use
Role/permission design (`supabase-rls`, `RBAC.md`), content queries.

## Rules
1. Supabase Auth only — no custom password implementations.
2. Session in cookies via server/middleware clients; never localStorage tokens.
3. Middleware refreshes the session on protected paths before render.
4. Authorization uses DB role (`profiles.role` via server query), not client claims alone.
5. Generic error messages ("Invalid credentials") — no account enumeration.
6. Rate-limit login attempts (5/15min per email+IP) and audit `auth.login*`.

## Workflow
1. Read `AUTH.md`.
2. Implement action(s) with zod + guard + Supabase call + audit.
3. Wire middleware refresh; verify redirects (`/admin` ↔ `/login`).
4. Test: login/logout/recovery/role redirects (Playwright).

## Examples
- Login action: validate → `signInWithPassword` → audit → redirect `/admin`.
- Guard: `requireRole('admin')` throws/redirects before any mutation.

## Common Mistakes
Storing tokens client-side; trusting client `getUser()` for authorization; leaking account existence; missing session refresh in middleware.

## Validation Checklist
- [ ] All flows from `AUTH.md` §1 implemented and tested
- [ ] Generic errors; rate limits active; audits written
- [ ] No token storage in localStorage

## Related Documentation
`docs/AUTH.md`, `docs/RBAC.md`, `docs/SUPABASE.md` §2, `docs/SECURITY.md`
