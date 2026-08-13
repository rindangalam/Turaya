import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type StoreLocation = Database["public"]["Tables"]["store_locations"]["Row"];

export type PublicStore = Pick<
  StoreLocation,
  "id" | "name" | "address" | "city" | "country" | "phone" | "email" | "hours"
>;

export async function listPublishedStores(): Promise<PublicStore[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("store_locations")
    .select("id, name, address, city, country, phone, email, hours")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`stores: failed to list published: ${error.message}`);
    return [];
  }

  return data ?? [];
}
