import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { JournalList } from "@/features/admin/journal/journal-list";
import { JournalToolbar } from "@/features/admin/journal/journal-toolbar";
import {
  listJournalPosts,
  listJournalCategories,
} from "@/services/journal";
import { CONTENT_STATUSES } from "@/lib/validation/collections";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Journal" };

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string }>;
}) {
  await requireAuth();
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const status =
    params.status && (CONTENT_STATUSES as readonly string[]).includes(params.status)
      ? params.status
      : undefined;
  const category = params.category?.trim() || undefined;

  const [categories] = await Promise.all([listJournalCategories()]);

  const categoryFilter = category && categories.some((c) => c.id === category) ? category : undefined;
  const posts = await listJournalPosts({ q: q || undefined, status, categoryId: categoryFilter });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Journal"
        description="Write, publish and archive stories for the journal."
      >
        <Button size="sm" render={<Link href="/admin/journal/new" />}>
          <PlusIcon aria-hidden="true" />
          New post
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4">
        <JournalToolbar q={q} status={status ?? ""} category={categoryFilter ?? ""} categories={categories} />
        <nav aria-label="Journal status filter" className="flex flex-wrap gap-1">
          <FilterTab
            href={filterHref(undefined, q, categoryFilter)}
            label="All"
            active={status === undefined}
          />
          {CONTENT_STATUSES.map((candidate) => (
            <FilterTab
              key={candidate}
              href={filterHref(candidate, q, categoryFilter)}
              label={candidate}
              active={status === candidate}
            />
          ))}
        </nav>
      </div>

      <JournalList posts={posts} />
    </div>
  );
}

function filterHref(status: string | undefined, q: string, category: string | undefined) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  const query = params.toString();
  return query ? `/admin/journal?${query}` : "/admin/journal";
}

function FilterTab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-lg border border-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        active && "border-border bg-background font-medium text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
