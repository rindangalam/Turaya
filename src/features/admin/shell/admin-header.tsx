"use client";

import { LogOutIcon, MenuIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions";
import type { AdminShellUser } from "@/features/admin/shell/types";

export function AdminHeader({
  user,
  onOpenMenu,
}: {
  user: AdminShellUser;
  onOpenMenu: () => void;
}) {
  const name = user.displayName ?? user.email ?? "Staff";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
        >
          <MenuIcon className="size-4" aria-hidden="true" />
        </Button>
        <span className="truncate text-sm font-medium">{name}</span>
        <Badge variant="secondary" className="capitalize">
          {user.role.replace("_", " ")}
        </Badge>
      </div>

      <form action={logout}>
        <Button variant="ghost" size="sm">
          <LogOutIcon className="size-3.5" aria-hidden="true" />
          Log out
        </Button>
      </form>
    </header>
  );
}
