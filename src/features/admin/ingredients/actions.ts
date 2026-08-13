"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { ingredientSchema } from "@/lib/validation/collections";
import type { ActionResult } from "@/lib/validation/action-result";
import { moveRow } from "@/features/admin/shared/reorder";

const INGREDIENT_FIELDS = ["name", "slug", "origin", "description", "story", "image_path"] as const;

function clean(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  for (const key of INGREDIENT_FIELDS) {
    const value = formData.get(key);
    raw[key] =
      typeof value === "string" && value.trim() === "" ? null : (value ?? null);
  }
  raw.status = String(formData.get("status") ?? "published");
  return raw;
}

function slugConflict(): ActionResult {
  return { ok: false, fieldErrors: { slug: ["An ingredient with this slug already exists."] } };
}

export async function createIngredient(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const parsed = ingredientSchema.safeParse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: rows } = await supabase.from("ingredients").select("sort_order");
  const nextSort = (rows ?? []).reduce((max, row) => Math.max(max, row.sort_order), 0) + 1;

  const { error } = await supabase
    .from("ingredients")
    .insert({ ...parsed.data, sort_order: nextSort });

  if (error) {
    if (error.code === "23505") return slugConflict();
    console.error(`ingredients: failed to create: ${error.message}`);
    return { ok: false, formError: "Could not create the ingredient. Please try again." };
  }

  revalidatePath("/admin/ingredients");
  return { ok: true };
}

export async function updateIngredient(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Missing ingredient record." };
  }

  const parsed = ingredientSchema.safeParse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("ingredients")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return slugConflict();
    console.error(`ingredients: failed to update ${id}: ${error.message}`);
    return { ok: false, formError: "Could not save the ingredient. Please try again." };
  }

  revalidatePath("/admin/ingredients");
  return { ok: true };
}

export async function deleteIngredient(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Missing ingredient record." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("ingredients")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error(`ingredients: failed to archive ${id}: ${error.message}`);
    return { ok: false, formError: "Could not archive the ingredient. Please try again." };
  }

  revalidatePath("/admin/ingredients");
  return { ok: true };
}

export async function moveIngredient(formData: FormData): Promise<void> {
  await requireAuth();
  await moveRow(
    "ingredients",
    String(formData.get("id") ?? ""),
    formData.get("direction") === "down" ? 1 : -1,
  );
  revalidatePath("/admin/ingredients");
}
