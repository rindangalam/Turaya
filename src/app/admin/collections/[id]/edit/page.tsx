import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { CollectionForm } from "@/features/admin/collections/collection-form";
import { updateCollection } from "@/features/admin/collections/actions";
import { getCollection, getCollectionProducts, listAssignableProducts } from "@/services/collections";

export const metadata: Metadata = { title: "Edit collection" };

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;

  const [collection, products, assignable] = await Promise.all([
    getCollection(id),
    getCollectionProducts(id),
    listAssignableProducts(),
  ]);

  if (!collection) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit ${collection.name}`}
        description="Update the collection details."
      >
        <Button variant="outline" size="sm" render={<Link href="/admin/collections" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to collections
        </Button>
      </PageHeader>
      <CollectionForm
        action={updateCollection}
        collection={collection}
        products={products}
        assignable={assignable}
        submitLabel="Save collection"
      />
    </div>
  );
}
