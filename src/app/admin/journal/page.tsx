import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { PageHeader } from "@/components/admin/page-header";
import { Pagination } from "@/components/admin/pagination";
import { Button } from "@/components/ui/button";
import { JournalList } from "@/features/admin/journal/journal-list";
import { JournalToolbar } from "@/features/admin/journal/journal-toolbar";
import {
  countJournalPosts,
  getJournalStatusCounts,
  listJournalCategories,
  listJournalPosts,
} from "@/services/journal";
import { CONTENT_STATUSES } from "@/lib/validation/collections";
import { contentStatusLabel } from "@/lib/labels";

export const metadata: Metadata = { title: "Jurnal" };

const PAGE_SIZE = 20;

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string; page?: string }>;
}) {
  await requireAuth();
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const status =
    params.status && (CONTENT_STATUSES as readonly string[]).includes(params.status)
      ? params.status
      : undefined;
  const category = params.category?.trim() || undefined;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const [categories, statusCounts] = await Promise.all([
    listJournalCategories(),
    getJournalStatusCounts(),
  ]);

  const categoryFilter = category && categories.some((c) => c.id === category) ? category : undefined;
  const [posts, total] = await Promise.all([
    listJournalPosts({
      q: q || undefined,
      status,
      categoryId: categoryFilter,
      page,
      pageSize: PAGE_SIZE,
    }),
    countJournalPosts({ q: q || undefined, status, categoryId: categoryFilter }),
  ]);
  const statusTotal = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Jurnal"
        description="Tulis, terbitkan, dan arsipkan cerita untuk jurnal."
      >
        <Button size="sm" render={<Link href="/admin/journal/new" />}>
          <PlusIcon aria-hidden="true" />
          Artikel baru
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4">
        <JournalToolbar q={q} status={status ?? ""} category={categoryFilter ?? ""} categories={categories} />
        <FilterTabs
          label="Filter status jurnal"
          items={[
            {
              href: filterHref(undefined, q, categoryFilter),
              label: "Semua",
              count: statusTotal,
              active: status === undefined,
            },
            ...CONTENT_STATUSES.map((candidate) => ({
              href: filterHref(candidate, q, categoryFilter),
              label: contentStatusLabel(candidate),
              count: statusCounts[candidate] ?? 0,
              active: status === candidate,
            })),
          ]}
        />
      </div>

      <JournalList posts={posts} />

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        label="artikel"
        hrefFor={(target) => pageHref(target, q, status, categoryFilter)}
      />
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

function pageHref(page: number, q: string, status: string | undefined, category: string | undefined) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/journal?${query}` : "/admin/journal";
}
