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
  page?: number;
  pageSize?: number;
};

export async function listProducts(options: ProductListOptions = {}): Promise<ProductListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      "id, name, slug, status, featured, price, updated_at, categories(name), collections!products_collection_id_fkey(name), product_images(path, sort_order)",
    )
    .is("deleted_at", null);

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.q) {
    const like = `%${options.q}%`;
    query = query.or(`name.ilike.${like},slug.ilike.${like},tagline.ilike.${like}`);
  }

  if (options.page != null && options.pageSize != null) {
    const from = (options.page - 1) * options.pageSize;
    query = query.range(from, from + options.pageSize - 1);
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

export async function countProducts(
  options: Pick<ProductListOptions, "q" | "status"> = {},
): Promise<number> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null);

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.q) {
    const like = `%${options.q}%`;
    query = query.or(`name.ilike.${like},slug.ilike.${like},tagline.ilike.${like}`);
  }

  const { count, error } = await query;
  if (error) {
    console.error(`products: failed to count: ${error.message}`);
    return 0;
  }
  return count ?? 0;
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

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  story: string | null;
  size: string | null;
  price: number | null;
  featured: boolean;
  categoryName: string | null;
  categorySlug: string | null;
  collectionName: string | null;
  collectionSlug: string | null;
  images: { path: string; alt: string | null }[];
  notes: { name: string; noteStage: string }[];
};

export async function listPublishedProducts(): Promise<PublicProduct[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, tagline, price, featured, categories(name, slug), collections!products_collection_id_fkey(name, slug), product_images(path, alt, sort_order)",
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error(`products: failed to list published: ${error.message}`);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    tagline: row.tagline,
    description: null,
    story: null,
    size: null,
    price: row.price,
    featured: row.featured,
    categoryName: row.categories?.name ?? null,
    categorySlug: row.categories?.slug ?? null,
    collectionName: row.collections?.name ?? null,
    collectionSlug: row.collections?.slug ?? null,
    images: (row.product_images ?? []).map((image) => ({
      path: image.path,
      alt: image.alt,
    })),
    notes: [],
  }));
}

export async function getPublishedProductBySlug(slug: string): Promise<PublicProduct | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, tagline, description, story, size, price, featured, categories(name, slug), collections!products_collection_id_fkey(name, slug)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error(`products: failed to get published ${slug}: ${error.message}`);
    return null;
  }

  const { data: images } = await supabase
    .from("product_images")
    .select("path, alt")
    .eq("product_id", data.id)
    .order("sort_order", { ascending: true });

  const { data: notes } = await supabase
    .from("product_ingredients")
    .select("note_stage, ingredients(name)")
    .eq("product_id", data.id)
    .order("position", { ascending: true });

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    tagline: data.tagline,
    description: data.description,
    story: data.story,
    size: data.size,
    price: data.price,
    featured: data.featured,
    categoryName: data.categories?.name ?? null,
    categorySlug: data.categories?.slug ?? null,
    collectionName: data.collections?.name ?? null,
    collectionSlug: data.collections?.slug ?? null,
    images: (images ?? []).map((image) => ({ path: image.path, alt: image.alt })),
    notes: (notes ?? []).map((note) => ({
      name: note.ingredients?.name ?? "Unknown",
      noteStage: note.note_stage,
    })),
  };
}

export async function getProductStatusCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("status");
  if (error) {
    console.error(`products: failed to count statuses: ${error.message}`);
    return {};
  }
  return (data ?? []).reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {});
}
