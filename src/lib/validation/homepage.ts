import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const homepageSectionSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => slugPattern.test(value), {
      message: "Use lowercase letters, numbers and hyphens (e.g. featured-collection).",
    }),
  headline: z.string().trim().max(200).nullable().optional(),
  subheadline: z.string().trim().max(300).nullable().optional(),
  body: z.string().trim().max(1000).nullable().optional(),
  image_path: z.string().trim().max(500).nullable().optional(),
  button_label: z.string().trim().max(80).nullable().optional(),
  button_url: z
    .string()
    .trim()
    .refine((value) => value === "" || /^(\/|https?:\/\/)/i.test(value), {
      message: "Enter an internal path (e.g. /collections) or a full URL.",
    })
    .nullable()
    .optional(),
  visible: z.boolean(),
});

export type HomepageSectionInput = z.infer<typeof homepageSectionSchema>;
