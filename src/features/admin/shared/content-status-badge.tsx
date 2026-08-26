import { Badge } from "@/components/ui/badge";
import { contentStatusLabel } from "@/lib/labels";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  published: "default",
  draft: "secondary",
  archived: "outline",
};

export function ContentStatusBadge({ status }: { status: string }) {
  const variant = STATUS_VARIANT[status] ?? "secondary";
  return <Badge variant={variant}>{contentStatusLabel(status)}</Badge>;
}
