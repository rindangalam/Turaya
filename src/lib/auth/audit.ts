import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";

export type AuditMetadata = Record<string, string | number | boolean | null>;

/**
 * Write an audit entry via the service-role client (append-only table;
 * the public API has no insert policy on audit_logs).
 * Actor is null for events without a known user (e.g., failed logins).
 */
export async function writeAudit(input: {
  action: string;
  actorId?: string | null;
  resource: string;
  resourceId?: string | null;
  metadata?: AuditMetadata;
}) {
  const admin = createAdminClient();

  await admin.from("audit_logs").insert({
    action: input.action,
    actor_id: input.actorId ?? null,
    resource: input.resource,
    resource_id: input.resourceId ?? null,
    metadata: (input.metadata ?? {}) as Json,
  });
}
