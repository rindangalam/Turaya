import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type StaffUser = {
  id: string;
  email: string;
  displayName: string | null;
  role: string;
  createdAt: string;
};

export async function listStaffUsers(): Promise<StaffUser[]> {
  const admin = createAdminClient();

  const [
    { data: authUsers, error: authErr },
    { data: profiles, error: profErr },
  ] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 100 }),
    admin.from("profiles").select("id, role, display_name"),
  ]);

  if (authErr) {
    console.error(`users: failed to list auth users: ${authErr.message}`);
    return [];
  }
  if (profErr) {
    console.error(`users: failed to list profiles: ${profErr.message}`);
    return [];
  }

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, { role: p.role, displayName: p.display_name }]),
  );

  return (authUsers?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "",
    displayName: profileMap.get(u.id)?.displayName ?? null,
    role: profileMap.get(u.id)?.role ?? "editor",
    createdAt: u.created_at,
  }));
}
