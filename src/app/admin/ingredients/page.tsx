import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownIcon, ArrowUpIcon, Flower2Icon, PencilIcon, PlusIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { ContentStatusBadge } from "@/features/admin/shared/content-status-badge";
import { ConfirmDeleteButton } from "@/features/admin/shared/confirm-delete-button";
import {
  deleteIngredient,
  moveIngredient,
} from "@/features/admin/ingredients/actions";
import { listIngredients } from "@/services/ingredients";
import type { Ingredient } from "@/services/ingredients";

export const metadata: Metadata = { title: "Ingredients" };

export default async function IngredientsPage() {
  await requireAuth();
  const ingredients = await listIngredients();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Ingredients"
        description="Raw materials used in the fragrance pyramid."
      >
        <Button size="sm" render={<Link href="/admin/ingredients/new" />}>
          <PlusIcon aria-hidden="true" />
          New ingredient
        </Button>
      </PageHeader>

      {ingredients.length === 0 ? (
        <EmptyState
          icon={<Flower2Icon className="size-6" aria-hidden="true" />}
          title="No ingredients yet"
          description="Create your first ingredient to map fragrance notes."
          action={
            <Button size="sm" render={<Link href="/admin/ingredients/new" />}>
              <PlusIcon aria-hidden="true" />
              New ingredient
            </Button>
          }
        />
      ) : (
        <ol className="flex flex-col gap-3">
          {ingredients.map((ingredient, index) => (
            <li key={ingredient.id}>
              <IngredientRow
                ingredient={ingredient}
                isFirst={index === 0}
                isLast={index === ingredients.length - 1}
              />
            </li>
          ))}
        </ol>
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
        <form action={moveIngredient}>
          <input type="hidden" name="id" value={ingredient.id} />
          <input type="hidden" name="direction" value="up" />
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            disabled={isFirst}
            aria-label={`Move ${ingredient.name} up`}
          >
            <ArrowUpIcon className="size-3.5" aria-hidden="true" />
          </Button>
        </form>
        <form action={moveIngredient}>
          <input type="hidden" name="id" value={ingredient.id} />
          <input type="hidden" name="direction" value="down" />
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            disabled={isLast}
            aria-label={`Move ${ingredient.name} down`}
          >
            <ArrowDownIcon className="size-3.5" aria-hidden="true" />
          </Button>
        </form>
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
