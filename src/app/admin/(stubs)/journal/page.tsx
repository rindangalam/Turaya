import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { SectionStub } from "@/components/admin/section-stub";

export const metadata: Metadata = { title: "Journal" };

export default async function JournalPage() {
  await requireAuth();
  return <SectionStub title="Journal" />;
}
