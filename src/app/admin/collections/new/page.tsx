import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { CollectionForm } from "@/features/admin/collections/collection-form";
import { createCollection } from "@/features/admin/collections/actions";
import { listAssignableProducts } from "@/services/collections";

export const metadata: Metadata = { title: "New collection" };

export default async function NewCollectionPage() {
  await requireAuth();
  const assignable = await listAssignableProducts();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New collection"
        description="Create a group for fragrances."
      >
        <Button variant="outline" size="sm" render={<Link href="/admin/collections" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to collections
        </Button>
      </PageHeader>
      <CollectionForm
        action={createCollection}
        assignable={assignable}
        submitLabel="Create collection"
      />
    </div>
  );
}
