"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";

import { requireAuth } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/validation/product";
import type { ActionResult } from "@/lib/validation/action-result";
import type { Database } from "@/lib/supabase/database.types";

const PRODUCT_FIELDS = [
  "name",
  "slug",
  "tagline",
  "description",
  "story",
  "category_id",
  "collection_id",
  "size",
  "price",
  "seo_title",
  "seo_description",
] as const;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_NEW_IMAGES = 5;

function clean(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  for (const key of PRODUCT_FIELDS) {
    const value = formData.get(key);
    raw[key] =
      typeof value === "string" && value.trim() === "" ? null : (value ?? null);
  }
  raw.featured = formData.get("featured") === "on";
  raw.status = String(formData.get("status") ?? "draft");
  return raw;
}

function extensionFor(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

function collectNewImages(
  formData: FormData,
): { ok: true; files: File[] } | { ok: false; error: string } {
  const files = formData
    .getAll("new_images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length > MAX_NEW_IMAGES) {
    return { ok: false, error: `Maksimal ${MAX_NEW_IMAGES} gambar per produk.` };
  }

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return { ok: false, error: "Hanya gambar JPEG, PNG, atau WebP yang diizinkan." };
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return { ok: false, error: "Ukuran setiap gambar maksimal 5 MB." };
    }
  }

  return { ok: true, files };
}

function slugConflict(): ActionResult {
  return { ok: false, fieldErrors: { slug: ["Produk dengan slug ini sudah ada."] } };
}

async function uploadNewImages(
  supabase: SupabaseClient<Database>,
  productId: string,
  files: File[],
  startOrder: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const bytes = await file.arrayBuffer();
    const path = `products/${productId}/${crypto.randomUUID()}.${extensionFor(file.type)}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(path, bytes, { contentType: file.type });

    if (uploadError) {
      console.error(`products: image upload failed for ${productId}: ${uploadError.message}`);
      return { ok: false, error: "Sebagian gambar gagal diunggah. Silakan coba lagi." };
    }

    const { error: insertError } = await supabase
      .from("product_images")
      .insert({ product_id: productId, path, alt: file.name, sort_order: startOrder + i });

    if (insertError) {
      console.error(`products: image row insert failed: ${insertError.message}`);
      return { ok: false, error: "Sebagian gambar gagal disimpan. Silakan coba lagi." };
    }
  }

  return { ok: true };
}

async function manageExistingImages(
  supabase: SupabaseClient<Database>,
  productId: string,
  formData: FormData,
  count: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  for (let i = 0; i < count; i++) {
    const imageId = String(formData.get(`existing_image_id_${i}`) ?? "");
    if (!imageId) continue;

    const path = String(formData.get(`existing_image_path_${i}`) ?? "");
    const remove = formData.get(`remove_${i}`) === "on";

    if (remove) {
      if (path) {
        const { error: removeError } = await supabase.storage.from("products").remove([path]);
        if (removeError) {
          console.error(`products: failed to remove image ${path}: ${removeError.message}`);
          return { ok: false, error: "Sebagian gambar gagal dihapus. Silakan coba lagi." };
        }
      }

      const { error: deleteError } = await supabase
        .from("product_images")
        .delete()
        .eq("id", imageId)
        .eq("product_id", productId);

      if (deleteError) {
        console.error(`products: failed to delete image row ${imageId}: ${deleteError.message}`);
        return { ok: false, error: "Sebagian gambar gagal dihapus. Silakan coba lagi." };
      }
      continue;
    }

    const alt = String(formData.get(`alt_${i}`) ?? "");
    const caption = String(formData.get(`caption_${i}`) ?? "");

    const { error } = await supabase
      .from("product_images")
      .update({ alt, caption: caption.trim() === "" ? null : caption })
      .eq("id", imageId)
      .eq("product_id", productId);

    if (error) {
      console.error(`products: failed to update image ${imageId}: ${error.message}`);
      return { ok: false, error: "Detail gambar gagal disimpan. Silakan coba lagi." };
    }
  }

  const order = String(formData.get("existing_image_order") ?? "");
  if (order) {
    const ids = order.split(",").map((id) => id.trim()).filter(Boolean);
    for (let position = 0; position < ids.length; position++) {
      const { error } = await supabase
        .from("product_images")
        .update({ sort_order: position })
        .eq("id", ids[position])
        .eq("product_id", productId);

      if (error) {
        console.error(`products: failed to order image ${ids[position]}: ${error.message}`);
        return { ok: false, error: "Urutan gambar gagal disimpan. Silakan coba lagi." };
      }
    }
  }

  return { ok: true };
}

const NOTE_STAGES = ["top", "heart", "base"] as const;

async function replaceNotes(
  supabase: SupabaseClient<Database>,
  productId: string,
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const rows: {
    product_id: string;
    ingredient_id: string;
    note_stage: string;
    position: number;
  }[] = [];

  for (const stage of NOTE_STAGES) {
    const ids = String(formData.get(`notes_${stage}`) ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    ids.forEach((ingredientId, position) => {
      rows.push({
        product_id: productId,
        ingredient_id: ingredientId,
        note_stage: stage,
        position,
      });
    });
  }

  const { error: deleteError } = await supabase
    .from("product_ingredients")
    .delete()
    .eq("product_id", productId);
  if (deleteError) {
    console.error(`products: failed to reset notes for ${productId}: ${deleteError.message}`);
    return { ok: false, error: "Nada wewangian gagal disimpan. Silakan coba lagi." };
  }

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("product_ingredients").insert(rows);
    if (insertError) {
      console.error(`products: failed to save notes for ${productId}: ${insertError.message}`);
      return { ok: false, error: "Nada wewangian gagal disimpan. Silakan coba lagi." };
    }
  }

  return { ok: true };
}

export async function createProduct(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const parsed = productSchema.safeParse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const images = collectNewImages(formData);
  if (!images.ok) {
    return { ok: false, formError: images.error };
  }

  const supabase = await createClient();
  const { data: created, error } = await supabase
    .from("products")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return slugConflict();
    console.error(`products: failed to create: ${error.message}`);
    return { ok: false, formError: "Produk gagal dibuat. Silakan coba lagi." };
  }

  const uploaded = await uploadNewImages(supabase, created.id, images.files, 0);
  if (!uploaded.ok) {
    return { ok: false, formError: uploaded.error };
  }

  const notes = await replaceNotes(supabase, created.id, formData);
  if (!notes.ok) {
    return { ok: false, formError: notes.error };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true };
}

export async function updateProduct(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Data produk tidak ditemukan." };
  }

  const parsed = productSchema.safeParse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const images = collectNewImages(formData);
  if (!images.ok) {
    return { ok: false, formError: images.error };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("products").update(parsed.data).eq("id", id);
  if (error) {
    if (error.code === "23505") return slugConflict();
    console.error(`products: failed to update ${id}: ${error.message}`);
    return { ok: false, formError: "Produk gagal disimpan. Silakan coba lagi." };
  }

  const existingCount = Number(formData.get("existing_count") ?? 0);
  const managed = await manageExistingImages(supabase, id, formData, existingCount);
  if (!managed.ok) {
    return { ok: false, formError: managed.error };
  }

  const { data: lastImage } = await supabase
    .from("product_images")
    .select("sort_order")
    .eq("product_id", id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const startOrder = (lastImage?.sort_order ?? -1) + 1;

  const uploaded = await uploadNewImages(supabase, id, images.files, startOrder);
  if (!uploaded.ok) {
    return { ok: false, formError: uploaded.error };
  }

  const notes = await replaceNotes(supabase, id, formData);
  if (!notes.ok) {
    return { ok: false, formError: notes.error };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath("/");
  return { ok: true };
}

export async function deleteProduct(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Data produk tidak ditemukan." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error(`products: failed to archive ${id}: ${error.message}`);
    return { ok: false, formError: "Produk gagal diarsipkan. Silakan coba lagi." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true };
}
