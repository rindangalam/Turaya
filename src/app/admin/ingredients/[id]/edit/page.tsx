import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { IngredientForm } from "@/features/admin/ingredients/ingredient-form";
import { updateIngredient } from "@/features/admin/ingredients/actions";
import { getIngredient } from "@/services/ingredients";

export const metadata: Metadata = { title: "Edit ingredient" };

export default async function EditIngredientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const ingredient = await getIngredient(id);

  if (!ingredient) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit ${ingredient.name}`}
        description="Update the ingredient details."
      >
        <Button variant="outline" size="sm" render={<Link href="/admin/ingredients" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to ingredients
        </Button>
      </PageHeader>
      <IngredientForm
        action={updateIngredient}
        ingredient={ingredient}
        submitLabel="Save ingredient"
      />
    </div>
  );
}
