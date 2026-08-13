import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { GalleryForm } from "@/features/admin/gallery/gallery-form";
import { createGalleryItem } from "@/features/admin/gallery/actions";
import { listGalleryCategories } from "@/services/gallery";

export const metadata: Metadata = { title: "Upload gallery image" };

export default async function NewGalleryItemPage() {
  await requireAuth();
  const categories = await listGalleryCategories();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Upload gallery image" description="Add an editorial image to the gallery.">
        <Button variant="outline" size="sm" render={<Link href="/admin/gallery" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to gallery
        </Button>
      </PageHeader>
      <GalleryForm
        action={createGalleryItem}
        categories={categories}
        submitLabel="Upload image"
      />
    </div>
  );
}
