import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/features/admin/products/product-form";
import { createProduct } from "@/features/admin/products/actions";
import { getProductOptions } from "@/services/products";
import { getIngredientOptions } from "@/services/ingredients";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAuth();
  const [{ categories, collections }, ingredients] = await Promise.all([
    getProductOptions(),
    getIngredientOptions(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New product"
        description="Add a fragrance to the catalog."
      >
        <Button variant="outline" size="sm" render={<Link href="/admin/products" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to products
        </Button>
      </PageHeader>
      <ProductForm
        action={createProduct}
        categories={categories}
        collections={collections}
        ingredients={ingredients}
        submitLabel="Create product"
      />
    </div>
  );
}
