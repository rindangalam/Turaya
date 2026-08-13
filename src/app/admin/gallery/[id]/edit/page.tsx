import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { GalleryForm } from "@/features/admin/gallery/gallery-form";
import { updateGalleryItem } from "@/features/admin/gallery/actions";
import { getGalleryItem, listGalleryCategories } from "@/services/gallery";

export const metadata: Metadata = { title: "Edit gallery image" };

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
      <PageHeader title="Edit gallery image" description="Update the caption, category and status.">
        <Button variant="outline" size="sm" render={<Link href="/admin/gallery" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to gallery
        </Button>
      </PageHeader>
      <GalleryForm
        action={updateGalleryItem}
        item={item}
        categories={categories}
        submitLabel="Save image"
      />
    </div>
  );
}
