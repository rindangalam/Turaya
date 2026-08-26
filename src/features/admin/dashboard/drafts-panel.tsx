import Link from "next/link";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/empty-state";
import type { ContentStat } from "@/services/dashboard";
import { cn } from "@/lib/utils";

const SECTION_META: Record<string, { href: string; label: string }> = {
  homepage_sections: { href: "/admin/homepage", label: "Beranda" },
  products: { href: "/admin/products", label: "Produk" },
  collections: { href: "/admin/collections", label: "Koleksi" },
  categories: { href: "/admin/categories", label: "Kategori" },
  ingredients: { href: "/admin/ingredients", label: "Bahan" },
  gallery_items: { href: "/admin/gallery", label: "Galeri" },
  journal_posts: { href: "/admin/journal", label: "Jurnal" },
  testimonials: { href: "/admin/testimonials", label: "Testimoni" },
  store_locations: { href: "/admin/stores", label: "Toko" },
};

export function DraftsPanel({ stats, className }: { stats: ContentStat[]; className?: string }) {
  const drafts = stats.filter((stat) => stat.draft > 0);
  const totalDrafts = drafts.reduce((sum, stat) => sum + stat.draft, 0);

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Draf perlu ditinjau</CardTitle>
        <CardDescription>Konten berstatus draf di setiap bagian situs.</CardDescription>
        <CardAction>
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium tabular-nums text-amber-700">
            {totalDrafts}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        {drafts.length === 0 ? (
          <EmptyState
            title="Tidak ada draf"
            description="Semua bagian sudah terbit atau masih kosong."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {drafts.map((stat) => {
              const meta = SECTION_META[stat.key];
              return (
                <li
                  key={stat.key}
                  className="flex items-center justify-between gap-3 border-b border-border/70 py-2.5 last:border-b-0 sm:last:[&:nth-child(odd)]:border-b-0"
                >
                  <span className="truncate text-sm font-medium">{meta?.label ?? stat.label}</span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {stat.draft} draf
                    </span>
                    {meta?.href ? (
                      <Link
                        href={meta.href}
                        className="text-sm text-primary underline-offset-4 hover:underline focus-visible:underline"
                      >
                        Buka
                      </Link>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
