-- ============================================================
-- Create CEO / Super Admin account
--
-- Run in Supabase SQL Editor (https://supabase.com/dashboard)
-- after the hosted project is fully migrated.
--
-- Steps:
--   1. Open Supabase Dashboard → SQL Editor
--   2. Paste this entire script
--   3. Click "Run"
--   4. Login at <admin-domain>/login with the credentials below
--
-- Email : azmijunior15@gmail.com
-- Pass  : azmijunior15
-- ============================================================

-- 1. Create the auth user (email confirmed immediately)
select auth.admin_create_user(
  email    := 'azmijunior15@gmail.com',
  password := 'azmijunior15',
  email_confirm := true
);

-- 2. Promote to super_admin
--    The handle_new_user trigger already created a profiles row with role='editor'.
--    We disable the protect_role_change trigger for this session only.
do $$
declare
  v_user_id uuid;
begin
  select id into v_user_id
    from auth.users
   where email = 'azmijunior15@gmail.com';

  if v_user_id is null then
    raise exception 'User azmijunior15@gmail.com not found after create_user';
  end if;

  alter table public.profiles disable trigger profiles_protect_role_change;

  update public.profiles
     set role = 'super_admin'
   where id = v_user_id;

  alter table public.profiles enable trigger profiles_protect_role_change;

  raise notice 'CEO account ready: azmijunior15@gmail.com → super_admin';
end
$$;
