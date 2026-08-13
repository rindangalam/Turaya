import { z } from "zod";

const PG_UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export function pgUuid(message: string) {
  return z.string().trim().refine((value) => PG_UUID.test(value), { message });
}
