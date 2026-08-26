import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/features/admin/products/product-form";
import { createProduct } from "@/features/admin/products/actions";
import { getProductOptions } from "@/services/products";
import { getIngredientOptions } from "@/services/ingredients";

export const metadata: Metadata = { title: "Produk baru" };

export default async function NewProductPage() {
  await requireAuth();
  const [{ categories, collections }, ingredients] = await Promise.all([
    getProductOptions(),
    getIngredientOptions(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Produk baru"
        description="Tambahkan parfum ke katalog."
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/products", label: "Produk" },
              { href: "/admin/products/new", label: "Baru" },
            ]}
          />
        }
      />
      <ProductForm
        action={createProduct}
        categories={categories}
        collections={collections}
        ingredients={ingredients}
        submitLabel="Buat produk"
      />
    </div>
  );
}
