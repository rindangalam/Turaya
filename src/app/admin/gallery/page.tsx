import type { Metadata } from "next";
import Link from "next/link";
import { ImagesIcon, PlusIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Pagination } from "@/components/admin/pagination";
import { Button } from "@/components/ui/button";
import { GalleryList } from "@/features/admin/gallery/gallery-list";
import {
  countGalleryItems,
  getGalleryStatusCounts,
  listGalleryItems,
  listGalleryCategories,
} from "@/services/gallery";
import { CONTENT_STATUSES } from "@/lib/validation/collections";
import { contentStatusLabel } from "@/lib/labels";

export const metadata: Metadata = { title: "Galeri" };

const PAGE_SIZE = 24;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; page?: string }>;
}) {
  await requireAuth();
  const params = await searchParams;

  const status =
    params.status && (CONTENT_STATUSES as readonly string[]).includes(params.status)
      ? params.status
      : undefined;
  const category = params.category?.trim() || undefined;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const [categories, statusCounts] = await Promise.all([
    listGalleryCategories(),
    getGalleryStatusCounts(),
  ]);

  const categoryFilter = category && categories.includes(category) ? category : undefined;
  const [items, total] = await Promise.all([
    listGalleryItems({ status, category: categoryFilter, page, pageSize: PAGE_SIZE }),
    countGalleryItems({ status, category: categoryFilter }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Galeri"
        description="Unggah, beri keterangan, kategorikan, dan atur urutan galeri editorial."
      >
        <Button size="sm" render={<Link href="/admin/gallery/new" />}>
          <PlusIcon aria-hidden="true" />
          Unggah gambar
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside
          aria-label="Filter galeri"
          className="w-full shrink-0 rounded-xl border border-border bg-card p-4 lg:sticky lg:top-20 lg:w-60"
        >
          <p className="overline text-xs uppercase tracking-wider text-muted-foreground">Status</p>
          <FilterTabs
            label="Filter status galeri"
            className="mt-2 lg:flex-col"
            items={[
              {
                href: categoryHref(undefined, categoryFilter),
                label: "Semua",
                count: Object.values(statusCounts).reduce((sum, count) => sum + count, 0),
                active: status === undefined,
              },
              ...CONTENT_STATUSES.map((candidate) => ({
                href: categoryHref(candidate, categoryFilter),
                label: contentStatusLabel(candidate),
                count: statusCounts[candidate] ?? 0,
                active: status === candidate,
              })),
            ]}
          />

          <p className="overline mt-5 text-xs uppercase tracking-wider text-muted-foreground">
            Kategori
          </p>
          <FilterTabs
            label="Filter kategori galeri"
            className="mt-2 lg:flex-col"
            items={[
              {
                href: categoryHref(status ?? undefined, undefined),
                label: "Semua kategori",
                active: !categoryFilter,
              },
              ...categories.map((candidate) => ({
                href: categoryHref(status ?? undefined, candidate),
                label: candidate,
                active: categoryFilter === candidate,
              })),
            ]}
          />
        </aside>

        <div className="min-w-0 flex-1">
          {items.length === 0 ? (
            <EmptyState
              icon={<ImagesIcon className="size-6" aria-hidden="true" />}
              title="Belum ada gambar"
              description={
                categoryFilter
                  ? "Belum ada gambar di kategori ini. Unggah gambar pertama atau hapus filter."
                  : "Unggah gambar editorial pertama untuk mulai membangun galeri."
              }
              action={
                <Button size="sm" render={<Link href="/admin/gallery/new" />}>
                  <PlusIcon aria-hidden="true" />
                  Unggah gambar
                </Button>
              }
            />
          ) : (
            <GalleryList items={items} />
          )}

          <div className="mt-6">
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              label="galeri"
              hrefFor={(target) => pageHref(target, status, categoryFilter)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function categoryHref(status: string | undefined, category: string | undefined) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (category) params.set("category", category);
  const query = params.toString();
  return query ? `/admin/gallery?${query}` : "/admin/gallery";
}

function pageHref(page: number, status: string | undefined, category: string | undefined) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/gallery?${query}` : "/admin/gallery";
}
