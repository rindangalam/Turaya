import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type FaqItem = Database["public"]["Tables"]["faq_items"]["Row"];

export type PublicFaqItem = Pick<FaqItem, "id" | "question" | "answer" | "category" | "sort_order">;

export async function listPublishedFaq(): Promise<PublicFaqItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faq_items")
    .select("id, question, answer, category, sort_order")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`faq: failed to list published: ${error.message}`);
    return [];
  }

  return data ?? [];
}
