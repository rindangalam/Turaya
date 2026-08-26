import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type MessageStatus = Database["public"]["Tables"]["contact_messages"]["Row"]["status"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];

export const MESSAGE_STATUSES: MessageStatus[] = ["new", "read", "replied", "archived"];

export function isMessageStatus(value: string): value is MessageStatus {
  return (MESSAGE_STATUSES as string[]).includes(value);
}

export async function listMessages(
  status?: MessageStatus,
  page?: number,
  pageSize?: number,
): Promise<ContactMessage[]> {
  const supabase = await createClient();

  let query = supabase
    .from("contact_messages")
    .select("id, name, email, subject, message, status, created_at")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (page != null && pageSize != null) {
    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);
  }

  const { data, error } = await query;
  if (error) {
    console.error(`messages: failed to list: ${error.message}`);
    return [];
  }

  return data ?? [];
}

export async function countMessages(status?: MessageStatus): Promise<number> {
  const supabase = await createClient();

  let query = supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true });

  if (status) {
    query = query.eq("status", status);
  }

  const { count, error } = await query;
  if (error) {
    console.error(`messages: failed to count: ${error.message}`);
    return 0;
  }
  return count ?? 0;
}

export async function getMessage(id: string): Promise<ContactMessage | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject, message, status, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`messages: failed to get ${id}: ${error.message}`);
    return null;
  }

  return data;
}

export async function getMessageStatusCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("contact_messages").select("status");
  if (error) {
    console.error(`messages: failed to count statuses: ${error.message}`);
    return {};
  }
  return (data ?? []).reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {});
}

export async function countUnreadMessages(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  if (error) {
    console.error(`messages: failed to count unread: ${error.message}`);
    return 0;
  }
  return count ?? 0;
}
