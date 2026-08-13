import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Category = Database["public"]["Tables"]["categories"]["Row"];

export async function listCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`categories: failed to list: ${error.message}`);
    return [];
  }

  return data ?? [];
}

export async function getCategory(id: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error(`categories: failed to get ${id}: ${error.message}`);
    return null;
  }

  return data;
}

export async function listPublishedCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`categories: failed to list published: ${error.message}`);
    return [];
  }

  return data ?? [];
}
