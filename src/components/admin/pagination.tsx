import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Prev/next pagination with a display range. Renders nothing when everything
 * fits on one page. `hrefFor` builds the URL for a page number while
 * preserving the caller's active filters.
 */
export function Pagination({
  page,
  pageSize,
  total,
  hrefFor,
  label,
}: {
  page: number;
  pageSize: number;
  total: number;
  hrefFor: (page: number) => string;
  label: string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  const navClass =
    "inline-flex h-8 items-center gap-1 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";
  const disabledClass = "pointer-events-none opacity-40";

  return (
    <nav aria-label={`Paginasi ${label}`} className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm tabular-nums text-muted-foreground">
        Menampilkan {from}–{to} dari {total}
      </p>
      <div className="flex items-center gap-2">
        {page <= 1 ? (
          <span aria-hidden className={cn(navClass, disabledClass)}>
            ‹ Sebelumnya
          </span>
        ) : (
          <Link href={hrefFor(page - 1)} className={navClass} aria-label="Halaman sebelumnya">
            ‹ Sebelumnya
          </Link>
        )}
        <span className="text-sm tabular-nums text-muted-foreground">
          Halaman {page} dari {totalPages}
        </span>
        {page >= totalPages ? (
          <span aria-hidden className={cn(navClass, disabledClass)}>
            Berikutnya ›
          </span>
        ) : (
          <Link href={hrefFor(page + 1)} className={navClass} aria-label="Halaman berikutnya">
            Berikutnya ›
          </Link>
        )}
      </div>
    </nav>
  );
}
