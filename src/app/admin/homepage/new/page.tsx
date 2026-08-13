import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { SectionForm } from "@/features/admin/homepage/section-form";
import { createHomepageSection } from "@/features/admin/homepage/actions";

export const metadata: Metadata = { title: "New section" };

export default function NewSectionPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New section" description="Compose a new block for the public homepage.">
        <Button variant="outline" size="sm" render={<Link href="/admin/homepage" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to sections
        </Button>
      </PageHeader>
      <SectionForm action={createHomepageSection} submitLabel="Create section" />
    </div>
  );
}
