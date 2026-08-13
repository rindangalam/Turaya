import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { IngredientForm } from "@/features/admin/ingredients/ingredient-form";
import { createIngredient } from "@/features/admin/ingredients/actions";

export const metadata: Metadata = { title: "New ingredient" };

export default async function NewIngredientPage() {
  await requireAuth();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New ingredient"
        description="Add a raw material used in the fragrance pyramid."
      >
        <Button variant="outline" size="sm" render={<Link href="/admin/ingredients" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to ingredients
        </Button>
      </PageHeader>
      <IngredientForm action={createIngredient} submitLabel="Create ingredient" />
    </div>
  );
}
