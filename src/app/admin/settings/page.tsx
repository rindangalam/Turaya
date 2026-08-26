import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/features/admin/settings/settings-form";
import { getSiteSettings } from "@/services/settings";

export const metadata: Metadata = { title: "Pengaturan" };

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pengaturan"
        description="Identitas merek, kontak, dan tautan sosial yang tampil di seluruh situs publik."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
