import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "@/features/admin/categories/category-form";
import { updateCategory } from "@/features/admin/categories/actions";
import { getCategory } from "@/services/categories";

export const metadata: Metadata = { title: "Edit category" };

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
        description="Update the category details."
      >
        <Button variant="outline" size="sm" render={<Link href="/admin/categories" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to categories
        </Button>
      </PageHeader>
      <CategoryForm action={updateCategory} category={category} submitLabel="Save category" />
    </div>
  );
}
