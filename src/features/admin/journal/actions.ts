"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";

import { requireAuth } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { journalPostSchema } from "@/lib/validation/journal";
import type { ActionResult } from "@/lib/validation/action-result";
import type { Database } from "@/lib/supabase/database.types";
import { slugify } from "@/lib/utils";

const JOURNAL_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "body",
  "category_id",
  "seo_title",
  "seo_description",
] as const;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function clean(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  for (const key of JOURNAL_FIELDS) {
    const value = formData.get(key);
    raw[key] = typeof value === "string" && value.trim() === "" ? null : (value ?? null);
  }
  raw.status = String(formData.get("status") ?? "draft");
  return raw;
}

function slugConflict(): ActionResult {
  return { ok: false, fieldErrors: { slug: ["Sudah ada Artikel dengan slug ini."] } };
}

function collectCover(formData: FormData): { ok: true; file: File } | { ok: true; file: null } | { ok: false; error: string } {
  const entry = formData.get("cover_image");
  const file = entry instanceof File && entry.size > 0 ? entry : null;

  if (!file) {
    return { ok: true, file: null };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { ok: false, error: "Hanya gambar JPEG, PNG, WebP, atau AVIF yang diizinkan." };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Ukuran gambar sampul maksimal 8 MB." };
  }

  return { ok: true, file };
}

function coverPath(file: File): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/avif" ? "avif" : "jpg";
  return `journal/${year}/${month}/${crypto.randomUUID()}.${ext}`;
}

async function uploadCover(
  file: File,
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const supabase = await createClient();
  const path = coverPath(file);
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage.from("journal").upload(path, bytes, {
    contentType: file.type,
  });

  if (error) {
    console.error(`journal: cover upload failed: ${error.message}`);
    return { ok: false, error: "Gambar sampul gagal diunggah. Silakan coba lagi." };
  }

  return { ok: true, path };
}

async function removeCover(path: string | null): Promise<void> {
  if (!path) return;
  const supabase = await createClient();
  const { error } = await supabase.storage.from("journal").remove([path]);
  if (error) {
    console.error(`journal: failed to remove cover ${path}: ${error.message}`);
  }
}

async function resolveCategoryId(
  supabase: SupabaseClient<Database>,
  formData: FormData,
): Promise<{ ok: true; id: string | null } | { ok: false; error: string }> {
  const selected = String(formData.get("category_id") ?? "").trim();
  const newName = String(formData.get("new_category") ?? "").trim();

  if (newName) {
    const slug = slugify(newName);
    const { data: created, error } = await supabase
      .from("journal_categories")
      .insert({ name: newName, slug })
      .select("id")
      .maybeSingle();

    if (error && error.code !== "23505") {
      console.error(`journal: failed to create category: ${error.message}`);
      return { ok: false, error: "Kategori gagal dibuat. Silakan coba lagi." };
    }

    const id = created?.id;
    if (!id) {
      const { data: existing } = await supabase
        .from("journal_categories")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (existing) {
        return { ok: true, id: existing.id };
      }
      return { ok: false, error: "Kategori gagal dibuat. Silakan coba lagi." };
    }

    return { ok: true, id };
  }

  return { ok: true, id: selected || null };
}

async function resolveTagIds(
  supabase: SupabaseClient<Database>,
  formData: FormData,
): Promise<{ ok: true; ids: string[] } | { ok: false; error: string }> {
  const selected = String(formData.get("tags") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const newNames = String(formData.get("new_tags") ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  const ids = [...selected];

  for (const name of newNames) {
    const slug = slugify(name);
    const { data: created, error } = await supabase
      .from("journal_tags")
      .insert({ name, slug })
      .select("id")
      .maybeSingle();

    if (error && error.code !== "23505") {
      console.error(`journal: failed to create tag: ${error.message}`);
      return { ok: false, error: "Satu atau lebih tag gagal dibuat. Silakan coba lagi." };
    }

    if (created?.id) {
      ids.push(created.id);
      continue;
    }

    const { data: existing } = await supabase
      .from("journal_tags")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) {
      ids.push(existing.id);
    }
  }

  return { ok: true, ids };
}

async function replacePostTags(
  supabase: SupabaseClient<Database>,
  postId: string,
  tagIds: string[],
): Promise<boolean> {
  const { error: deleteError } = await supabase.from("post_tags").delete().eq("post_id", postId);
  if (deleteError) {
    console.error(`journal: failed to reset tags for ${postId}: ${deleteError.message}`);
    return false;
  }

  if (tagIds.length > 0) {
    const { error: insertError } = await supabase
      .from("post_tags")
      .insert(tagIds.map((tag_id) => ({ post_id: postId, tag_id })));
    if (insertError) {
      console.error(`journal: failed to save tags for ${postId}: ${insertError.message}`);
      return false;
    }
  }

  return true;
}

export async function createJournalPost(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireAuth();

  const parsed = journalPostSchema.safeParse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const cover = collectCover(formData);
  if (!cover.ok) {
    return { ok: false, formError: cover.error };
  }

  const supabase = await createClient();

  const category = await resolveCategoryId(supabase, formData);
  if (!category.ok) {
    return { ok: false, formError: category.error };
  }

  const tags = await resolveTagIds(supabase, formData);
  if (!tags.ok) {
    return { ok: false, formError: tags.error };
  }

  let coverImagePath: string | null = null;
  if (cover.file) {
    const uploaded = await uploadCover(cover.file);
    if (!uploaded.ok) {
      return { ok: false, formError: uploaded.error };
    }
    coverImagePath = uploaded.path;
  }

  const publishedAt = parsed.data.status === "published" ? new Date().toISOString() : null;

  const { data: created, error } = await supabase
    .from("journal_posts")
    .insert({
      ...parsed.data,
      author_id: user.id,
      category_id: category.id,
      cover_image_path: coverImagePath,
      published_at: publishedAt,
    })
    .select("id")
    .single();

  if (error) {
    if (coverImagePath) await removeCover(coverImagePath);
    if (error.code === "23505") return slugConflict();
    console.error(`journal: failed to create post: ${error.message}`);
    return { ok: false, formError: "Artikel gagal dibuat. Silakan coba lagi." };
  }

  const tagsSaved = await replacePostTags(supabase, created.id, tags.ids);
  if (!tagsSaved) {
    return { ok: false, formError: "Artikel tersimpan tetapi tag gagal dilampirkan. Silakan coba lagi." };
  }

  revalidatePath("/admin/journal");
  return { ok: true };
}

export async function updateJournalPost(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Data artikel tidak ditemukan." };
  }

  const parsed = journalPostSchema.safeParse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const cover = collectCover(formData);
  if (!cover.ok) {
    return { ok: false, formError: cover.error };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("journal_posts")
    .select("cover_image_path, published_at")
    .eq("id", id)
    .maybeSingle();

  if (!existing) {
    return { ok: false, formError: "Artikel tidak ditemukan." };
  }

  const category = await resolveCategoryId(supabase, formData);
  if (!category.ok) {
    return { ok: false, formError: category.error };
  }

  const tags = await resolveTagIds(supabase, formData);
  if (!tags.ok) {
    return { ok: false, formError: tags.error };
  }

  let coverImagePath = existing.cover_image_path;
  if (cover.file) {
    const uploaded = await uploadCover(cover.file);
    if (!uploaded.ok) {
      return { ok: false, formError: uploaded.error };
    }
    coverImagePath = uploaded.path;
  }

  const publishedAt =
    parsed.data.status === "published" && existing.published_at == null
      ? new Date().toISOString()
      : existing.published_at;

  const { error } = await supabase
    .from("journal_posts")
    .update({
      ...parsed.data,
      category_id: category.id,
      cover_image_path: coverImagePath,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (error) {
    if (cover.file && coverImagePath !== existing.cover_image_path) {
      await removeCover(coverImagePath);
    }
    if (error.code === "23505") return slugConflict();
    console.error(`journal: failed to update ${id}: ${error.message}`);
    return { ok: false, formError: "Artikel gagal disimpan. Silakan coba lagi." };
  }

  if (cover.file && coverImagePath !== existing.cover_image_path) {
    await removeCover(existing.cover_image_path);
  }

  const tagsSaved = await replacePostTags(supabase, id, tags.ids);
  if (!tagsSaved) {
    return { ok: false, formError: "Artikel tersimpan tetapi tag gagal dilampirkan. Silakan coba lagi." };
  }

  revalidatePath("/admin/journal");
  revalidatePath(`/admin/journal/${id}/edit`);
  return { ok: true };
}

export async function deleteJournalPost(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Data artikel tidak ditemukan." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("journal_posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error(`journal: failed to archive ${id}: ${error.message}`);
    return { ok: false, formError: "Artikel gagal diarsipkan. Silakan coba lagi." };
  }

  revalidatePath("/admin/journal");
  return { ok: true };
}
