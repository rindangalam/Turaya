"use client";

import { useState, type ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { AdminHeader } from "@/features/admin/shell/admin-header";
import { AdminSidebar } from "@/features/admin/shell/admin-sidebar";
import type { AdminShellUser } from "@/features/admin/shell/types";

export function AdminShell({
  user,
  children,
}: {
  user: AdminShellUser;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin min-h-screen bg-[#f7f9fb] text-foreground">
      <div className="flex min-h-screen">
        <AdminSidebar
          user={user}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader user={user} onOpenMenu={() => setMobileOpen(true)} />
          <main id="main" className="flex-1 px-4 py-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
