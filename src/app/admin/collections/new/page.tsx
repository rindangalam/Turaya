import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { CollectionForm } from "@/features/admin/collections/collection-form";
import { createCollection } from "@/features/admin/collections/actions";
import { listAssignableProducts } from "@/services/collections";

export const metadata: Metadata = { title: "Koleksi baru" };

export default async function NewCollectionPage() {
  await requireAuth();
  const assignable = await listAssignableProducts();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Koleksi baru"
        description="Buat kelompok baru untuk parfum."
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/collections", label: "Koleksi" },
              { href: "/admin/collections/new", label: "Baru" },
            ]}
          />
        }
      />
      <CollectionForm
        action={createCollection}
        assignable={assignable}
        submitLabel="Buat koleksi"
      />
    </div>
  );
}
