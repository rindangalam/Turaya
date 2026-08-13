import { Badge } from "@/components/ui/badge";
import type { MessageStatus } from "@/services/messages";

const STATUS_VARIANT: Record<MessageStatus, "default" | "secondary" | "outline"> = {
  new: "default",
  read: "secondary",
  replied: "outline",
  archived: "secondary",
};

export function MessageStatusBadge({ status }: { status: MessageStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>;
}
