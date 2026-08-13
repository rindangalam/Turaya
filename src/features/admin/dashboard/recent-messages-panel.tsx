import Link from "next/link";
import { InboxIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/empty-state";
import { MessageStatusBadge } from "@/features/admin/messages/message-status-badge";
import { listMessages } from "@/services/messages";
import { formatRelativeTime } from "@/lib/format";

export async function RecentMessagesPanel() {
  const messages = await listMessages();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest messages</CardTitle>
        <CardDescription>Recent contact-form submissions.</CardDescription>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <EmptyState
            icon={<InboxIcon className="size-6" aria-hidden="true" />}
            title="No messages"
            description="Contact-form submissions will appear here."
            action={
              <Link
                href="/admin/messages"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Open inbox
              </Link>
            }
          />
        ) : (
          <>
            <ul className="divide-y divide-border">
              {messages.slice(0, 5).map((message) => (
                <li key={message.id} className="py-2.5 first:pt-0 last:pb-0">
                  <Link
                    href={`/admin/messages/${message.id}`}
                    className="block min-w-0 focus-visible:underline"
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-sm font-medium">{message.name}</span>
                      <time
                        dateTime={message.created_at}
                        className="shrink-0 text-xs text-muted-foreground"
                      >
                        {formatRelativeTime(message.created_at)}
                      </time>
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-3">
                      <span className="truncate text-sm text-muted-foreground">
                        {message.subject || "No subject"}
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
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Open inbox
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
