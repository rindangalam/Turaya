import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { IngredientForm } from "@/features/admin/ingredients/ingredient-form";
import { createIngredient } from "@/features/admin/ingredients/actions";

export const metadata: Metadata = { title: "Bahan baru" };

export default async function NewIngredientPage() {
  await requireAuth();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bahan baru"
        description="Tambahkan bahan baku yang dipakai dalam piramida wewangian."
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/ingredients", label: "Bahan" },
              { href: "/admin/ingredients/new", label: "Baru" },
            ]}
          />
        }
      />
      <IngredientForm action={createIngredient} submitLabel="Buat bahan" />
    </div>
  );
}
