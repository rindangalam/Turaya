import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FolderIcon,
  PencilIcon,
  PlusIcon,
  StarIcon,
} from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { ContentStatusBadge } from "@/features/admin/shared/content-status-badge";
import { ConfirmDeleteButton } from "@/features/admin/shared/confirm-delete-button";
import {
  deleteCollection,
  moveCollection,
  toggleCollectionFeatured,
} from "@/features/admin/collections/actions";
import { listCollections } from "@/services/collections";
import type { Collection } from "@/services/collections";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  await requireAuth();
  const collections = await listCollections();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Collections"
        description="Group fragrances into collections and control their order and prominence."
      >
        <Button size="sm" render={<Link href="/admin/collections/new" />}>
          <PlusIcon aria-hidden="true" />
          New collection
        </Button>
      </PageHeader>

      {collections.length === 0 ? (
        <EmptyState
          icon={<FolderIcon className="size-6" aria-hidden="true" />}
          title="No collections yet"
          description="Create your first collection to start grouping products."
          action={
            <Button size="sm" render={<Link href="/admin/collections/new" />}>
              <PlusIcon aria-hidden="true" />
              New collection
            </Button>
          }
        />
      ) : (
        <ol className="flex flex-col gap-3">
          {collections.map((collection, index) => (
            <li key={collection.id}>
              <CollectionRow
                collection={collection}
                isFirst={index === 0}
                isLast={index === collections.length - 1}
              />
            </li>
          ))}
        </ol>
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
                  aria-label="Featured"
                />
              ) : null}
            </span>
            <ContentStatusBadge status={collection.status} />
          </p>
          <p className="truncate font-mono text-xs text-muted-foreground">{collection.slug}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <form action={moveCollection}>
          <input type="hidden" name="id" value={collection.id} />
          <input type="hidden" name="direction" value="up" />
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            disabled={isFirst}
            aria-label={`Move ${collection.name} up`}
          >
            <ArrowUpIcon className="size-3.5" aria-hidden="true" />
          </Button>
        </form>
        <form action={moveCollection}>
          <input type="hidden" name="id" value={collection.id} />
          <input type="hidden" name="direction" value="down" />
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            disabled={isLast}
            aria-label={`Move ${collection.name} down`}
          >
            <ArrowDownIcon className="size-3.5" aria-hidden="true" />
          </Button>
        </form>
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
