import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { GalleryForm } from "@/features/admin/gallery/gallery-form";
import { updateGalleryItem } from "@/features/admin/gallery/actions";
import { getGalleryItem, listGalleryCategories } from "@/services/gallery";

export const metadata: Metadata = { title: "Edit gambar" };

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;

  const [item, categories] = await Promise.all([getGalleryItem(id), listGalleryCategories()]);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit gambar"
        description="Perbarui keterangan, kategori, dan status."
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/gallery", label: "Galeri" },
              { href: `/admin/gallery/${item.id}`, label: item.alt },
            ]}
          />
        }
      />
      <GalleryForm
        action={updateGalleryItem}
        item={item}
        categories={categories}
        submitLabel="Simpan gambar"
      />
    </div>
  );
}
