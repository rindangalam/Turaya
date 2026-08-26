import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { CategoryForm } from "@/features/admin/categories/category-form";
import { updateCategory } from "@/features/admin/categories/actions";
import { getCategory } from "@/services/categories";

export const metadata: Metadata = { title: "Edit kategori" };

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit ${category.name}`}
        description="Perbarui detail kategori."
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/categories", label: "Kategori" },
              { href: `/admin/categories/${category.id}`, label: category.name },
            ]}
          />
        }
      />
      <CategoryForm action={updateCategory} category={category} submitLabel="Simpan kategori" />
    </div>
  );
}
