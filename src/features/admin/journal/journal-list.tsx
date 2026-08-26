import Link from "next/link";
import Image from "next/image";
import { FileTextIcon, PencilIcon } from "lucide-react";

import { EmptyState } from "@/components/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentStatusBadge } from "@/features/admin/shared/content-status-badge";
import { ConfirmDeleteButton } from "@/features/admin/shared/confirm-delete-button";
import { deleteJournalPost } from "@/features/admin/journal/actions";
import { formatDateTime } from "@/lib/format";
import { getStoragePublicUrl } from "@/lib/storage";
import type { JournalPostListItem } from "@/services/journal";

export function JournalList({ posts }: { posts: JournalPostListItem[] }) {
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<FileTextIcon className="size-6" aria-hidden="true" />}
        title="Belum ada artikel"
        description="Sesuaikan pencarian atau filter Anda, atau tulis artikel pertama untuk jurnal."
        action={
          <Button size="sm" render={<Link href="/admin/journal/new" />}>
            Artikel baru
          </Button>
        }
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs tracking-wide text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">
              Artikel
            </th>
            <th scope="col" className="hidden px-4 py-2 font-medium md:table-cell">
              Kategori
            </th>
            <th scope="col" className="hidden px-4 py-2 font-medium lg:table-cell">
              Tag
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Status
            </th>
            <th scope="col" className="hidden px-4 py-2 font-medium lg:table-cell">
              Diperbarui
            </th>
            <th scope="col" className="px-4 py-2">
              <span className="sr-only">Tindakan</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-muted/40">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {post.coverImagePath ? (
                    <Image
                      src={getStoragePublicUrl("journal", post.coverImagePath)}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
                      <FileTextIcon className="size-4" aria-hidden="true" />
                    </span>
                  )}
                  <Link
                    href={`/admin/journal/${post.id}/edit`}
                    className="block min-w-0 focus-visible:outline-none focus-visible:underline"
                  >
                    <span className="block truncate font-medium">{post.title}</span>
                    <span className="block truncate font-mono text-xs text-muted-foreground">
                      {post.slug}
                    </span>
                  </Link>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                {post.categoryName ?? "—"}
              </td>
              <td className="hidden px-4 py-3 lg:table-cell">
                {post.tagNames.length === 0 ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {post.tagNames.map((name) => (
                      <Badge key={name} variant="secondary">
                        {name}
                      </Badge>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <ContentStatusBadge status={post.status} />
              </td>
              <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                {formatDateTime(post.updatedAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    render={<Link href={`/admin/journal/${post.id}/edit`} />}
                    aria-label={`Edit ${post.title}`}
                  >
                    <PencilIcon className="size-3.5" aria-hidden="true" />
                  </Button>
                  <ConfirmDeleteButton
                    id={post.id}
                    name={post.title}
                    action={deleteJournalPost}
                    successMessage="Artikel diarsipkan"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
