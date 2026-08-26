import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { PageHeader } from "@/components/admin/page-header";
import { Pagination } from "@/components/admin/pagination";
import { MessagesList } from "@/features/admin/messages/messages-list";
import { messageStatusLabel } from "@/lib/labels";
import {
  countMessages,
  getMessageStatusCounts,
  isMessageStatus,
  listMessages,
  MESSAGE_STATUSES,
} from "@/services/messages";

export const metadata: Metadata = { title: "Pesan" };

const PAGE_SIZE = 20;

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requireAuth();
  const params = await searchParams;
  const status = params.status && isMessageStatus(params.status) ? params.status : undefined;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const [messages, total, statusCounts] = await Promise.all([
    listMessages(status, page, PAGE_SIZE),
    countMessages(status),
    getMessageStatusCounts(),
  ]);
  const statusTotal = MESSAGE_STATUSES.reduce(
    (sum, candidate) => sum + (statusCounts[candidate] ?? 0),
    0,
  );
  const items = [
    { href: "/admin/messages", label: "Semua", count: statusTotal, active: status === undefined },
    ...MESSAGE_STATUSES.map((candidate) => ({
      href: `/admin/messages?status=${candidate}`,
      label: messageStatusLabel(candidate),
      count: statusCounts[candidate] ?? 0,
      active: status === candidate,
    })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pesan"
        description="Pesan dari formulir kontak situs publik."
      />

      <FilterTabs items={items} label="Filter status pesan" />

      <MessagesList messages={messages} />

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        label="pesan"
        hrefFor={(target) => {
          const params = new URLSearchParams();
          if (status) params.set("status", status);
          if (target > 1) params.set("page", String(target));
          const query = params.toString();
          return query ? `/admin/messages?${query}` : "/admin/messages";
        }}
      />
    </div>
  );
}
