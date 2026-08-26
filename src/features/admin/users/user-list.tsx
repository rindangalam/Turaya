"use client";

import { useActionState, useEffect } from "react";
import { UsersIcon } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDeleteButton } from "@/features/admin/shared/confirm-delete-button";
import type { StaffUser } from "@/services/users";
import { formatDateTime } from "@/lib/format";
import { removeUser, updateUserRole } from "./actions";

function RoleSelect({ user }: { user: StaffUser }) {
  const [state, formAction, pending] = useActionState(updateUserRole, undefined);

  useEffect(() => {
    if (state?.ok) toast.success("Role diperbarui");
    else if (state?.formError) toast.error(state.formError);
  }, [state]);

  return (
    <form action={formAction} className="inline-flex">
      <input type="hidden" name="id" value={user.id} />
      <select
        name="role"
        defaultValue={user.role}
        disabled={pending}
        onChange={(e) => {
          e.currentTarget.form?.requestSubmit();
        }}
        className="h-7 rounded-md border border-input bg-transparent px-1.5 text-xs outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
        <option value="super_admin">Super Admin</option>
      </select>
    </form>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    super_admin: "bg-foreground text-background",
    admin: "bg-muted text-foreground",
    editor: "bg-secondary text-secondary-foreground",
  };
  const label: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    editor: "Editor",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${map[role] ?? map.editor}`}>
      {label[role] ?? role}
    </span>
  );
}

export function UsersList({ users, isSuperAdmin }: { users: StaffUser[]; isSuperAdmin: boolean }) {
  if (users.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-6" aria-hidden="true" />}
        title="Belum ada pengguna"
        description="Undang pengguna baru melalui tombol di atas."
      />
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">
                  Email
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Nama
                </th>
                <th scope="col" className="hidden px-4 py-2 font-medium sm:table-cell">
                  Dibuat
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Role
                </th>
                {isSuperAdmin ? (
                  <th scope="col" className="px-4 py-2 font-medium">
                    <span className="sr-only">Aksi</span>
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <span className="block truncate font-medium">{user.email}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.displayName || "\u2014"}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {formatDateTime(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {isSuperAdmin ? (
                      <RoleSelect user={user} />
                    ) : (
                      <RoleBadge role={user.role} />
                    )}
                  </td>
                  {isSuperAdmin ? (
                    <td className="px-4 py-3">
                      <ConfirmDeleteButton
                        id={user.id}
                        name={user.email}
                        action={removeUser}
                        successMessage="Pengguna dihapus."
                      />
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <ul className="flex flex-col gap-3 sm:hidden">
        {users.map((user) => (
          <li key={user.id} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{user.email}</span>
                {user.displayName ? (
                  <span className="block truncate text-xs text-muted-foreground">
                    {user.displayName}
                  </span>
                ) : null}
              </div>
              {isSuperAdmin ? (
                <ConfirmDeleteButton
                  id={user.id}
                  name={user.email}
                  action={removeUser}
                  successMessage="Pengguna dihapus."
                />
              ) : null}
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <time dateTime={user.createdAt} className="text-xs text-muted-foreground">
                {formatDateTime(user.createdAt)}
              </time>
              {isSuperAdmin ? (
                <RoleSelect user={user} />
              ) : (
                <RoleBadge role={user.role} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
