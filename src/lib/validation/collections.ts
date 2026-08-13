import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const CONTENT_STATUSES = ["draft", "published", "archived"] as const;

export const collectionSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => slugPattern.test(value), {
      message: "Use lowercase letters, numbers and hyphens (e.g. koleksi-pertama).",
    }),
  description: z.string().trim().max(2000).nullable().optional(),
  story: z.string().trim().max(10000).nullable().optional(),
  cover_image_path: z.string().trim().max(500).nullable().optional(),
  featured: z.boolean(),
  status: z.enum(CONTENT_STATUSES),
  seo_title: z.string().trim().max(160).nullable().optional(),
  seo_description: z.string().trim().max(320).nullable().optional(),
});

export type CollectionInput = z.infer<typeof collectionSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => slugPattern.test(value), {
      message: "Use lowercase letters, numbers and hyphens (e.g. eau-de-parfum).",
    }),
  description: z.string().trim().max(1000).nullable().optional(),
  status: z.enum(CONTENT_STATUSES),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const ingredientSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => slugPattern.test(value), {
      message: "Use lowercase letters, numbers and hyphens (e.g. kayu-cendana).",
    }),
  origin: z.string().trim().max(200).nullable().optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  story: z.string().trim().max(10000).nullable().optional(),
  image_path: z.string().trim().max(500).nullable().optional(),
  status: z.enum(CONTENT_STATUSES),
});

export type IngredientInput = z.infer<typeof ingredientSchema>;
