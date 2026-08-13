import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Collection = Database["public"]["Tables"]["collections"]["Row"];

export async function listCollections(): Promise<Collection[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`collections: failed to list: ${error.message}`);
    return [];
  }

  return data ?? [];
}

export async function getCollection(id: string): Promise<Collection | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error(`collections: failed to get ${id}: ${error.message}`);
    return null;
  }

  return data;
}

export type CollectionProduct = {
  product_id: string;
  name: string;
  sort_order: number;
};

export async function getCollectionProducts(collectionId: string): Promise<CollectionProduct[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collection_products")
    .select("product_id, sort_order, products(name)")
    .eq("collection_id", collectionId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`collections: failed to list products for ${collectionId}: ${error.message}`);
    return [];
  }

  return (data ?? []).map((row) => ({
    product_id: row.product_id,
    name: row.products?.name ?? "Unknown",
    sort_order: row.sort_order,
  }));
}

export async function listAssignableProducts(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error(`collections: failed to list assignable products: ${error.message}`);
    return [];
  }

  return data ?? [];
}
