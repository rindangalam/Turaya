import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
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

export const metadata: Metadata = { title: "Edit artikel" };

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
      <PageHeader
        title="Edit artikel"
        description="Perbarui cerita, sampul, dan pengaturan publikasi."
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/journal", label: "Jurnal" },
              { href: `/admin/journal/${post.id}`, label: post.title },
            ]}
          />
        }
      >
        {post.status === "published" ? (
          <Button
            variant="ghost"
            size="sm"
            render={<Link href={`/journal/${post.slug}`} target="_blank" rel="noopener noreferrer" />}
            aria-label="Lihat artikel di situs publik"
          >
            <ExternalLinkIcon aria-hidden="true" />
            Lihat di situs
          </Button>
        ) : null}
      </PageHeader>
      <JournalForm
        action={updateJournalPost}
        post={post}
        categories={categories}
        tags={tags}
        initialTags={postTags}
        submitLabel="Simpan artikel"
      />
    </div>
  );
}
