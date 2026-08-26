import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { getSessionUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/admin/page-header";
import { listStaffUsers } from "@/services/users";
import { InviteUserForm } from "@/features/admin/users/invite-user-form";
import { UsersList } from "@/features/admin/users/user-list";

export const metadata: Metadata = { title: "Pengguna", robots: { index: false, follow: false } };

export default async function UsersPage() {
  await requireAuth();
  const currentUser = await getSessionUser();
  const isSuperAdmin = currentUser?.role === "super_admin";
  const users = await listStaffUsers();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pengguna"
        description="Manajemen staf dan hak akses."
      >
        {isSuperAdmin ? <InviteUserForm /> : null}
      </PageHeader>

      <UsersList users={users} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
