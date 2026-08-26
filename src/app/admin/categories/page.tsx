import type { Metadata } from "next";
import Link from "next/link";
import { PencilIcon, PlusIcon, TagIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { MoveButtons } from "@/components/admin/move-buttons";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { SortableList } from "@/components/admin/sortable-list";
import { Button } from "@/components/ui/button";
import { ContentStatusBadge } from "@/features/admin/shared/content-status-badge";
import { ConfirmDeleteButton } from "@/features/admin/shared/confirm-delete-button";
import {
  deleteCategory,
  moveCategory,
  reorderCategories,
} from "@/features/admin/categories/actions";
import { listCategories } from "@/services/categories";
import type { Category } from "@/services/categories";

export const metadata: Metadata = { title: "Kategori" };

export default async function CategoriesPage() {
  await requireAuth();
  const categories = await listCategories();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kategori"
        description="Jenis produk seperti Eau de Parfum atau Pewangi Ruangan."
      >
        <Button size="sm" render={<Link href="/admin/categories/new" />}>
          <PlusIcon aria-hidden="true" />
          Kategori baru
        </Button>
      </PageHeader>

      {categories.length === 0 ? (
        <EmptyState
          icon={<TagIcon className="size-6" aria-hidden="true" />}
          title="Belum ada kategori"
          description="Buat kategori produk pertama."
          action={
            <Button size="sm" render={<Link href="/admin/categories/new" />}>
              <PlusIcon aria-hidden="true" />
              Kategori baru
            </Button>
          }
        />
      ) : (
        <SortableList ids={categories.map((item) => item.id)} action={reorderCategories}>
          {categories.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              isFirst={index === 0}
              isLast={index === categories.length - 1}
            />
          ))}
        </SortableList>
      )}
    </div>
  );
}

function CategoryRow({
  category,
  isFirst,
  isLast,
}: {
  category: Category;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="w-6 shrink-0 text-center text-sm tabular-nums text-muted-foreground">
          {category.sort_order}
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
            <span className="truncate">{category.name}</span>
            <ContentStatusBadge status={category.status} />
          </p>
          <p className="truncate font-mono text-xs text-muted-foreground">{category.slug}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <MoveButtons
          id={category.id}
          name={category.name}
          isFirst={isFirst}
          isLast={isLast}
          action={moveCategory}
        />
        <Button
          variant="ghost"
          size="icon-sm"
          render={<Link href={`/admin/categories/${category.id}/edit`} />}
          aria-label={`Edit ${category.name}`}
        >
          <PencilIcon className="size-3.5" aria-hidden="true" />
        </Button>
        <ConfirmDeleteButton
          id={category.id}
          name={category.name}
          action={deleteCategory}
          successMessage="Category archived"
        />
      </div>
    </div>
  );
}
