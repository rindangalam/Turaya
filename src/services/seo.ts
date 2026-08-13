import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type SeoMetadata = Database["public"]["Tables"]["seo_metadata"]["Row"];

export async function listSeoMetadata(): Promise<SeoMetadata[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seo_metadata")
    .select("id, page, title, description, canonical_url, og_image_path, robots, updated_at")
    .order("page");

  if (error) {
    console.error(`seo: failed to list: ${error.message}`);
    return [];
  }

  return data ?? [];
}
