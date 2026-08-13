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

export type PublicSeoMetadata = Pick<
  SeoMetadata,
  "page" | "title" | "description" | "canonical_url" | "og_image_path" | "robots"
>;

export async function getSeoMetadata(page: string): Promise<PublicSeoMetadata | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seo_metadata")
    .select("page, title, description, canonical_url, og_image_path, robots")
    .eq("page", page)
    .maybeSingle();

  if (error) {
    console.error(`seo: failed to read ${page}: ${error.message}`);
    return null;
  }

  return data;
}
