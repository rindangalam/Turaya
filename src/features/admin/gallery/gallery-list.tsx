import Link from "next/link";
import Image from "next/image";
import { ArrowDownIcon, ArrowUpIcon, PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentStatusBadge } from "@/features/admin/shared/content-status-badge";
import { ConfirmDeleteButton } from "@/features/admin/shared/confirm-delete-button";
import {
  deleteGalleryItem,
  moveGalleryItem,
} from "@/features/admin/gallery/actions";
import { getStoragePublicUrl } from "@/lib/storage";
import type { GalleryItem } from "@/services/gallery";

export function GalleryList({ items }: { items: GalleryItem[] }) {
  return (
    <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item, index) => (
        <li key={item.id}>
          <GalleryTile
            item={item}
            isFirst={index === 0}
            isLast={index === items.length - 1}
          />
        </li>
      ))}
    </ol>
  );
}

function GalleryTile({
  item,
  isFirst,
  isLast,
}: {
  item: GalleryItem;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={getStoragePublicUrl("gallery", item.path)}
          alt={item.alt}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
            #{item.sort_order}
          </span>
          <p className="truncate text-sm font-medium">{item.alt}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {item.category ? <Badge variant="secondary">{item.category}</Badge> : null}
          <ContentStatusBadge status={item.status} />
        </div>
        <div className="mt-auto flex items-center justify-between gap-1 border-t border-border pt-2">
          <div className="flex items-center gap-1">
            <form action={moveGalleryItem}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="direction" value="up" />
              <Button
                type="submit"
                variant="ghost"
                size="icon-sm"
                disabled={isFirst}
                aria-label={`Pindahkan ${item.alt} ke atas`}
              >
                <ArrowUpIcon className="size-3.5" aria-hidden="true" />
              </Button>
            </form>
            <form action={moveGalleryItem}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="direction" value="down" />
              <Button
                type="submit"
                variant="ghost"
                size="icon-sm"
                disabled={isLast}
                aria-label={`Pindahkan ${item.alt} ke bawah`}
              >
                <ArrowDownIcon className="size-3.5" aria-hidden="true" />
              </Button>
            </form>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              render={<Link href={`/admin/gallery/${item.id}/edit`} />}
              aria-label={`Edit ${item.alt}`}
            >
              <PencilIcon className="size-3.5" aria-hidden="true" />
            </Button>
            <ConfirmDeleteButton
              id={item.id}
              name={item.alt}
              action={deleteGalleryItem}
              successMessage="Gambar dihapus"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
