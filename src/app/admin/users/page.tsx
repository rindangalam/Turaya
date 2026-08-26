import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth/guards";
import { SectionStub } from "@/components/admin/section-stub";

export const metadata: Metadata = { title: "Pengguna", robots: { index: false, follow: false } };

export default async function UsersPage() {
  await requireAdmin();
  return <SectionStub title="Pengguna" description="Manajemen staf khusus admin." />;
}
