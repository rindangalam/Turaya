"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";

import { requireAuth } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { collectionSchema } from "@/lib/validation/collections";
import type { ActionResult } from "@/lib/validation/action-result";
import type { Database } from "@/lib/supabase/database.types";
import { moveRow, reorderRows } from "@/features/admin/shared/reorder";

const COLLECTION_FIELDS = [
  "name",
  "slug",
  "description",
  "story",
  "cover_image_path",
  "seo_title",
  "seo_description",
] as const;

function clean(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  for (const key of COLLECTION_FIELDS) {
    const value = formData.get(key);
    raw[key] =
      typeof value === "string" && value.trim() === "" ? null : (value ?? null);
  }
  raw.featured = formData.get("featured") === "on";
  raw.status = String(formData.get("status") ?? "draft");
  return raw;
}

function slugConflict(): ActionResult {
  return { ok: false, fieldErrors: { slug: ["Sudah ada Koleksi dengan slug ini."] } };
}

async function replaceProducts(
  supabase: SupabaseClient<Database>,
  collectionId: string,
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const ids = String(formData.get("products") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const { error: deleteError } = await supabase
    .from("collection_products")
    .delete()
    .eq("collection_id", collectionId);
  if (deleteError) {
    console.error(`collections: failed to reset products for ${collectionId}: ${deleteError.message}`);
    return { ok: false, error: "Produk gagal disimpan. Silakan coba lagi." };
  }

  if (ids.length > 0) {
    const rows = ids.map((productId, sortOrder) => ({
      collection_id: collectionId,
      product_id: productId,
      sort_order: sortOrder,
    }));
    const { error: insertError } = await supabase.from("collection_products").insert(rows);
    if (insertError) {
      console.error(`collections: failed to save products for ${collectionId}: ${insertError.message}`);
      return { ok: false, error: "Produk gagal disimpan. Silakan coba lagi." };
    }
  }

  return { ok: true };
}

export async function createCollection(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const parsed = collectionSchema.safeParse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: rows } = await supabase.from("collections").select("sort_order");
  const nextSort = (rows ?? []).reduce((max, row) => Math.max(max, row.sort_order), 0) + 1;

  const { data: created, error } = await supabase
    .from("collections")
    .insert({ ...parsed.data, sort_order: nextSort })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return slugConflict();
    console.error(`collections: failed to create: ${error.message}`);
    return { ok: false, formError: "Koleksi gagal dibuat. Silakan coba lagi." };
  }

  const products = await replaceProducts(supabase, created.id, formData);
  if (!products.ok) {
    return { ok: false, formError: products.error };
  }

  revalidatePath("/admin/collections");
  return { ok: true };
}

export async function updateCollection(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Data koleksi tidak ditemukan." };
  }

  const parsed = collectionSchema.safeParse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("collections")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return slugConflict();
    console.error(`collections: failed to update ${id}: ${error.message}`);
    return { ok: false, formError: "Koleksi gagal disimpan. Silakan coba lagi." };
  }

  const products = await replaceProducts(supabase, id, formData);
  if (!products.ok) {
    return { ok: false, formError: products.error };
  }

  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${id}/edit`);
  return { ok: true };
}

export async function deleteCollection(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Data koleksi tidak ditemukan." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("collections")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error(`collections: failed to archive ${id}: ${error.message}`);
    return { ok: false, formError: "Koleksi gagal diarsipkan. Silakan coba lagi." };
  }

  revalidatePath("/admin/collections");
  return { ok: true };
}

export async function moveCollection(formData: FormData): Promise<void> {
  await requireAuth();
  await moveRow(
    "collections",
    String(formData.get("id") ?? ""),
    formData.get("direction") === "down" ? 1 : -1,
  );
  revalidatePath("/admin/collections");
}

export async function reorderCollections(formData: FormData): Promise<void> {
  await requireAuth();
  const ids = formData.getAll("ids").map(String).filter(Boolean);
  await reorderRows("collections", ids);
  revalidatePath("/admin/collections");
}

export async function toggleCollectionFeatured(formData: FormData): Promise<void> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    console.error("collections: featured toggle called without an id");
    return;
  }

  const supabase = await createClient();
  const { data: current } = await supabase
    .from("collections")
    .select("featured")
    .eq("id", id)
    .maybeSingle();

  if (!current) {
    console.error(`collections: ${id} not found for featured toggle`);
    return;
  }

  const { error } = await supabase
    .from("collections")
    .update({ featured: !current.featured })
    .eq("id", id);

  if (error) {
    console.error(`collections: failed to toggle featured ${id}: ${error.message}`);
    return;
  }

  revalidatePath("/admin/collections");
}
