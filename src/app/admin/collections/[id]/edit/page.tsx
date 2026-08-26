import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { CollectionForm } from "@/features/admin/collections/collection-form";
import { updateCollection } from "@/features/admin/collections/actions";
import { getCollection, getCollectionProducts, listAssignableProducts } from "@/services/collections";

export const metadata: Metadata = { title: "Edit koleksi" };

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
        description="Perbarui detail koleksi."
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/collections", label: "Koleksi" },
              { href: `/admin/collections/${collection.id}`, label: collection.name },
            ]}
          />
        }
      >
        {collection.status === "published" ? (
          <Button
            variant="ghost"
            size="sm"
            render={<Link href={`/collections/${collection.slug}`} target="_blank" rel="noopener noreferrer" />}
            aria-label="Lihat koleksi di situs publik"
          >
            <ExternalLinkIcon aria-hidden="true" />
            Lihat di situs
          </Button>
        ) : null}
      </PageHeader>
      <CollectionForm
        action={updateCollection}
        collection={collection}
        products={products}
        assignable={assignable}
        submitLabel="Simpan koleksi"
      />
    </div>
  );
}
