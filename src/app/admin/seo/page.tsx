import type { Metadata } from "next";
import { SearchXIcon } from "lucide-react";

import { requireAdmin } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { SeoRowForm } from "@/features/admin/seo/seo-form";
import { listSeoMetadata } from "@/services/seo";

export const metadata: Metadata = { title: "SEO" };

export default async function SeoPage() {
  await requireAdmin();
  const rows = await listSeoMetadata();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="SEO metadata"
        description="Meta title, description and social sharing settings per page."
      />
      {rows.length === 0 ? (
        <EmptyState
          icon={<SearchXIcon className="size-6" aria-hidden="true" />}
          title="No SEO records yet"
          description="Per-page SEO settings will appear here once they have been seeded."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <SeoRowForm key={row.id} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}
