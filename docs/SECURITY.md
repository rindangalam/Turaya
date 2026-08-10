# SECURITY — Turaya Security Specification

> Security posture: defense in depth. The database (RLS) is the boundary; server-side
> authorization is the gate; validation is the filter; secrets never leave the server.

---

## 1. Principles

1. **Never trust client input** — validate everything server-side (zod).
2. **RLS is the data boundary** — even a compromised UI cannot read what policies deny.
3. **Service role key is server-only** — never in client bundle, logs, or env of client scope.
4. **Least privilege** — roles per `RBAC.md`; guards on every protected action.
5. **Fail closed** — missing session/role → deny + redirect, never partial data.

## 2. Checklist (Sprint 17 audit source)

### Authentication & Session
- [ ] Supabase Auth only; no custom passwords
- [ ] Login rate-limited (5/15min per email+IP)
- [ ] Session refreshed in middleware; `Secure` cookies in prod
- [ ] Recovery link flow without account enumeration
- [ ] Logout invalidates session

### Authorization
- [ ] Route guards: `requireAuth`, `requireRole` on every admin route/action
- [ ] RLS policies per `SUPABASE.md` §3 — verified by policy tests
- [ ] No client-side-only authorization for any sensitive operation
- [ ] Role changes only by super_admin, audited

### Input Validation
- [ ] Every server action: zod schema (types, length caps, slug pattern)
- [ ] Contact form: honeypot + rate limit
- [ ] No raw SQL interpolation anywhere (JS client / parameter binding only)

### Uploads (Supabase Storage)
- [ ] MIME allowlist (image/jpeg, png, webp, avif; svg only in branding)
- [ ] Size caps (8MB photos / 2MB branding)
- [ ] Sanitized paths (uuid filenames, never client-supplied)
- [ ] Buckets not writable by anon

### Infrastructure & Headers
- [ ] Security headers via Next.js config: `X-Content-Type-Options: nosniff`,
      `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`,
      `Permissions-Policy` (camera/mic/geolocation off)
- [ ] CSP reviewed (inline scripts scoped; `next/font` etc. allowed); nonce/`unsafe-inline` avoided
- [ ] HTTPS only (Vercel); HSTS in prod

### Secrets & Environment
- [ ] `.env.example` only lists keys; real values never committed
- [ ] Env validation fails fast (`lib/env.ts`)
- [ ] No secrets in client components, audit metadata, or error messages

### Data Protection & Ops
- [ ] `contact_messages` PII: readable only by staff roles; no public SELECT
- [ ] Audit logs append-only (`SUPABASE.md` §5)
- [ ] Error surfaces never echo DB/stack details (API.md §5)
- [ ] Dependency audit in CI (`npm audit` gate, no criticals)

### Rate Limiting Summary
| Surface | Limit |
|---|---|
| Login | 5 / 15 min / email+IP |
| Contact form | 5 / hour / IP |
| Uploads | 20 / hour / user (admin guard + per-bucket caps) |
| Generic API | 100 / min / IP (route handlers) |

## 3. Threat Model Highlights (v1 scope)

| Threat | Mitigation |
|---|---|
| Data theft via exposed anon key | RLS denies non-published rows; published-only exposure is intended |
| Privilege escalation | `user.role_change` audited + super_admin-only; guards double-check role from DB |
| Uploaded malware/oversize | MIME+size validation; served via image optimizer |
| Form spam/abuse | honeypot + rate limits |
| CSRF on state changes | Server Actions same-origin + Supabase session; no cross-origin mutation endpoints |
| XSS via journal markdown | sanitized renderer (e.g. `rehype-sanitize`); no `dangerouslySetInnerHTML` with raw content |

## 4. Release Gate

Sprint 17 checklist above must be 100% green (or explicitly mitigated + documented)
before production deployment.
