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

export type PublicCollection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  story: string | null;
  coverImagePath: string | null;
  featured: boolean;
};

export async function listPublishedCollections(): Promise<PublicCollection[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("id, name, slug, description, story, cover_image_path, featured")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`collections: failed to list published: ${error.message}`);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    story: row.story,
    coverImagePath: row.cover_image_path,
    featured: row.featured,
  }));
}

export async function getPublishedCollectionBySlug(
  slug: string,
): Promise<PublicCollection | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("id, name, slug, description, story, cover_image_path, featured")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error(`collections: failed to get published ${slug}: ${error.message}`);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    story: data.story,
    coverImagePath: data.cover_image_path,
    featured: data.featured,
  };
}

export type PublicCollectionProduct = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  price: number | null;
  imagePath: string | null;
};

export async function getPublishedCollectionProducts(
  collectionId: string,
): Promise<PublicCollectionProduct[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collection_products")
    .select(
      "products(id, name, slug, tagline, price, status, deleted_at, product_images(path, sort_order))",
    )
    .eq("collection_id", collectionId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`collections: failed to list published products for ${collectionId}: ${error.message}`);
    return [];
  }

  return (data ?? [])
    .filter(
      (row): row is typeof row & { products: NonNullable<typeof row.products> } =>
        row.products != null && row.products.status === "published" && row.products.deleted_at == null,
    )
    .map((row) => ({
      id: row.products.id,
      name: row.products.name,
      slug: row.products.slug,
      tagline: row.products.tagline,
      price: row.products.price,
      imagePath: row.products.product_images?.[0]?.path ?? null,
    }));
}
