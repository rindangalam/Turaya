import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { JournalForm } from "@/features/admin/journal/journal-form";
import { createJournalPost } from "@/features/admin/journal/actions";
import { listJournalCategories, listJournalTags } from "@/services/journal";

export const metadata: Metadata = { title: "Artikel baru" };

export default async function NewJournalPostPage() {
  await requireAuth();
  const [categories, tags] = await Promise.all([listJournalCategories(), listJournalTags()]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Artikel baru"
        description="Tulis cerita untuk jurnal."
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/journal", label: "Jurnal" },
              { href: "/admin/journal/new", label: "Baru" },
            ]}
          />
        }
      />
      <JournalForm
        action={createJournalPost}
        categories={categories}
        tags={tags}
        initialTags={[]}
        submitLabel="Buat artikel"
      />
    </div>
  );
}
