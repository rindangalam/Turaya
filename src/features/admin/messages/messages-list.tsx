import Link from "next/link";
import { InboxIcon } from "lucide-react";

import { EmptyState } from "@/components/admin/empty-state";
import { MessageStatusBadge } from "@/features/admin/messages/message-status-badge";
import { formatDateTime } from "@/lib/format";
import type { ContactMessage } from "@/services/messages";

export function MessagesList({ messages }: { messages: ContactMessage[] }) {
  if (messages.length === 0) {
    return (
      <EmptyState
        icon={<InboxIcon className="size-6" aria-hidden="true" />}
        title="No messages"
        description="Messages submitted through the contact form will appear here."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs tracking-wide text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">
              From
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Subject
            </th>
            <th scope="col" className="hidden px-4 py-2 font-medium sm:table-cell">
              Received
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {messages.map((message) => (
            <tr key={message.id} className="hover:bg-muted/40">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/messages/${message.id}`}
                  className="block max-w-[180px] focus-visible:outline-none focus-visible:underline"
                >
                  <span className="block truncate font-medium">{message.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {message.email}
                  </span>
                </Link>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/messages/${message.id}`}
                  className="block max-w-[280px] truncate font-medium focus-visible:underline"
                >
                  {message.subject || "No subject"}
                </Link>
              </td>
              <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                {formatDateTime(message.created_at)}
              </td>
              <td className="px-4 py-3">
                <MessageStatusBadge status={message.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
