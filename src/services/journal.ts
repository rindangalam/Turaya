import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type JournalPost = Database["public"]["Tables"]["journal_posts"]["Row"];
export type JournalCategory = Database["public"]["Tables"]["journal_categories"]["Row"];
export type JournalTag = Database["public"]["Tables"]["journal_tags"]["Row"];

export type JournalPostListItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
  excerpt: string | null;
  coverImagePath: string | null;
  publishedAt: string | null;
  updatedAt: string;
  categoryName: string | null;
  tagNames: string[];
};

export type JournalListOptions = {
  q?: string;
  status?: string;
  categoryId?: string;
};

export async function listJournalPosts(
  options: JournalListOptions = {},
): Promise<JournalPostListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("journal_posts")
    .select(
      "id, title, slug, status, excerpt, cover_image_path, published_at, updated_at, journal_categories(name), post_tags(journal_tags(name))",
    )
    .is("deleted_at", null);

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }

  if (options.q) {
    const like = `%${options.q}%`;
    query = query.or(`title.ilike.${like},slug.ilike.${like},excerpt.ilike.${like}`);
  }

  const { data, error } = await query.order("updated_at", { ascending: false });

  if (error) {
    console.error(`journal: failed to list posts: ${error.message}`);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: row.status,
    excerpt: row.excerpt,
    coverImagePath: row.cover_image_path,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    categoryName: row.journal_categories?.name ?? null,
    tagNames: (row.post_tags ?? [])
      .map((entry) => entry.journal_tags?.name)
      .filter((name): name is string => name != null),
  }));
}

export async function getJournalPost(id: string): Promise<JournalPost | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error(`journal: failed to get ${id}: ${error.message}`);
    return null;
  }

  return data;
}

export async function getPostTags(postId: string): Promise<JournalTag[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("post_tags")
    .select("tag_id, journal_tags(id, name, slug)")
    .eq("post_id", postId)
    .order("tag_id", { ascending: true });

  if (error) {
    console.error(`journal: failed to get tags for ${postId}: ${error.message}`);
    return [];
  }

  return (data ?? [])
    .map((row) => row.journal_tags)
    .filter((tag): tag is JournalTag => tag != null);
}

export async function listJournalCategories(): Promise<JournalCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("journal_categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error(`journal: failed to list categories: ${error.message}`);
    return [];
  }

  return data ?? [];
}

export async function listJournalTags(): Promise<JournalTag[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("journal_tags")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error(`journal: failed to list tags: ${error.message}`);
    return [];
  }

  return data ?? [];
}

export type PublicJournalPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  coverImagePath: string | null;
  publishedAt: string | null;
  categoryName: string | null;
  tagNames: string[];
};

export async function listPublishedPosts(): Promise<PublicJournalPost[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("journal_posts")
    .select(
      "id, title, slug, excerpt, body, cover_image_path, published_at, journal_categories(name), post_tags(journal_tags(name))",
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  if (error) {
    console.error(`journal: failed to list published posts: ${error.message}`);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    coverImagePath: row.cover_image_path,
    publishedAt: row.published_at,
    categoryName: row.journal_categories?.name ?? null,
    tagNames: (row.post_tags ?? [])
      .map((entry) => entry.journal_tags?.name)
      .filter((name): name is string => name != null),
  }));
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<PublicJournalPost | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("journal_posts")
    .select(
      "id, title, slug, excerpt, body, cover_image_path, published_at, journal_categories(name), post_tags(journal_tags(name))",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error(`journal: failed to get published ${slug}: ${error.message}`);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    body: data.body,
    coverImagePath: data.cover_image_path,
    publishedAt: data.published_at,
    categoryName: data.journal_categories?.name ?? null,
    tagNames: (data.post_tags ?? [])
      .map((entry) => entry.journal_tags?.name)
      .filter((name): name is string => name != null),
  };
}
