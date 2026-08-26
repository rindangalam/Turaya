import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { IngredientForm } from "@/features/admin/ingredients/ingredient-form";
import { updateIngredient } from "@/features/admin/ingredients/actions";
import { getIngredient } from "@/services/ingredients";

export const metadata: Metadata = { title: "Edit bahan" };

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
        description="Perbarui detail bahan."
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/ingredients", label: "Bahan" },
              { href: `/admin/ingredients/${ingredient.id}`, label: ingredient.name },
            ]}
          />
        }
      />
      <IngredientForm
        action={updateIngredient}
        ingredient={ingredient}
        submitLabel="Simpan bahan"
      />
    </div>
  );
}
