import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth/guards";
import { SectionStub } from "@/components/admin/section-stub";

export const metadata: Metadata = { title: "Users", robots: { index: false, follow: false } };

export default async function UsersPage() {
  await requireAdmin();
  return <SectionStub title="Users" description="Staff management is admin-only." />;
}
