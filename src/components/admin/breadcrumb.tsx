import Link from "next/link";

export type BreadcrumbItem = { href?: string; label: string };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href ?? item.label} className="flex min-w-0 items-center gap-1.5">
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "truncate font-medium text-foreground" : "truncate"}>
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="truncate transition-colors hover:text-foreground focus-visible:underline"
                  >
                    {item.label}
                  </Link>
                  <span aria-hidden="true" className="shrink-0 text-muted-foreground/60">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
