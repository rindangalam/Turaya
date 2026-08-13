import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Ingredient = Database["public"]["Tables"]["ingredients"]["Row"];

export async function listIngredients(): Promise<Ingredient[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`ingredients: failed to list: ${error.message}`);
    return [];
  }

  return data ?? [];
}

export async function getIngredient(id: string): Promise<Ingredient | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error(`ingredients: failed to get ${id}: ${error.message}`);
    return null;
  }

  return data;
}

export async function getIngredientOptions(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ingredients")
    .select("id, name")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error(`ingredients: failed to list options: ${error.message}`);
    return [];
  }

  return data ?? [];
}
