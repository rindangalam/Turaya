import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type GalleryItem = Database["public"]["Tables"]["gallery_items"]["Row"];

export type GalleryListOptions = {
  status?: string;
  category?: string;
};

export async function listGalleryItems(
  options: GalleryListOptions = {},
): Promise<GalleryItem[]> {
  const supabase = await createClient();

  let query = supabase.from("gallery_items").select("*");

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.category) {
    query = query.eq("category", options.category);
  }

  const { data, error } = await query.order("sort_order", { ascending: true });

  if (error) {
    console.error(`gallery: failed to list: ${error.message}`);
    return [];
  }

  return data ?? [];
}

export async function listGalleryCategories(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_items")
    .select("category")
    .not("category", "is", null)
    .order("category", { ascending: true });

  if (error) {
    console.error(`gallery: failed to list categories: ${error.message}`);
    return [];
  }

  return [
    ...new Set(
      (data ?? [])
        .map((row) => row.category)
        .filter((category): category is string => category !== null),
    ),
  ];
}

export async function getGalleryItem(id: string): Promise<GalleryItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`gallery: failed to get ${id}: ${error.message}`);
    return null;
  }

  return data;
}

export async function listPublishedGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`gallery: failed to list published: ${error.message}`);
    return [];
  }

  return data ?? [];
}

export async function listTestimonialPhotos(): Promise<GalleryItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("status", "published")
    .like("path", "testimoni-%")
    .order("path", { ascending: true });

  if (error) {
    console.error(`gallery: failed to list testimonial photos: ${error.message}`);
    return [];
  }

  return data ?? [];
}
