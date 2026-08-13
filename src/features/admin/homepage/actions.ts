"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { homepageSectionSchema } from "@/lib/validation/homepage";
import type { ActionResult } from "@/lib/validation/action-result";

const FIELD_KEYS = [
  "name",
  "slug",
  "headline",
  "subheadline",
  "body",
  "image_path",
  "button_label",
  "button_url",
] as const;

function clean(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  for (const key of FIELD_KEYS) {
    const value = formData.get(key);
    raw[key] =
      typeof value === "string" && value.trim() === "" ? null : (value ?? null);
  }
  raw.visible = formData.get("visible") === "on";
  return raw;
}

function parse(raw: Record<string, unknown>) {
  return homepageSectionSchema.safeParse(raw);
}

export async function createHomepageSection(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const parsed = parse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: rows } = await supabase.from("homepage_sections").select("sort_order");
  const nextSort = (rows ?? []).reduce((max, row) => Math.max(max, row.sort_order), 0) + 1;

  const { data, error } = await supabase
    .from("homepage_sections")
    .insert({ ...parsed.data, sort_order: nextSort })
    .select("id")
    .single();

  if (error || !data) {
    console.error(`homepage: failed to create section: ${error?.message ?? "no row returned"}`);
    return { ok: false, formError: "Could not create the section. Please try again." };
  }

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { ok: true };
}

export async function updateHomepageSection(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Missing section record." };
  }

  const parsed = parse(clean(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from("homepage_sections")
    .update(parsed.data)
    .eq("id", id)
    .select("id")
    .single();

  if (error || !updated) {
    console.error(`homepage: failed to update ${id}: ${error?.message ?? "no row returned"}`);
    return { ok: false, formError: "Could not save the section. Please try again." };
  }

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { ok: true };
}

export async function toggleSectionVisibility(formData: FormData): Promise<void> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    console.error("homepage: toggle called without a section id");
    return;
  }

  const supabase = await createClient();
  const { data: current } = await supabase
    .from("homepage_sections")
    .select("visible")
    .eq("id", id)
    .maybeSingle();

  if (!current) {
    console.error(`homepage: section ${id} not found for toggle`);
    return;
  }

  const { error } = await supabase
    .from("homepage_sections")
    .update({ visible: !current.visible })
    .eq("id", id);

  if (error) {
    console.error(`homepage: failed to toggle ${id}: ${error.message}`);
    return;
  }

  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function deleteHomepageSection(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, formError: "Missing section record." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("homepage_sections").delete().eq("id", id);

  if (error) {
    console.error(`homepage: failed to delete ${id}: ${error.message}`);
    return { ok: false, formError: "Could not delete the section. Please try again." };
  }

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { ok: true };
}

export async function moveHomepageSection(formData: FormData): Promise<void> {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "down" ? 1 : -1;
  if (!id) {
    console.error("homepage: move called without a section id");
    return;
  }

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("homepage_sections")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });

  const list = rows ?? [];
  const index = list.findIndex((row) => row.id === id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= list.length) {
    return;
  }

  const a = list[index];
  const b = list[target];

  const { error } = await supabase.from("homepage_sections").update({ sort_order: a.sort_order }).eq("id", b.id);
  if (error) {
    console.error(`homepage: failed to reorder: ${error.message}`);
    return;
  }
  const { error: errorB } = await supabase.from("homepage_sections").update({ sort_order: b.sort_order }).eq("id", a.id);
  if (errorB) {
    console.error(`homepage: failed to reorder: ${errorB.message}`);
    return;
  }

  revalidatePath("/admin/homepage");
  revalidatePath("/");
}
