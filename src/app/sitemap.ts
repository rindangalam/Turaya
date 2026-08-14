import type { MetadataRoute } from "next";

import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  "",
  "/products",
  "/collections",
  "/ingredients",
  "/gallery",
  "/journal",
  "/contact",
  "/about",
  "/philosophy",
  "/stores",
  "/faq",
  "/privacy",
  "/terms",
] as const;

type IndexableRow = { slug: string; updated_at: string | null };

async function fetchSlugs(table: string): Promise<IndexableRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table as "products" | "collections" | "journal_posts")
    .select("slug, updated_at")
    .eq("status", "published")
    .is("deleted_at", null);

  if (error) {
    console.error(`sitemap: failed to fetch ${table}: ${error.message}`);
    return [];
  }

  return (data ?? []) as IndexableRow[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const [products, collections, posts] = await Promise.all([
    fetchSlugs("products"),
    fetchSlugs("collections"),
    fetchSlugs("journal_posts"),
  ]);

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  for (const product of products) {
    entries.push({
      url: `${base}/products/${product.slug}`,
      lastModified: product.updated_at ?? undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const collection of collections) {
    entries.push({
      url: `${base}/collections/${collection.slug}`,
      lastModified: collection.updated_at ?? undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const post of posts) {
    entries.push({
      url: `${base}/journal/${post.slug}`,
      lastModified: post.updated_at ?? undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
