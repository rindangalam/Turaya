import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { CategoryForm } from "@/features/admin/categories/category-form";
import { createCategory } from "@/features/admin/categories/actions";

export const metadata: Metadata = { title: "Kategori baru" };

export default async function NewCategoryPage() {
  await requireAuth();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kategori baru"
        description="Tambahkan kategori produk."
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/categories", label: "Kategori" },
              { href: "/admin/categories/new", label: "Baru" },
            ]}
          />
        }
      />
      <CategoryForm action={createCategory} submitLabel="Buat kategori" />
    </div>
  );
}
