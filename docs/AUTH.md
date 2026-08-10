# AUTH — Turaya Authentication

> Authentication is **Supabase Auth** (email/password + magic links if enabled later).
> No custom password implementation. Role matrix: `RBAC.md`. Client setup: `SUPABASE.md`.

---

## 1. Flows

| Flow | Implementation |
|---|---|
| Login | Email + password via `signInWithPassword`; server action; error messages generic ("Invalid credentials") |
| Logout | Server action → `signOut` → redirect `/` |
| Session | Supabase session in cookies; refreshed by middleware |
| Password recovery | `resetPasswordForEmail` → email link → `updateUser` with new password |
| Sign-up | Disabled publicly (invite-based; admins create editor accounts or SQL-bootstrapped) |

## 2. Session Handling

- `src/proxy.ts` (Next 16 `proxy` convention, nodejs runtime): refresh session on every
  request; no page render until session known for protected routes.
- Server helpers expose `getUser()` (auth) and `getRole()` (profiles role) once per request.
- Session cookie flags: `SameSite=Lax`, `Secure` in production (Supabase defaults respected).
- No session data in localStorage; rely on cookie-based Supabase auth helpers.

## 3. Route Protection

| Surface | Guard |
|---|---|
| `/admin/**` | Authenticated **and** role in `(super_admin, admin, editor)` → else redirect `/login` |
| `/admin/users/**` | `admin`+ (`RBAC.md`) |
| `/login` | Redirect to `/admin` if already authenticated |
| Public routes | No auth required; anon RLS reads published content only |

Guard helpers in `src/lib/auth/guards.ts`:
`requireAuth()`, `requireRole('admin'|'super_admin'|'editor')` — each throws/redirects and is
callable from server components, server actions, and route handlers. **Never** trust a
client-side `auth.getUser()` result for authorization decisions.

## 4. Rate Limiting

- Login attempts: exponential backoff per email/IP (Supabase Auth built-in protections +
  app-level guard on the login action).
- Contact form: honeypot field + IP-based limit (e.g., 5/hour) in the server action.

## 5. Audit

- `auth.login` / `auth.login_failed` / `auth.logout` written to `audit_logs` from server
  actions (see `SUPABASE.md` §Audit).

## 6. Configuration Checklist

- Auth providers: Email enabled; signups disabled (invite flow).
- Redirect URLs allow only production + preview origins.
- Session lifetime: default (long-lived with refresh); refresh tokens rotated.
- Confirm email: enabled if public signup is ever enabled.
- MFA: out of scope for v1; documented as future enhancement.
