import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/features/admin/products/product-form";
import { updateProduct } from "@/features/admin/products/actions";
import { getProduct, getProductNotes, getProductOptions } from "@/services/products";
import { getIngredientOptions } from "@/services/ingredients";

export const metadata: Metadata = { title: "Edit produk" };

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
        description="Perbarui produk dan gambarnya."
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/products", label: "Produk" },
              { href: `/admin/products/${product.id}`, label: product.name },
            ]}
          />
        }
      >
        {product.status === "published" ? (
          <Button
            variant="ghost"
            size="sm"
            render={<Link href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer" />}
            aria-label="Lihat produk di situs publik"
          >
            <ExternalLinkIcon aria-hidden="true" />
            Lihat di situs
          </Button>
        ) : null}
      </PageHeader>
      <ProductForm
        action={updateProduct}
        product={product}
        images={product.images}
        categories={categories}
        collections={collections}
        ingredients={ingredients}
        notes={notes}
        submitLabel="Simpan produk"
      />
    </div>
  );
}
