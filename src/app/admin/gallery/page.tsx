import type { Metadata } from "next";
import Link from "next/link";
import { ImagesIcon, PlusIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { GalleryList } from "@/features/admin/gallery/gallery-list";
import { GalleryToolbar } from "@/features/admin/gallery/gallery-toolbar";
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

      <div className="flex flex-col gap-4">
        <GalleryToolbar status={status ?? ""} category={categoryFilter ?? ""} categories={categories} />
        <nav aria-label="Gallery status filter" className="flex flex-wrap gap-1">
          <FilterTab
            href={categoryHref(undefined, categoryFilter)}
            label="All"
            active={status === undefined}
          />
          {CONTENT_STATUSES.map((candidate) => (
            <FilterTab
              key={candidate}
              href={categoryHref(candidate, categoryFilter)}
              label={candidate}
              active={status === candidate}
            />
          ))}
        </nav>
      </div>

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
