"use client";

import Link from "next/link";
import { BellIcon, LayoutGridIcon, MenuIcon, SearchIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminShellUser } from "@/features/admin/shell/types";

/**
 * Stitch-style topbar: global search on the left, utility icons + account on
 * the right. Search routes to the products list; the bell maps to the message
 * inbox (closest thing to notifications in this CMS).
 */
export function AdminTopbar({
  user,
  onOpenMenu,
}: {
  user: AdminShellUser;
  onOpenMenu: () => void;
}) {
  const name = user.displayName ?? user.email ?? "Staff";
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMenu}
        aria-label="Open navigation menu"
      >
        <MenuIcon className="size-4" aria-hidden="true" />
      </Button>

      <form action="/admin/products" role="search" className="hidden min-w-0 flex-1 sm:block">
        <div className="relative max-w-md">
          <SearchIcon
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            name="q"
            placeholder="Search products..."
            aria-label="Search products"
            className="h-9 w-full rounded-full border border-input bg-[#f7f9fb] pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-background focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" render={<Link href="/admin/messages" />} aria-label="Messages">
          <BellIcon className="size-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon" render={<Link href="/admin" />} aria-label="Dashboard">
          <LayoutGridIcon className="size-4" aria-hidden="true" />
        </Button>
        <Link
          href="/contact"
          className="hidden px-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
        >
          Support
        </Link>
        <span aria-hidden className="mx-2 hidden h-5 w-px bg-border sm:block" />
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background"
          >
            {initial}
          </span>
          <span className="hidden text-sm font-medium md:block">{name}</span>
          <Badge variant="secondary" className="hidden capitalize md:inline-flex">
            {user.role.replace("_", " ")}
          </Badge>
        </div>
      </div>
    </header>
  );
}
