import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ReplyIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MessageStatusBadge } from "@/features/admin/messages/message-status-badge";
import { MessageStatusControl } from "@/features/admin/messages/message-status-control";
import { getMessage } from "@/services/messages";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Message" };

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const message = await getMessage(id);

  if (!message) {
    notFound();
  }

  const replyHref = `mailto:${message.email}?subject=${encodeURIComponent(
    `Re: ${message.subject ?? "your message"}`,
  )}`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Message" description={`From ${message.email}`}>
        <Button variant="outline" size="sm" render={<Link href="/admin/messages" />}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to inbox
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-heading-md font-semibold">
              {message.subject || "No subject"}
            </h2>
            <MessageStatusBadge status={message.status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{message.name}</span>
            <span>{formatDateTime(message.created_at)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.message}</p>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
          <MessageStatusControl id={message.id} status={message.status} />
          <Button variant="outline" size="sm" render={<a href={replyHref} />}>
            <ReplyIcon aria-hidden="true" />
            Reply by email
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
