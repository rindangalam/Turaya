import { Badge } from "@/components/ui/badge";
import type { ProductStatus } from "@/lib/validation/product";

const STATUS_VARIANT: Record<ProductStatus, "default" | "secondary" | "outline"> = {
  published: "default",
  draft: "secondary",
  archived: "outline",
};

export function ProductStatusBadge({ status }: { status: string }) {
  const variant = STATUS_VARIANT[status as ProductStatus] ?? "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}
