import type { Metadata } from "next";
import Link from "next/link";
import { FolderIcon, PencilIcon, PlusIcon, StarIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { MoveButtons } from "@/components/admin/move-buttons";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { SortableList } from "@/components/admin/sortable-list";
import { Button } from "@/components/ui/button";
import { ContentStatusBadge } from "@/features/admin/shared/content-status-badge";
import { ConfirmDeleteButton } from "@/features/admin/shared/confirm-delete-button";
import {
  deleteCollection,
  moveCollection,
  reorderCollections,
  toggleCollectionFeatured,
} from "@/features/admin/collections/actions";
import { listCollections } from "@/services/collections";
import type { Collection } from "@/services/collections";

export const metadata: Metadata = { title: "Koleksi" };

export default async function CollectionsPage() {
  await requireAuth();
  const collections = await listCollections();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Koleksi"
        description="Kelompokkan parfum ke dalam koleksi dan atur urutan serta penonjolannya."
      >
        <Button size="sm" render={<Link href="/admin/collections/new" />}>
          <PlusIcon aria-hidden="true" />
          Koleksi baru
        </Button>
      </PageHeader>

      {collections.length === 0 ? (
        <EmptyState
          icon={<FolderIcon className="size-6" aria-hidden="true" />}
          title="Belum ada koleksi"
          description="Buat koleksi pertama untuk mengelompokkan produk."
          action={
            <Button size="sm" render={<Link href="/admin/collections/new" />}>
              <PlusIcon aria-hidden="true" />
              Koleksi baru
            </Button>
          }
        />
      ) : (
        <SortableList ids={collections.map((item) => item.id)} action={reorderCollections}>
          {collections.map((collection, index) => (
            <CollectionRow
              key={collection.id}
              collection={collection}
              isFirst={index === 0}
              isLast={index === collections.length - 1}
            />
          ))}
        </SortableList>
      )}
    </div>
  );
}

function CollectionRow({
  collection,
  isFirst,
  isLast,
}: {
  collection: Collection;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="w-6 shrink-0 text-center text-sm tabular-nums text-muted-foreground">
          {collection.sort_order}
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
            <span className="flex items-center gap-1.5 truncate">
              {collection.name}
              {collection.featured ? (
                <StarIcon
                  className="size-3.5 shrink-0 fill-champagne-500 text-champagne-500"
                  aria-label="Unggulan"
                />
              ) : null}
            </span>
            <ContentStatusBadge status={collection.status} />
          </p>
          <p className="truncate font-mono text-xs text-muted-foreground">{collection.slug}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <MoveButtons
          id={collection.id}
          name={collection.name}
          isFirst={isFirst}
          isLast={isLast}
          action={moveCollection}
        />
        <form action={toggleCollectionFeatured}>
          <input type="hidden" name="id" value={collection.id} />
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            aria-label={
              collection.featured
                ? `Unfeature ${collection.name}`
                : `Feature ${collection.name}`
            }
          >
            <StarIcon
              className={
                collection.featured
                  ? "size-3.5 fill-champagne-500 text-champagne-500"
                  : "size-3.5 text-muted-foreground"
              }
              aria-hidden="true"
            />
          </Button>
        </form>
        <Button
          variant="ghost"
          size="icon-sm"
          render={<Link href={`/admin/collections/${collection.id}/edit`} />}
          aria-label={`Edit ${collection.name}`}
        >
          <PencilIcon className="size-3.5" aria-hidden="true" />
        </Button>
        <ConfirmDeleteButton
          id={collection.id}
          name={collection.name}
          action={deleteCollection}
          successMessage="Collection archived"
        />
      </div>
    </div>
  );
}
