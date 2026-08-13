# RBAC — Turaya Role-Based Access Control

> Roles: **super_admin**, **admin**, **editor**. Enforcement at three layers:
> routes (middleware/guards), UI (component visibility), database (RLS — `SUPABASE.md`).
> The database layer is the authority; UI hiding is presentation only.

---

## 1. Role Definitions

| Role | Description |
|---|---|
| **Super Admin** | Full control: all content, users, roles, settings, audit logs, purges. |
| **Admin** | All content + user management (read), settings, SEO, messages. Cannot change roles. |
| **Editor** | Content authoring only: products, collections, ingredients, gallery, journal, testimonials, FAQ, stores. Shared inbox: read/update messages (no delete). No settings, no users, no SEO edits. |

## 2. Route Permission Matrix

| Route | super_admin | admin | editor |
|---|---|---|---|
| `/admin` (dashboard) | ✅ | ✅ | ✅ |
| `/admin/homepage` (sections) | ✅ | ✅ | ✅ |
| `/admin/products`, `/admin/collections`, `/admin/categories`, `/admin/ingredients`, `/admin/gallery`, `/admin/journal`, `/admin/testimonials`, `/admin/stores` | ✅ | ✅ | ✅ |
| `/admin/messages` | ✅ | ✅ | ✅ |
| `/admin/seo` | ✅ | ✅ | — |
| `/admin/settings` | ✅ | ✅ | — |
| `/admin/users` | ✅ | ✅ | — |
| `/login` | redirect if authed | redirect if authed | redirect if authed |

## 3. UI Permission Matrix

| UI element | super_admin | admin | editor |
|---|---|---|---|
| Sidebar: content sections | ✅ | ✅ | ✅ |
| Sidebar: Homepage sections | ✅ | ✅ | ✅ |
| Sidebar: Users, Settings, SEO | ✅ | ✅ | — (hidden) |
| Product actions: publish/archive | ✅ | ✅ | ✅ |
| Product actions: delete | ✅ | ✅ | — (archive only) |
| Role management controls | ✅ | — | — |
| Audit log viewer | ✅ | ✅ | — |

## 4. Database Permission Matrix

(Authoritative — see `SUPABASE.md` §3 for the full table.)

| Resource | editor | admin | super_admin |
|---|---|---|---|
| Content tables (products, collections, ingredients, gallery, journal, testimonials, faq, stores) | CRUD (own-scope where present: journal) | All | All |
| `profiles` | self | select all, update non-role fields | All |
| `audit_logs` | — | select | select, purge |
| `site_settings` | — | update | all |
| `seo_metadata` | select | all | all |
| `contact_messages` | select/update (staff inbox) | all | all |

## 5. Content Permission Rules (editors)

- Create: allowed; resources owned by creator (`author_id`/creator columns where present).
- Update/delete: own records; drafts always editable by owner.
- Publish/unpublish: allowed on own content (with audit entry).
- Admin edits any record; deletes require the record to be `archived` first (soft-delete discipline).

## 6. Enforcement Order

1. **RLS** — row-level truth. 2. **Server guards** (`lib/auth/guards.ts`) — route/action-level.
3. **UI** — hide disallowed actions for clarity (never treated as security).

## 7. Role Bootstrap & Changes

- First super admin created via SQL during Sprint 4 (documented, audited).
- Role changes: only super_admin; every change writes `audit_logs` (`user.role_change`).
- Downstream: `supabase.auth.admin.updateUserById` (server-only) + `profiles.role` update,
  both in one server action with the guard `requireRole('super_admin')`.
