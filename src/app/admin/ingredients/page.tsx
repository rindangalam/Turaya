import type { Metadata } from "next";
import Link from "next/link";
import { Flower2Icon, PencilIcon, PlusIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { MoveButtons } from "@/components/admin/move-buttons";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { SortableList } from "@/components/admin/sortable-list";
import { Button } from "@/components/ui/button";
import { ContentStatusBadge } from "@/features/admin/shared/content-status-badge";
import { ConfirmDeleteButton } from "@/features/admin/shared/confirm-delete-button";
import {
  deleteIngredient,
  moveIngredient,
  reorderIngredients,
} from "@/features/admin/ingredients/actions";
import { listIngredients } from "@/services/ingredients";
import type { Ingredient } from "@/services/ingredients";

export const metadata: Metadata = { title: "Bahan" };

export default async function IngredientsPage() {
  await requireAuth();
  const ingredients = await listIngredients();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bahan"
        description="Bahan baku yang dipakai dalam piramida wewangian."
      >
        <Button size="sm" render={<Link href="/admin/ingredients/new" />}>
          <PlusIcon aria-hidden="true" />
          Bahan baru
        </Button>
      </PageHeader>

      {ingredients.length === 0 ? (
        <EmptyState
          icon={<Flower2Icon className="size-6" aria-hidden="true" />}
          title="Belum ada bahan"
          description="Buat bahan pertama untuk memetakan nada wewangian."
          action={
            <Button size="sm" render={<Link href="/admin/ingredients/new" />}>
              <PlusIcon aria-hidden="true" />
              Bahan baru
            </Button>
          }
        />
      ) : (
        <SortableList ids={ingredients.map((item) => item.id)} action={reorderIngredients}>
          {ingredients.map((ingredient, index) => (
            <IngredientRow
              key={ingredient.id}
              ingredient={ingredient}
              isFirst={index === 0}
              isLast={index === ingredients.length - 1}
            />
          ))}
        </SortableList>
      )}
    </div>
  );
}

function IngredientRow({
  ingredient,
  isFirst,
  isLast,
}: {
  ingredient: Ingredient;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="w-6 shrink-0 text-center text-sm tabular-nums text-muted-foreground">
          {ingredient.sort_order}
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
            <span className="truncate">{ingredient.name}</span>
            <ContentStatusBadge status={ingredient.status} />
          </p>
          <p className="truncate font-mono text-xs text-muted-foreground">
            {ingredient.slug}
            {ingredient.origin ? ` · ${ingredient.origin}` : ""}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <MoveButtons
          id={ingredient.id}
          name={ingredient.name}
          isFirst={isFirst}
          isLast={isLast}
          action={moveIngredient}
        />
        <Button
          variant="ghost"
          size="icon-sm"
          render={<Link href={`/admin/ingredients/${ingredient.id}/edit`} />}
          aria-label={`Edit ${ingredient.name}`}
        >
          <PencilIcon className="size-3.5" aria-hidden="true" />
        </Button>
        <ConfirmDeleteButton
          id={ingredient.id}
          name={ingredient.name}
          action={deleteIngredient}
          successMessage="Ingredient archived"
        />
      </div>
    </div>
  );
}
