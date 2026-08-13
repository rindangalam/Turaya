import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type MessageStatus = Database["public"]["Tables"]["contact_messages"]["Row"]["status"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];

export const MESSAGE_STATUSES: MessageStatus[] = ["new", "read", "replied", "archived"];

export function isMessageStatus(value: string): value is MessageStatus {
  return (MESSAGE_STATUSES as string[]).includes(value);
}

export async function listMessages(status?: MessageStatus): Promise<ContactMessage[]> {
  const supabase = await createClient();

  let query = supabase
    .from("contact_messages")
    .select("id, name, email, subject, message, status, created_at")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    console.error(`messages: failed to list: ${error.message}`);
    return [];
  }

  return data ?? [];
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
