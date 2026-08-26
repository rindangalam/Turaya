import Link from "next/link";
import { InboxIcon } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/empty-state";
import { MessageStatusBadge } from "@/features/admin/messages/message-status-badge";
import { listMessages } from "@/services/messages";
import { formatRelativeTime } from "@/lib/format";

export async function RecentMessagesPanel() {
  const messages = await listMessages();
  const unread = messages.filter((message) => message.status === "new").length;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Pesan masuk</CardTitle>
        <CardDescription>Pesan terbaru dari formulir kontak.</CardDescription>
        <CardAction>
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
            {unread > 0 ? `${unread} baru` : messages.length}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <EmptyState
            icon={<InboxIcon className="size-6" aria-hidden="true" />}
            title="Belum ada pesan"
            description="Pesan dari formulir kontak akan tampil di sini."
            action={
              <Link
                href="/admin/messages"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Buka kotak masuk
              </Link>
            }
          />
        ) : (
          <>
            <ul className="flex flex-col">
              {messages.slice(0, 5).map((message) => (
                <li key={message.id} className="border-b border-border/70 py-2.5 first:pt-0 last:border-b-0 last:pb-0">
                  <Link
                    href={`/admin/messages/${message.id}`}
                    className="block min-w-0 rounded-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-sm font-medium">{message.name}</span>
                      <time
                        dateTime={message.created_at}
                        className="shrink-0 text-xs tabular-nums text-muted-foreground"
                      >
                        {formatRelativeTime(message.created_at)}
                      </time>
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-3">
                      <span className="truncate text-sm text-muted-foreground">
                        {message.subject || "Tanpa subjek"}
                      </span>
                      <MessageStatusBadge status={message.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <Link
                href="/admin/messages"
                className="text-sm text-primary underline-offset-4 hover:underline focus-visible:underline"
              >
                Buka kotak masuk
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
