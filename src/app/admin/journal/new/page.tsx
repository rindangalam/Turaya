import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { JournalForm } from "@/features/admin/journal/journal-form";
import { createJournalPost } from "@/features/admin/journal/actions";
import { listJournalCategories, listJournalTags } from "@/services/journal";

export const metadata: Metadata = { title: "New journal post" };

export default async function NewJournalPostPage() {
  await requireAuth();
  const [categories, tags] = await Promise.all([listJournalCategories(), listJournalTags()]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New journal post" description="Write a story for the journal.">
        <Button variant="outline" size="sm" render={<Link href="/admin/journal" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to journal
        </Button>
      </PageHeader>
      <JournalForm
        action={createJournalPost}
        categories={categories}
        tags={tags}
        initialTags={[]}
        submitLabel="Create post"
      />
    </div>
  );
}
