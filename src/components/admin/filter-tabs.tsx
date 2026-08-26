import Link from "next/link";

import { cn } from "@/lib/utils";

export type FilterTabItem = {
  href: string;
  label: string;
  count?: number;
  active: boolean;
};

/**
 * Shared pill-style filter tab row used by every admin list page.
 * `label` doubles as the accessible nav name, e.g. "Filter status produk".
 */
export function FilterTabs({
  items,
  label,
  className,
}: {
  items: FilterTabItem[];
  label: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={cn("flex flex-wrap gap-1", className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "rounded-lg border border-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            item.active && "border-border bg-background font-medium text-foreground",
          )}
        >
          {item.label}
          {item.count !== undefined ? (
            <span className="ml-1.5 tabular-nums text-muted-foreground">
              {item.count}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
