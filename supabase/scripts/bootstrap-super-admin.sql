-- ============================================================
-- Bootstrap the first Super Admin (Sprint 4 — documented, audited).
--
-- Usage:
--   1. Create the account first (Supabase dashboard > Authentication
--      > Users > Invite, or `supabase.auth.admin.createUser`), so the
--      auth.users row and (via the handle_new_user trigger) the
--      profiles row exist.
--   2. Replace '<USER_EMAIL>' below and run once with psql:
--        psql "$DATABASE_URL" -f supabase/scripts/bootstrap-super-admin.sql
--   3. Verify: select * from profiles;  -> role = 'super_admin'
--      and the change appears in audit_logs (actor_id NULL = bootstrap).
--
-- SAFETY: the protect_role_change trigger normally blocks role updates
-- for non-super-admins (including DB-admin psql sessions, since auth.uid()
-- is null there). This script disables that trigger for its own session
-- only — the intended, documented exception. The audit trigger stays
-- active, so the change is recorded with actor_id NULL.
-- After the first super admin exists, promote additional users through the
-- app (guarded by requireSuperAdmin).
-- ============================================================

-- WARNING: stop if the email does not exist yet.
do $$
declare
  v_user_id uuid;
begin
  select id into v_user_id from auth.users where email = '<USER_EMAIL>';

  if v_user_id is null then
    raise exception 'No auth.users row for <USER_EMAIL>. Create the account first.';
  end if;

  alter table public.profiles disable trigger profiles_protect_role_change;

  update public.profiles
     set role = 'super_admin'
   where id = v_user_id;

  alter table public.profiles enable trigger profiles_protect_role_change;

  raise notice 'Promoted % to super_admin', '<USER_EMAIL>';
end
$$;
