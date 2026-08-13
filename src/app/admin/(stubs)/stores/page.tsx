import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { SectionStub } from "@/components/admin/section-stub";

export const metadata: Metadata = { title: "Stores" };

export default async function StoresPage() {
  await requireAuth();
  return <SectionStub title="Stores" />;
}
