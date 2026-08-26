import { Badge } from "@/components/ui/badge";
import { messageStatusLabel } from "@/lib/labels";
import type { MessageStatus } from "@/services/messages";

const STATUS_VARIANT: Record<MessageStatus, "default" | "secondary" | "outline"> = {
  new: "default",
  read: "secondary",
  replied: "outline",
  archived: "secondary",
};

export function MessageStatusBadge({ status }: { status: MessageStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{messageStatusLabel(status)}</Badge>;
}
