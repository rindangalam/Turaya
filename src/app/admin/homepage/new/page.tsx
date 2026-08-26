import type { Metadata } from "next";

import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { SectionForm } from "@/features/admin/homepage/section-form";
import { createHomepageSection } from "@/features/admin/homepage/actions";

export const metadata: Metadata = { title: "Bagian baru" };

export default function NewSectionPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bagian baru"
        description="Susun blok baru untuk beranda publik."
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/homepage", label: "Bagian beranda" },
              { href: "/admin/homepage/new", label: "Baru" },
            ]}
          />
        }
      />
      <SectionForm action={createHomepageSection} submitLabel="Buat bagian" />
    </div>
  );
}
