import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type GalleryItem = Database["public"]["Tables"]["gallery_items"]["Row"];

export type GalleryListOptions = {
  status?: string;
  category?: string;
  page?: number;
  pageSize?: number;
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

  if (options.page != null && options.pageSize != null) {
    const from = (options.page - 1) * options.pageSize;
    query = query.range(from, from + options.pageSize - 1);
  }

  const { data, error } = await query.order("sort_order", { ascending: true });

  if (error) {
    console.error(`gallery: failed to list: ${error.message}`);
    return [];
  }

  return data ?? [];
}

export async function countGalleryItems(
  options: Pick<GalleryListOptions, "status" | "category"> = {},
): Promise<number> {
  const supabase = await createClient();

  let query = supabase
    .from("gallery_items")
    .select("id", { count: "exact", head: true });

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.category) {
    query = query.eq("category", options.category);
  }

  const { count, error } = await query;
  if (error) {
    console.error(`gallery: failed to count: ${error.message}`);
    return 0;
  }
  return count ?? 0;
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

export async function getGalleryStatusCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("gallery_items").select("status");
  if (error) {
    console.error(`gallery: failed to count statuses: ${error.message}`);
    return {};
  }
  return (data ?? []).reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {});
}
