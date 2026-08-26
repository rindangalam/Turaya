import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { SectionStub } from "@/components/admin/section-stub";

export const metadata: Metadata = { title: "Testimoni" };

export default async function TestimonialsPage() {
  await requireAuth();
  return <SectionStub title="Testimoni" />;
}
