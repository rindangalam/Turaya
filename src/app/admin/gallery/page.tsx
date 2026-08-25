import type { Metadata } from "next";
import Link from "next/link";
import { ImagesIcon, PlusIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { GalleryList } from "@/features/admin/gallery/gallery-list";
import { listGalleryItems, listGalleryCategories } from "@/services/gallery";
import { CONTENT_STATUSES } from "@/lib/validation/collections";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>;
}) {
  await requireAuth();
  const params = await searchParams;

  const status =
    params.status && (CONTENT_STATUSES as readonly string[]).includes(params.status)
      ? params.status
      : undefined;
  const category = params.category?.trim() || undefined;

  const [categories] = await Promise.all([listGalleryCategories()]);

  const categoryFilter = category && categories.includes(category) ? category : undefined;
  const items = await listGalleryItems({ status, category: categoryFilter });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gallery"
        description="Upload, caption, categorize and order the editorial gallery."
      >
        <Button size="sm" render={<Link href="/admin/gallery/new" />}>
          <PlusIcon aria-hidden="true" />
          Upload image
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside
          aria-label="Gallery filters"
          className="w-full shrink-0 rounded-xl border border-border bg-card p-4 lg:sticky lg:top-20 lg:w-60"
        >
          <p className="overline text-xs uppercase tracking-wider text-muted-foreground">Status</p>
          <nav aria-label="Gallery status filter" className="mt-2 flex flex-wrap gap-1 lg:flex-col">
            <FilterTab
              href={categoryHref(undefined, categoryFilter)}
              label="All"
              active={status === undefined}
            />
            {CONTENT_STATUSES.map((candidate) => (
              <FilterTab
                key={candidate}
                href={categoryHref(candidate, categoryFilter)}
                label={candidate.charAt(0).toUpperCase() + candidate.slice(1)}
                active={status === candidate}
              />
            ))}
          </nav>

          <p className="overline mt-5 text-xs uppercase tracking-wider text-muted-foreground">
            Category
          </p>
          <nav aria-label="Gallery category filter" className="mt-2 flex flex-wrap gap-1 lg:flex-col">
            <FilterTab
              href={categoryHref(status ?? undefined, undefined)}
              label="All categories"
              active={!categoryFilter}
            />
            {categories.map((candidate) => (
              <FilterTab
                key={candidate}
                href={categoryHref(status ?? undefined, candidate)}
                label={candidate}
                active={categoryFilter === candidate}
              />
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          {items.length === 0 ? (
            <EmptyState
              icon={<ImagesIcon className="size-6" aria-hidden="true" />}
              title="No gallery items"
              description={
                categoryFilter
                  ? "Nothing in this category yet. Upload the first image or clear the filter."
                  : "Upload the first editorial image to start building the gallery."
              }
              action={
                <Button size="sm" render={<Link href="/admin/gallery/new" />}>
                  <PlusIcon aria-hidden="true" />
                  Upload image
                </Button>
              }
            />
          ) : (
            <GalleryList items={items} />
          )}
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

function FilterTab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-lg border border-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        active && "border-border bg-background font-medium text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
