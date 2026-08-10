# DEPLOYMENT — Turaya Deployment & Operations

> Vercel (web) + Supabase (backend). Environments, CI/CD, rollback, post-launch.

---

## 1. Environments

| Env | URL | Data |
|---|---|---|
| Local | `localhost:3000` + `supabase start` | local Supabase |
| Preview | `vercel.app` per PR/branch | preview Supabase (or shared, branch-seeded) |
| Production | turaya domain (CNAME to Vercel) | production Supabase |

Env vars per `.env.example`; Supabase project per environment (separate prod project —
never share). Production keys exist only in Vercel env config, never in repo.

## 2. CI/CD

- **Git flow**: `main` (prod) · `develop` (integration) · `feature/*` `fix/*` `refactor/*` (`PROJECT_RULES.md` §9).
- **PR to develop**: typecheck → lint → unit/integration → build → E2E on preview → Lighthouse gate.
- **develop → main**: full gate + migration check + production deploy (Vercel).
- **Migrations**: applied to the target environment's Supabase as part of the pipeline
  (Supabase CLI `db push`), ordered and locked; never skipped on deploy.
- **Database types**: regenerated (`supabase gen types`) and committed before UI code that uses them.

## 3. Production Go-Live Checklist (Sprint 18–19)

- [ ] Env vars configured in Vercel + Supabase; no secrets in repo
- [ ] Supabase prod: signups disabled, email provider verified (recovery emails)
- [ ] Security headers + CSP active; HTTPS/HSTS
- [ ] Sitemap/robots correct for prod; OG images live
- [ ] Placeholder gate: no `[PLACEHOLDER]` in published content (`CONTENT_GUIDELINES.md`)
- [ ] Analytics opt-in configured (privacy-respecting, e.g. Vercel Analytics)
- [ ] Error monitoring active (e.g. Sentry or Vercel Error Tracking)
- [ ] Rollback plan documented (§4)
- [ ] Web Vitals baseline captured post-launch
- [ ] Post-launch checklist: sitemap submit, Search Console verified, monitoring alerts

## 4. Rollback Plan

1. **Code**: Vercel redeploy of previous production release (instant, zero-downtime).
2. **Schema**: migrations are forward-only; destructive changes require a documented
   backward-compatible migration or explicit data plan before merge. Emergency data
   restore from Supabase point-in-time backups (enable PITR before launch).
3. **Content**: content changes are reversible via admin; destructive content actions
   require archive-first discipline (soft delete) except messages.

## 5. Monitoring & Observability

- Error tracking: production errors surfaced; raw DB errors never reach clients (API.md §5).
- Audit logs answer "who did what" (`SUPABASE.md` §5).
- Web Vitals: LCP/CLS/INP tracked post-launch; alert on regression vs. §1 targets.
- Minimal infrastructure: no custom metrics infra in v1 — Vercel + Supabase + error
  tracking only (justified additions only).

## 6. Maintenance Windows

- No scheduled downtime expected (Vercel immutable deploys). Supabase maintenance is
  provider-managed; test schema changes on preview first.
