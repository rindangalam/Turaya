import { createClient } from "@/lib/supabase/server";

type SortableTable =
  | "homepage_sections"
  | "collections"
  | "categories"
  | "ingredients"
  | "gallery_items"
  | "testimonials"
  | "store_locations"
  | "faq_items";

export async function moveRow(
  table: SortableTable,
  id: string,
  direction: -1 | 1,
): Promise<void> {
  if (!id) {
    console.error(`${table}: move called without an id`);
    return;
  }

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from(table as "collections")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });

  const list = rows ?? [];
  const index = list.findIndex((row) => row.id === id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= list.length) return;

  const a = list[index];
  const b = list[target];

  const { error } = await supabase
    .from(table as "collections")
    .update({ sort_order: a.sort_order })
    .eq("id", b.id);
  if (error) {
    console.error(`${table}: failed to reorder: ${error.message}`);
    return;
  }

  const { error: errorB } = await supabase
    .from(table as "collections")
    .update({ sort_order: b.sort_order })
    .eq("id", a.id);
  if (errorB) {
    console.error(`${table}: failed to reorder: ${errorB.message}`);
  }
}
