"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { galleryItemSchema, ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, extensionFor } from "@/lib/validation/gallery";
import type { ActionResult } from "@/lib/validation/action-result";
import { moveRow } from "@/features/admin/shared/reorder";

const GALLERY_FIELDS = ["alt", "caption", "category"] as const;

function clean(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  for (const key of GALLERY_FIELDS) {
    const value = formData.get(key);
    raw[key] =
      typeof value === "string" && value.trim() === "" ? null : (value ?? null);
  }
  raw.status = String(formData.get("status") ?? "draft");
  return raw;
}

function collectImage(formData: FormData): { ok: true; file: File } | { ok: false; error: string } {
  const entry = formData.get("image");
  const file = entry instanceof File && entry.size > 0 ? entry : null;

  if (!file) {
    return { ok: false, error: "Pilih gambar untuk diunggah." };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { ok: false, error: "Hanya gambar JPEG, PNG, WebP, atau AVIF yang diizinkan." };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Ukuran setiap gambar maksimal 8 MB." };
  }

  return { ok: true, file };
}

function galleryPath(file: File): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `gallery/${year}/${month}/${crypto.randomUUID()}.${extensionFor(file.type)}`;
}

async function uploadImage(
  file: File,
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const supabase = await createClient();
  const path = galleryPath(file);
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage.from("gallery").upload(path, bytes, {
    contentType: file.type,
  });

  if (error) {
    console.error(`gallery: image upload failed: ${error.message}`);
    return { ok: false, error: "Gambar gagal diunggah. Silakan coba lagi." };
  }

  return { ok: true, path };
}

async function removeImage(path: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.storage.from("gallery").remove([path]);
  if (error) {
    console.error(`gallery: failed to remove image ${path}: ${error.message}`);
  }
}

export async function createGalleryItem(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const parsed = galleryItemSchema.safeParse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const image = collectImage(formData);
  if (!image.ok) {
    return { ok: false, formError: image.error };
  }

  const supabase = await createClient();
  const { data: rows } = await supabase.from("gallery_items").select("sort_order");
  const nextSort = (rows ?? []).reduce((max, row) => Math.max(max, row.sort_order), 0) + 1;

  const uploaded = await uploadImage(image.file);
  if (!uploaded.ok) {
    return { ok: false, formError: uploaded.error };
  }

  const { error } = await supabase
    .from("gallery_items")
    .insert({ ...parsed.data, path: uploaded.path, sort_order: nextSort });

  if (error) {
    await removeImage(uploaded.path);
    console.error(`gallery: failed to create item: ${error.message}`);
    return { ok: false, formError: "Item galeri gagal disimpan. Silakan coba lagi." };
  }

  revalidatePath("/admin/gallery");
  return { ok: true };
}

export async function updateGalleryItem(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Data item galeri tidak ditemukan." };
  }

  const parsed = galleryItemSchema.safeParse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const entry = formData.get("image");
  const replacement = entry instanceof File && entry.size > 0 ? entry : null;

  if (replacement) {
    if (!ALLOWED_IMAGE_TYPES.has(replacement.type)) {
      return { ok: false, formError: "Hanya gambar JPEG, PNG, WebP, atau AVIF yang diizinkan." };
    }
    if (replacement.size > MAX_IMAGE_BYTES) {
      return { ok: false, formError: "Ukuran setiap gambar maksimal 8 MB." };
    }
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("gallery_items")
    .select("path")
    .eq("id", id)
    .maybeSingle();

  if (!existing) {
    return { ok: false, formError: "Item galeri tidak ditemukan." };
  }

  let path = existing.path;
  if (replacement) {
    const uploaded = await uploadImage(replacement);
    if (!uploaded.ok) {
      return { ok: false, formError: uploaded.error };
    }
    path = uploaded.path;
  }

  const { error } = await supabase
    .from("gallery_items")
    .update({ ...parsed.data, path })
    .eq("id", id);

  if (error) {
    if (replacement) await removeImage(path);
    console.error(`gallery: failed to update ${id}: ${error.message}`);
    return { ok: false, formError: "Item galeri gagal disimpan. Silakan coba lagi." };
  }

  if (replacement && path !== existing.path) {
    await removeImage(existing.path);
  }

  revalidatePath("/admin/gallery");
  revalidatePath(`/admin/gallery/${id}/edit`);
  return { ok: true };
}

export async function deleteGalleryItem(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Data item galeri tidak ditemukan." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("gallery_items")
    .select("path")
    .eq("id", id)
    .maybeSingle();

  if (!existing) {
    return { ok: false, formError: "Item galeri tidak ditemukan." };
  }

  await removeImage(existing.path);

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) {
    console.error(`gallery: failed to delete ${id}: ${error.message}`);
    return { ok: false, formError: "Item galeri gagal dihapus. Silakan coba lagi." };
  }

  revalidatePath("/admin/gallery");
  return { ok: true };
}

export async function moveGalleryItem(formData: FormData): Promise<void> {
  await requireAuth();
  await moveRow(
    "gallery_items",
    String(formData.get("id") ?? ""),
    formData.get("direction") === "down" ? 1 : -1,
  );
  revalidatePath("/admin/gallery");
}
