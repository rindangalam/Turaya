"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  BookOpenIcon,
  BoxIcon,
  ImagesIcon,
  InboxIcon,
  LayoutTemplateIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LeafIcon,
  MapPinIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  QuoteIcon,
  SearchIcon,
  SettingsIcon,
  TagIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AdminShellUser } from "@/features/admin/shell/types";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const OVERVIEW_NAV: NavItem[] = [{ href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon }];

const CONTENT_NAV: NavItem[] = [
  { href: "/admin/homepage", label: "Homepage", icon: LayoutTemplateIcon },
  { href: "/admin/products", label: "Products", icon: BoxIcon },
  { href: "/admin/collections", label: "Collections", icon: LayersIcon },
  { href: "/admin/categories", label: "Categories", icon: TagIcon },
  { href: "/admin/ingredients", label: "Ingredients", icon: LeafIcon },
  { href: "/admin/gallery", label: "Gallery", icon: ImagesIcon },
  { href: "/admin/journal", label: "Journal", icon: BookOpenIcon },
  { href: "/admin/testimonials", label: "Testimonials", icon: QuoteIcon },
  { href: "/admin/stores", label: "Stores", icon: MapPinIcon },
];

const STAFF_NAV: NavItem[] = [{ href: "/admin/messages", label: "Messages", icon: InboxIcon }];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin/seo", label: "SEO", icon: SearchIcon },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
];

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex h-8 items-center gap-2.5 rounded-md px-2 text-sm text-muted-foreground transition-colors duration-150",
        "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "bg-muted font-medium text-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      <item.icon className="size-4 shrink-0" aria-hidden="true" />
      {!collapsed ? <span className="truncate">{item.label}</span> : null}
    </Link>
  );
}

function NavGroup({
  label,
  items,
  collapsed,
}: {
  label?: string;
  items: NavItem[];
  collapsed: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {label && !collapsed ? (
        <p className="px-2 pb-1.5 text-overline text-muted-foreground">{label}</p>
      ) : null}
      {items.map((item) => (
        <NavLink key={item.href} item={item} collapsed={collapsed} />
      ))}
    </div>
  );
}

export function AdminSidebar({
  user,
  collapsed,
  onToggle,
  mobileOpen,
  onClose,
}: {
  user: AdminShellUser;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const isAdmin = user.role === "admin" || user.role === "super_admin";

  const body = (
    <>
      <div className={cn("flex h-14 shrink-0 items-center border-b border-border", collapsed ? "justify-center px-0" : "px-4")}>
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2 text-sm font-semibold tracking-tight",
            collapsed && "justify-center",
          )}
        >
          <span className="flex size-6 items-center justify-center rounded-sm bg-foreground text-[10px] font-bold text-background">
            T
          </span>
          {!collapsed ? <span>Turaya Studio</span> : null}
        </Link>
      </div>

      <nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
        <NavGroup items={OVERVIEW_NAV} collapsed={collapsed} />
        <NavGroup label="Content" items={[...CONTENT_NAV, ...STAFF_NAV]} collapsed={collapsed} />
        {isAdmin ? <NavGroup label="Administration" items={ADMIN_NAV} collapsed={collapsed} /> : null}
      </nav>

      <div className={cn("flex shrink-0 flex-col gap-1 border-t border-border p-3", collapsed && "items-center")}>
        {collapsed ? null : (
          <p className="mb-1 truncate px-2 text-xs text-muted-foreground">
            {user.displayName ?? user.email}
          </p>
        )}
        <div className={cn("flex w-full items-center gap-1", collapsed && "flex-col")}>
          <Button
            variant="ghost"
            size="sm"
            className={cn("text-muted-foreground", collapsed ? "justify-center" : "flex-1 justify-start", "hidden lg:inline-flex")}
            onClick={onToggle}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            title={collapsed ? "Expand navigation" : undefined}
          >
            {collapsed ? (
              <PanelLeftOpenIcon className="size-4" aria-hidden="true" />
            ) : (
              <>
                <PanelLeftCloseIcon className="size-4" aria-hidden="true" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-background transition-[width] duration-150 lg:flex",
          collapsed ? "w-14" : "w-60",
        )}
      >
        {body}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClose}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-border bg-background shadow-lg">
            <div className="flex items-center justify-between pr-2">
              <div className="flex h-14 shrink-0 items-center px-4">
                <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold tracking-tight" onClick={onClose}>
                  <span className="flex size-6 items-center justify-center rounded-sm bg-foreground text-[10px] font-bold text-background">
                    T
                  </span>
                  Turaya Studio
                </Link>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation menu">
                <XIcon className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
              <NavGroup items={OVERVIEW_NAV} collapsed={false} />
              <NavGroup label="Content" items={[...CONTENT_NAV, ...STAFF_NAV]} collapsed={false} />
              {isAdmin ? <NavGroup label="Administration" items={ADMIN_NAV} collapsed={false} /> : null}
            </nav>
            <div className="flex shrink-0 items-center border-t border-border p-3">
              <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                {user.displayName ?? user.email}
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
