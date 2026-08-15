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
- [x] Security headers via Next.js config: `X-Content-Type-Options: nosniff`,
      `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`,
      `Permissions-Policy` (camera/mic/geolocation off), HSTS
- [x] CSP in place (`frame-ancestors 'none'`, `base-uri`, `form-action`);
      `script-src` allows `'unsafe-inline' 'unsafe-eval'` for Next hydration +
      GSAP/Motion — see §5 Known Limitations #2 for the nonce upgrade path
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

## 5. Known Limitations (accepted hardening debt)

Documented so they are not silently lost. Neither is a blocker; both require
infrastructure or framework setup beyond the current codebase.

1. **Rate limits are in-process only.** `loginRateLimit` (`src/lib/auth/rate-limit.ts`)
   and the contact-form limiter (`src/features/contact/actions.ts`) use an in-memory
   `Map`. Correct per-instance; a multi-instance deployment (e.g. Vercel serverless)
   can rotate past them because state is not shared. Supabase Auth's own protections
   remain the primary login defense. **Fix when multi-instance:** move to a shared
   store (Redis/Upstash) keyed by email+IP.

2. **CSP allows `'unsafe-inline'` / `'unsafe-eval'` in `script-src`.**
   `next.config.ts` needs them for Next.js hydration + GSAP/Motion. This weakens
   inline-script XSS protection. **Fix when time allows:** switch to nonce/hash-based
   CSP (Next.js `middleware`-injected nonces) and drop the inline allowances.

3. **Session cookie attributes follow Supabase defaults.** `Secure`/`SameSite` are set
   by the Supabase Auth server; they are not pinned in app code. Verify on the live
   domain that cookies are served with `Secure; HttpOnly; SameSite=Lax`.

4. **`/api/og` fetches fonts at build/edge runtime.** URLs are hardcoded to
   `fonts.gstatic.com`, so it is not an SSRF primitive; it does add a network call on
   first render. Consider inlining the font files if offline resilience matters.
