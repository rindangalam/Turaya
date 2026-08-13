import { z } from "zod";

import { CONTENT_STATUSES } from "@/lib/validation/collections";
import { pgUuid } from "@/lib/validation/uuid";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function extensionFor(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/avif") return "avif";
  return "jpg";
}

export const journalPostSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => slugPattern.test(value), {
      message: "Use lowercase letters, numbers and hyphens (e.g. selamat-datang).",
    }),
  excerpt: z.string().trim().max(500).nullable().optional(),
  body: z.string().trim().min(1, "Body is required."),
  category_id: pgUuid("Choose a category.").nullable().optional(),
  status: z.enum(CONTENT_STATUSES),
  seo_title: z.string().trim().max(160).nullable().optional(),
  seo_description: z.string().trim().max(320).nullable().optional(),
});

export type JournalPostInput = z.infer<typeof journalPostSchema>;

export const journalCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => slugPattern.test(value), {
      message: "Use lowercase letters, numbers and hyphens (e.g. cerita).",
    }),
});

export const journalTagSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(50),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => slugPattern.test(value), {
      message: "Use lowercase letters, numbers and hyphens (e.g. bahan-lokal).",
    }),
});
