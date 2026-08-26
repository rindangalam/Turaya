import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { SectionForm } from "@/features/admin/homepage/section-form";
import { updateHomepageSection } from "@/features/admin/homepage/actions";
import { getSection } from "@/services/homepage";

export const metadata: Metadata = { title: "Edit bagian" };

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const section = await getSection(id);

  if (!section) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit bagian"
        description={`Mengedit “${section.name}”.`}
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/homepage", label: "Bagian beranda" },
              { href: `/admin/homepage/${section.id}`, label: section.name },
            ]}
          />
        }
      />
      <SectionForm action={updateHomepageSection} section={section} submitLabel="Simpan bagian" />
    </div>
  );
}
