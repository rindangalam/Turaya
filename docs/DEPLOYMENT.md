# DEPLOYMENT — Turaya Deployment & Operations

> Vercel (two deployments: public site + admin CMS) + Supabase (backend).
> Environments, CI/CD, rollback, post-launch.

---

## 1. Environments

| Env | URL | Data |
|---|---|---|
| Local | `localhost:3000` + `supabase start` | local Supabase |
| Preview | `vercel.app` per PR/branch | preview Supabase (or shared, branch-seeded) |
| Production — Public | public domain, CNAME to Vercel | production Supabase |
| Production — Admin | separate admin domain, CNAME to Vercel | production Supabase |

Env vars per `.env.example`; Supabase project per environment (separate prod project —
never share). Production keys exist only in Vercel env config, never in repo.

## 2. CI/CD

- **Git flow**: `main` (prod) · `develop` (integration) · `feature/*` `fix/*` `refactor/*` (`PROJECT_RULES.md` §9).
- **PR to develop**: typecheck → lint → unit/integration → build → E2E on preview → Lighthouse gate.
- **develop → main**: full gate + migration check + production deploy (Vercel).
- **Migrations**: applied to the target environment's Supabase as part of the pipeline
  (Supabase CLI `db push`), ordered and locked; never skipped on deploy.
- **Database types**: regenerated (`supabase gen types`) and committed before UI code that uses them.

## 3. Deployments: Public vs Admin

One repo, two Vercel projects. Route isolation happens **at build time** via
`NEXT_PUBLIC_APP_TARGET`: `scripts/build-target.mjs` physically removes the
other app's routes before `next build`, so neither artifact contains the other.

| | Public project | Admin project |
|---|---|---|
| Build Command | `npm run build:target` | `npm run build:target` |
| `NEXT_PUBLIC_APP_TARGET` | `public` (default when unset) | `admin` |
| Routes in artifact | public pages only (+ robots, sitemap, OG) | `/admin/*`, `/login`, `/update-password`, `/auth/*` only |
| `NEXT_PUBLIC_SITE_URL` | public canonical URL | **admin domain** (password-reset links point here) |
| Production Branch | `main` | `main` |

Rules:

- MUST set `NEXT_PUBLIC_APP_TARGET` per Vercel project; unset builds `public`.
- On the public deployment, `/admin*` and `/login` answer a direct 404 from
  `src/proxy.ts` — no redirect that would reveal the auth surface (the routes
  do not exist in that artifact anyway).
- Both projects share one Supabase project; session cookies are per-domain, so
  logins on each deployment are independent.
- MUST add the admin URL to Supabase Auth → URL Configuration → Redirect URLs
  (`https://<admin-domain>/**`) so recovery links resolve to the admin deployment.
- MUST extend the route lists in `scripts/build-target.mjs` when adding routes
  exclusive to one deployment.
- `npm run build` (full build, all routes) stays available for local checks;
  only the Vercel projects use `build:target`.

## 4. Production Go-Live Checklist (Sprint 18–19)

- [ ] Env vars configured in Vercel + Supabase; no secrets in repo
- [ ] Dual deployment verified: `/<public-domain>/admin` → 404, `<admin-domain>/admin` → login
- [ ] Supabase prod: signups disabled, email provider verified (recovery emails)
- [ ] Security headers + CSP active; HTTPS/HSTS
- [ ] Sitemap/robots correct for prod; OG images live
- [ ] Placeholder gate: no `[PLACEHOLDER]` in published content (`CONTENT_GUIDELINES.md`)
- [ ] Analytics opt-in configured (privacy-respecting, e.g. Vercel Analytics)
- [ ] Error monitoring active (e.g. Sentry or Vercel Error Tracking)
- [ ] Rollback plan documented (§5)
- [ ] Web Vitals baseline captured post-launch
- [ ] Post-launch checklist: sitemap submit, Search Console verified, monitoring alerts

## 5. Rollback Plan

1. **Code**: Vercel redeploy of previous production release (instant, zero-downtime).
   Rollback is per-project — public and admin deployments are independent.
2. **Schema**: migrations are forward-only; destructive changes require a documented
   backward-compatible migration or explicit data plan before merge. Emergency data
   restore from Supabase point-in-time backups (enable PITR before launch).
3. **Content**: content changes are reversible via admin; destructive content actions
   require archive-first discipline (soft delete) except messages.

## 6. Monitoring & Observability

- Error tracking: production errors surfaced; raw DB errors never reach clients (API.md §5).
- Audit logs answer "who did what" (`SUPABASE.md` §5).
- Web Vitals: LCP/CLS/INP tracked post-launch; alert on regression vs. §1 targets.
- Minimal infrastructure: no custom metrics infra in v1 — Vercel + Supabase + error
  tracking only (justified additions only).

## 7. Maintenance Windows

- No scheduled downtime expected (Vercel immutable deploys). Supabase maintenance is
  provider-managed; test schema changes on preview first.
