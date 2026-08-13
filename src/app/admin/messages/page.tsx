import type { Metadata } from "next";
import Link from "next/link";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { MessagesList } from "@/features/admin/messages/messages-list";
import { listMessages, isMessageStatus, MESSAGE_STATUSES } from "@/services/messages";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAuth();
  const params = await searchParams;
  const status = params.status && isMessageStatus(params.status) ? params.status : undefined;
  const messages = await listMessages(status);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Messages"
        description="Contact-form submissions from the public site."
      />

      <nav aria-label="Message status filter" className="flex flex-wrap gap-1">
        <FilterTab href="/admin/messages" label="All" active={status === undefined} />
        {MESSAGE_STATUSES.map((candidate) => (
          <FilterTab
            key={candidate}
            href={`/admin/messages?status=${candidate}`}
            label={candidate}
            active={status === candidate}
          />
        ))}
      </nav>

      <MessagesList messages={messages} />
    </div>
  );
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
