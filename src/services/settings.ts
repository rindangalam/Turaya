import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "id, site_name, tagline, logo_path, contact_email, contact_phone, address, instagram_url, tiktok_url, whatsapp_number, announcement, updated_at",
    )
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(`settings: failed to read: ${error.message}`);
    return null;
  }

  return data;
}
