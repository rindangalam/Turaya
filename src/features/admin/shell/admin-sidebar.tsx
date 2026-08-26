"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  BookOpenIcon,
  BoxIcon,
  CircleHelpIcon,
  ImagesIcon,
  InboxIcon,
  LayoutTemplateIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LeafIcon,
  LogOutIcon,
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
import { logout } from "@/features/auth/actions";
import { cn } from "@/lib/utils";
import type { AdminShellUser } from "@/features/admin/shell/types";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: number;
};

const OVERVIEW_NAV: NavItem[] = [{ href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon }];

const CATALOG_NAV: NavItem[] = [
  { href: "/admin/products", label: "Produk", icon: BoxIcon },
  { href: "/admin/collections", label: "Koleksi", icon: LayersIcon },
  { href: "/admin/categories", label: "Kategori", icon: TagIcon },
  { href: "/admin/ingredients", label: "Bahan", icon: LeafIcon },
];

const CONTENT_NAV: NavItem[] = [
  { href: "/admin/homepage", label: "Beranda", icon: LayoutTemplateIcon },
  { href: "/admin/gallery", label: "Galeri", icon: ImagesIcon },
  { href: "/admin/journal", label: "Jurnal", icon: BookOpenIcon },
  { href: "/admin/testimonials", label: "Testimoni", icon: QuoteIcon },
];

const OPS_NAV: NavItem[] = [
  { href: "/admin/stores", label: "Toko", icon: MapPinIcon },
  { href: "/admin/messages", label: "Pesan", icon: InboxIcon },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin/seo", label: "SEO", icon: SearchIcon },
  { href: "/admin/settings", label: "Pengaturan", icon: SettingsIcon },
  { href: "/admin/users", label: "Pengguna", icon: UsersIcon },
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
        "relative flex h-8 items-center gap-2.5 rounded-md px-2 text-sm text-muted-foreground transition-colors duration-150",
        "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "bg-muted font-medium text-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      <item.icon className="size-4 shrink-0" aria-hidden="true" />
      {!collapsed ? (
        <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <span className="truncate">{item.label}</span>
          {item.badge ? (
            <span
              aria-label={`${item.badge} belum dibaca`}
              className="inline-flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold tabular-nums text-background"
            >
              {item.badge > 9 ? "9+" : item.badge}
            </span>
          ) : null}
        </span>
      ) : null}
      {collapsed && item.badge ? (
        <span
          aria-label={`${item.badge} belum dibaca`}
          className="absolute right-1.5 top-1.5 size-2 rounded-full bg-foreground"
        />
      ) : null}
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
  unreadCount,
  collapsed,
  onToggle,
  mobileOpen,
  onClose,
}: {
  user: AdminShellUser;
  unreadCount: number;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const isAdmin = user.role === "admin" || user.role === "super_admin";

  const opsNav: NavItem[] =
    unreadCount > 0
      ? OPS_NAV.map((item) => (item.href === "/admin/messages" ? { ...item, badge: unreadCount } : item))
      : OPS_NAV;

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

      <nav aria-label="Navigasi admin" className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
        <NavGroup items={OVERVIEW_NAV} collapsed={collapsed} />
        <NavGroup label="Katalog" items={CATALOG_NAV} collapsed={collapsed} />
        <NavGroup label="Konten" items={CONTENT_NAV} collapsed={collapsed} />
        <NavGroup label="Operasional" items={opsNav} collapsed={collapsed} />
        {isAdmin ? <NavGroup label="Administrasi" items={ADMIN_NAV} collapsed={collapsed} /> : null}
      </nav>

      <div className={cn("flex shrink-0 flex-col gap-0.5 border-t border-border p-3", collapsed && "items-center")}>
        <Link
          href="/faq"
          title={collapsed ? "Bantuan" : undefined}
          className={cn(
            "flex h-8 items-center gap-2.5 rounded-md px-2 text-sm text-muted-foreground transition-colors duration-150",
            "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            collapsed && "justify-center px-0",
          )}
        >
          <CircleHelpIcon className="size-4 shrink-0" aria-hidden="true" />
          {!collapsed ? <span>Bantuan</span> : null}
        </Link>
        <form action={logout} className={cn("flex w-full", collapsed && "flex justify-center")}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 justify-start gap-2.5 px-2 text-sm font-normal text-muted-foreground hover:text-foreground",
              collapsed && "w-auto justify-center px-0",
            )}
          >
            <LogOutIcon className="size-4 shrink-0" aria-hidden="true" />
            {!collapsed ? <span>Keluar</span> : null}
          </Button>
        </form>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "hidden h-8 justify-start gap-2.5 px-2 text-sm font-normal text-muted-foreground hover:text-foreground lg:inline-flex",
            collapsed && "w-auto justify-center px-0",
          )}
          onClick={onToggle}
          aria-label={collapsed ? "Luaskan navigasi" : "Ciutkan navigasi"}
          title={collapsed ? "Luaskan navigasi" : undefined}
        >
          {collapsed ? (
            <PanelLeftOpenIcon className="size-4" aria-hidden="true" />
          ) : (
            <>
              <PanelLeftCloseIcon className="size-4" aria-hidden="true" />
              Ciutkan
            </>
          )}
        </Button>
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
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Tutup menu navigasi">
                <XIcon className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <nav aria-label="Navigasi admin" className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
              <NavGroup items={OVERVIEW_NAV} collapsed={false} />
              <NavGroup label="Katalog" items={CATALOG_NAV} collapsed={false} />
              <NavGroup label="Konten" items={CONTENT_NAV} collapsed={false} />
              <NavGroup label="Operasional" items={opsNav} collapsed={false} />
              {isAdmin ? <NavGroup label="Administrasi" items={ADMIN_NAV} collapsed={false} /> : null}
            </nav>
            <div className="flex shrink-0 items-center justify-between border-t border-border p-3">
              <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                {user.displayName ?? user.email}
              </p>
              <form action={logout}>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <LogOutIcon className="size-4" aria-hidden="true" />
                  Keluar
                </Button>
              </form>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
