import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { countUnreadMessages } from "@/services/messages";
import { AdminShell } from "@/features/admin/shell/admin-shell";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s — Turaya Studio",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();
  const unreadCount = await countUnreadMessages();

  return (
    <AdminShell user={user} unreadCount={unreadCount}>
      {children}
    </AdminShell>
  );
}
