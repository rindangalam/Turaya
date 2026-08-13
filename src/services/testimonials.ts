import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

export type PublicTestimonial = Pick<Testimonial, "id" | "quote" | "author" | "title">;

export async function listPublishedTestimonials(): Promise<PublicTestimonial[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, quote, author, title")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`testimonials: failed to list published: ${error.message}`);
    return [];
  }

  return data ?? [];
}
