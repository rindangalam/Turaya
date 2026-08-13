"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/validation/collections";
import type { ActionResult } from "@/lib/validation/action-result";
import { moveRow } from "@/features/admin/shared/reorder";

const CATEGORY_FIELDS = ["name", "slug", "description"] as const;

function clean(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  for (const key of CATEGORY_FIELDS) {
    const value = formData.get(key);
    raw[key] =
      typeof value === "string" && value.trim() === "" ? null : (value ?? null);
  }
  raw.status = String(formData.get("status") ?? "published");
  return raw;
}

function slugConflict(): ActionResult {
  return { ok: false, fieldErrors: { slug: ["A category with this slug already exists."] } };
}

export async function createCategory(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const parsed = categorySchema.safeParse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: rows } = await supabase.from("categories").select("sort_order");
  const nextSort = (rows ?? []).reduce((max, row) => Math.max(max, row.sort_order), 0) + 1;

  const { error } = await supabase
    .from("categories")
    .insert({ ...parsed.data, sort_order: nextSort });

  if (error) {
    if (error.code === "23505") return slugConflict();
    console.error(`categories: failed to create: ${error.message}`);
    return { ok: false, formError: "Could not create the category. Please try again." };
  }

  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function updateCategory(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Missing category record." };
  }

  const parsed = categorySchema.safeParse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return slugConflict();
    console.error(`categories: failed to update ${id}: ${error.message}`);
    return { ok: false, formError: "Could not save the category. Please try again." };
  }

  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function deleteCategory(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Missing category record." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error(`categories: failed to archive ${id}: ${error.message}`);
    return { ok: false, formError: "Could not archive the category. Please try again." };
  }

  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function moveCategory(formData: FormData): Promise<void> {
  await requireAuth();
  await moveRow(
    "categories",
    String(formData.get("id") ?? ""),
    formData.get("direction") === "down" ? 1 : -1,
  );
  revalidatePath("/admin/categories");
}
