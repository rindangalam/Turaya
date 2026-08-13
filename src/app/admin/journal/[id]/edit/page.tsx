import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { JournalForm } from "@/features/admin/journal/journal-form";
import { updateJournalPost } from "@/features/admin/journal/actions";
import {
  getJournalPost,
  getPostTags,
  listJournalCategories,
  listJournalTags,
} from "@/services/journal";

export const metadata: Metadata = { title: "Edit journal post" };

export default async function EditJournalPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;

  const [post, categories, tags, postTags] = await Promise.all([
    getJournalPost(id),
    listJournalCategories(),
    listJournalTags(),
    getPostTags(id),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit journal post" description="Update the story, cover and publishing settings.">
        <Button variant="outline" size="sm" render={<Link href="/admin/journal" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to journal
        </Button>
      </PageHeader>
      <JournalForm
        action={updateJournalPost}
        post={post}
        categories={categories}
        tags={tags}
        initialTags={postTags}
        submitLabel="Save post"
      />
    </div>
  );
}
