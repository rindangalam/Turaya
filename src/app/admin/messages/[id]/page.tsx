import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReplyIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MessageStatusBadge } from "@/features/admin/messages/message-status-badge";
import { MessageStatusControl } from "@/features/admin/messages/message-status-control";
import { getMessage } from "@/services/messages";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Pesan" };

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
    `Re: ${message.subject ?? "pesan Anda"}`,
  )}`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pesan"
        description={`Dari ${message.email}`}
        breadcrumb={
          <Breadcrumb
            items={[
              { href: "/admin/messages", label: "Pesan" },
              { href: `/admin/messages/${message.id}`, label: message.name },
            ]}
          />
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-heading-md font-semibold">
              {message.subject || "Tanpa subjek"}
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
            Balas via email
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
