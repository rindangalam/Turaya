import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { GalleryForm } from "@/features/admin/gallery/gallery-form";
import { createGalleryItem } from "@/features/admin/gallery/actions";
import { listGalleryCategories } from "@/services/gallery";

export const metadata: Metadata = { title: "Unggah gambar" };

export default async function NewGalleryItemPage() {
  await requireAuth();
  const categories = await listGalleryCategories();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Unggah gambar"
        description="Tambahkan gambar editorial ke galeri."
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/gallery", label: "Galeri" },
              { href: "/admin/gallery/new", label: "Unggah" },
            ]}
          />
        }
      />
      <GalleryForm
        action={createGalleryItem}
        categories={categories}
        submitLabel="Unggah gambar"
      />
    </div>
  );
}
