import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/features/admin/products/product-form";
import { updateProduct } from "@/features/admin/products/actions";
import { getProduct, getProductNotes, getProductOptions } from "@/services/products";
import { getIngredientOptions } from "@/services/ingredients";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;

  const [product, { categories, collections }, ingredients, notes] = await Promise.all([
    getProduct(id),
    getProductOptions(),
    getIngredientOptions(),
    getProductNotes(id),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit ${product.name}`}
        description="Update the product and its images."
      >
        <Button variant="outline" size="sm" render={<Link href="/admin/products" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to products
        </Button>
      </PageHeader>
      <ProductForm
        action={updateProduct}
        product={product}
        images={product.images}
        categories={categories}
        collections={collections}
        ingredients={ingredients}
        notes={notes}
        submitLabel="Save product"
      />
    </div>
  );
}
