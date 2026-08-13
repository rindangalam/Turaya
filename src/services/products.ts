import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  status: string;
  featured: boolean;
  price: number | null;
  updated_at: string;
  categoryName: string | null;
  collectionName: string | null;
  imagePath: string | null;
};

export type ProductListOptions = {
  q?: string;
  status?: string;
  sort?: import("@/lib/validation/product").ProductSort;
};

export async function listProducts(options: ProductListOptions = {}): Promise<ProductListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      "id, name, slug, status, featured, price, updated_at, categories(name), collections(name), product_images(path, sort_order)",
    )
    .is("deleted_at", null);

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.q) {
    const like = `%${options.q}%`;
    query = query.or(`name.ilike.${like},slug.ilike.${like},tagline.ilike.${like}`);
  }

  const sort = options.sort ?? "updated_desc";
  switch (sort) {
    case "updated_asc":
      query = query.order("updated_at", { ascending: true });
      break;
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    case "name_desc":
      query = query.order("name", { ascending: false });
      break;
    case "price_asc":
      query = query.order("price", { ascending: true, nullsFirst: false });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false, nullsFirst: false });
      break;
    default:
      query = query.order("updated_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error(`products: failed to list: ${error.message}`);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    featured: row.featured,
    price: row.price,
    updated_at: row.updated_at,
    categoryName: row.categories?.name ?? null,
    collectionName: row.collections?.name ?? null,
    imagePath: row.product_images?.[0]?.path ?? null,
  }));
}

export type ProductDetail = Product & { images: ProductImage[] };

export type ProductNote = {
  ingredient_id: string;
  name: string;
  note_stage: string;
  position: number;
};

export async function getProductNotes(productId: string): Promise<ProductNote[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_ingredients")
    .select("ingredient_id, note_stage, position, ingredients(name)")
    .eq("product_id", productId)
    .order("note_stage", { ascending: true })
    .order("position", { ascending: true });

  if (error) {
    console.error(`products: failed to get notes for ${productId}: ${error.message}`);
    return [];
  }

  return (data ?? []).map((row) => ({
    ingredient_id: row.ingredient_id,
    name: row.ingredients?.name ?? "Unknown",
    note_stage: row.note_stage,
    position: row.position,
  }));
}

export async function getProduct(id: string): Promise<ProductDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(id, path, alt, caption, sort_order, product_id, created_at)")
    .eq("id", id)
    .is("deleted_at", null)
    .order("sort_order", { foreignTable: "product_images", ascending: true })
    .maybeSingle();

  if (error || !data) {
    if (error) console.error(`products: failed to get ${id}: ${error.message}`);
    return null;
  }

  const { product_images, ...product } = data;
  return { ...product, images: product_images ?? [] };
}

export async function getProductOptions() {
  const supabase = await createClient();

  const [{ data: categories }, { data: collections }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name")
      .is("deleted_at", null)
      .order("name", { ascending: true }),
    supabase
      .from("collections")
      .select("id, name")
      .is("deleted_at", null)
      .order("name", { ascending: true }),
  ]);

  return { categories: categories ?? [], collections: collections ?? [] };
}
