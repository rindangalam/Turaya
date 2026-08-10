import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type: type as "recovery",
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}/update-password?next=${encodeURIComponent(next)}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirm`);
}
