"use client";

import { useState, type ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { AdminSidebar } from "@/features/admin/shell/admin-sidebar";
import { AdminTopbar } from "@/features/admin/shell/admin-topbar";
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
    <div className="admin flex min-h-screen flex-col bg-[#f7f9fb] text-foreground">
      <div className="flex flex-1">
        <AdminSidebar
          user={user}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar user={user} onOpenMenu={() => setMobileOpen(true)} />
          <main id="main" className="flex-1 px-4 py-6 lg:px-8">
            {children}
          </main>
          <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground lg:px-8">
            © 2026 Turaya Studio. All rights reserved.
          </footer>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
