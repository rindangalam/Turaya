import { z } from "zod";

export const MAX_CONTACT_NAME = 80;
export const MAX_CONTACT_SUBJECT = 120;
export const MAX_CONTACT_MESSAGE = 2000;

export const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(MAX_CONTACT_NAME, `Nama maksimal ${MAX_CONTACT_NAME} karakter.`),
  email: z.string().trim().email("Alamat email tidak valid.").max(160),
  subject: z
    .string()
    .trim()
    .max(MAX_CONTACT_SUBJECT, `Subjek maksimal ${MAX_CONTACT_SUBJECT} karakter.`)
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, "Pesan minimal 10 karakter.")
    .max(MAX_CONTACT_MESSAGE, `Pesan maksimal ${MAX_CONTACT_MESSAGE} karakter.`),
  website: z.string().optional(),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
