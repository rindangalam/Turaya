import { z } from "zod";

export const settingsSchema = z.object({
  site_name: z.string().trim().min(1, "Brand name is required.").max(80),
  tagline: z.string().trim().max(160).nullable().optional(),
  contact_email: z.string().trim().email("Enter a valid email address.").max(160).nullable().optional(),
  contact_phone: z.string().trim().max(40).nullable().optional(),
  address: z.string().trim().max(500).nullable().optional(),
  instagram_url: z
    .string()
    .trim()
    .refine((value) => value === "" || /^https?:\/\/.+/i.test(value), {
      message: "Enter a full URL starting with http(s)://",
    })
    .nullable()
    .optional(),
  tiktok_url: z
    .string()
    .trim()
    .refine((value) => value === "" || /^https?:\/\/.+/i.test(value), {
      message: "Enter a full URL starting with http(s)://",
    })
    .nullable()
    .optional(),
  whatsapp_number: z.string().trim().max(40).nullable().optional(),
  announcement: z.string().trim().max(500).nullable().optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export const seoMetadataSchema = z.object({
  title: z.string().trim().max(160).nullable().optional(),
  description: z.string().trim().max(320).nullable().optional(),
  canonical_url: z
    .string()
    .trim()
    .refine((value) => value === "" || /^https?:\/\/.+/i.test(value), {
      message: "Enter a full URL starting with http(s)://",
    })
    .nullable()
    .optional(),
  og_image_path: z.string().trim().max(500).nullable().optional(),
  robots: z.string().trim().max(60).nullable().optional(),
});

export type SeoMetadataInput = z.infer<typeof seoMetadataSchema>;

export const messageStatusSchema = z.enum(["new", "read", "replied", "archived"]);
