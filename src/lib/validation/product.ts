import { z } from "zod";

import { pgUuid } from "@/lib/validation/uuid";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const PRODUCT_STATUSES = ["draft", "published", "archived"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const PRODUCT_SORTS = [
  { value: "updated_desc", label: "Recently updated" },
  { value: "updated_asc", label: "Oldest updated" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "price_desc", label: "Price high–low" },
  { value: "price_asc", label: "Price low–high" },
] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number]["value"];

export function isProductSort(value: string): value is ProductSort {
  return PRODUCT_SORTS.some((option) => option.value === value);
}

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => slugPattern.test(value), {
      message: "Use lowercase letters, numbers and hyphens (e.g. turaya-no-1).",
    }),
  tagline: z.string().trim().max(200).nullable().optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  story: z.string().trim().max(10000).nullable().optional(),
  category_id: pgUuid("Choose a category.").nullable().optional(),
  collection_id: pgUuid("Choose a collection.").nullable().optional(),
  size: z.string().trim().max(40).nullable().optional(),
  price: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine((value) => value == null || value === "" || /^\d+(\.\d{1,2})?$/.test(value), {
      message: "Enter a number with up to 2 decimals (e.g. 450000 or 450000.00).",
    })
    .transform((value) => (value == null || value === "" ? null : Number(value))),
  featured: z.boolean(),
  status: z.enum(PRODUCT_STATUSES),
  seo_title: z.string().trim().max(160).nullable().optional(),
  seo_description: z.string().trim().max(320).nullable().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
