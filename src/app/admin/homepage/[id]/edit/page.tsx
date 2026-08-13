import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { SectionForm } from "@/features/admin/homepage/section-form";
import { updateHomepageSection } from "@/features/admin/homepage/actions";
import { getSection } from "@/services/homepage";

export const metadata: Metadata = { title: "Edit section" };

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
      <PageHeader title="Edit section" description={`Editing “${section.name}”.`}>
        <Button variant="outline" size="sm" render={<Link href="/admin/homepage" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to sections
        </Button>
      </PageHeader>
      <SectionForm action={updateHomepageSection} section={section} submitLabel="Save section" />
    </div>
  );
}
