import "server-only";

import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo/metadata";
import { getStoragePublicUrl } from "@/lib/storage";
import type { Database } from "@/lib/supabase/database.types";

export type SeoMetadata = Database["public"]["Tables"]["seo_metadata"]["Row"];

export async function listSeoMetadata(): Promise<SeoMetadata[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seo_metadata")
    .select("id, page, title, description, canonical_url, og_image_path, robots, updated_at")
    .order("page");

  if (error) {
    console.error(`seo: failed to list: ${error.message}`);
    return [];
  }

  return data ?? [];
}

export type PublicSeoMetadata = Pick<
  SeoMetadata,
  "page" | "title" | "description" | "canonical_url" | "og_image_path" | "robots"
>;

export async function getSeoMetadata(page: string): Promise<PublicSeoMetadata | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seo_metadata")
    .select("page, title, description, canonical_url, og_image_path, robots")
    .eq("page", page)
    .maybeSingle();

  if (error) {
    console.error(`seo: failed to read ${page}: ${error.message}`);
    return null;
  }

  return data;
}

const OG_IMAGE_BUCKET = "branding";

export async function buildPageMetadata({
  page,
  path,
  fallbackTitle,
  fallbackDescription,
  type = "website",
}: {
  page: string;
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
  type?: "website" | "article" | "product";
}): Promise<Metadata> {
  const seo = await getSeoMetadata(page);
  const title = seo?.title ?? fallbackTitle;
  const metadata = buildMetadata({
    title,
    description: seo?.description ?? fallbackDescription,
    path,
    ogImageUrl: seo?.og_image_path
      ? getStoragePublicUrl(OG_IMAGE_BUCKET, seo.og_image_path)
      : null,
    canonicalUrl: seo?.canonical_url,
    robots: seo?.robots,
    type,
  });

  // CMS titles sometimes already carry the brand ("Turaya — …", "Koleksi — Turaya");
  // use them as-is instead of letting the root template append a duplicate.
  if (title.includes("Turaya")) {
    metadata.title = { absolute: title };
  }

  return metadata;
}
