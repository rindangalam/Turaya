import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type HomepageSection = Database["public"]["Tables"]["homepage_sections"]["Row"];

export type VisibleHomepageSection = Pick<
  HomepageSection,
  | "id"
  | "name"
  | "slug"
  | "headline"
  | "subheadline"
  | "body"
  | "image_path"
  | "button_label"
  | "button_url"
  | "visible"
  | "sort_order"
>;

export async function listSections(): Promise<HomepageSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`homepage: failed to list sections: ${error.message}`);
    return [];
  }
  return data ?? [];
}

export async function getSection(id: string): Promise<HomepageSection | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`homepage: failed to get section ${id}: ${error.message}`);
    return null;
  }
  return data;
}

export async function getVisibleSections(): Promise<VisibleHomepageSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("id, name, slug, headline, subheadline, body, image_path, button_label, button_url, visible, sort_order")
    .eq("visible", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`homepage: failed to read visible sections: ${error.message}`);
    return [];
  }
  return data ?? [];
}
