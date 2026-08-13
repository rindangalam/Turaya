import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "@/features/admin/categories/category-form";
import { createCategory } from "@/features/admin/categories/actions";

export const metadata: Metadata = { title: "New category" };

export default async function NewCategoryPage() {
  await requireAuth();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New category"
        description="Add a product category."
      >
        <Button variant="outline" size="sm" render={<Link href="/admin/categories" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to categories
        </Button>
      </PageHeader>
      <CategoryForm action={createCategory} submitLabel="Create category" />
    </div>
  );
}
