import { z } from "zod";

import { CONTENT_STATUSES } from "@/lib/validation/collections";

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

export const galleryItemSchema = z.object({
  alt: z.string().trim().min(1, "Teks alt wajib diisi.").max(500),
  caption: z.string().trim().max(1000).nullable().optional(),
  category: z.string().trim().max(80).nullable().optional(),
  status: z.enum(CONTENT_STATUSES),
});

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
