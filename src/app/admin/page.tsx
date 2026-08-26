import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLinkIcon, FilePenIcon, ImagesIcon, PlusIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getSiteUrl } from "@/lib/seo/site";
import { getContentStats, getWeeklyActivity } from "@/services/dashboard";
import { StatCard } from "@/features/admin/dashboard/stat-card";
import { ActivityChart } from "@/features/admin/dashboard/activity-chart";
import { DraftsPanel } from "@/features/admin/dashboard/drafts-panel";
import { ActivityPanel } from "@/features/admin/dashboard/activity-panel";
import { RecentMessagesPanel } from "@/features/admin/dashboard/recent-messages-panel";

export const metadata: Metadata = { title: "Dashboard" };

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function DashboardPage() {
  const user = await requireAuth();
  const [stats, weeklyActivity] = await Promise.all([
    getContentStats(),
    getWeeklyActivity(),
  ]);

  const isAdmin = user.role === "admin" || user.role === "super_admin";
  const today = dateFormatter.format(new Date());

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title={`Selamat datang kembali, ${user.displayName ?? "Staff"}`}
        description={`${today} — ringkasan kondisi situs Turaya hari ini.`}
      >
        <Button size="sm" variant="outline" render={<Link href="/admin/gallery/new" />}>
          <ImagesIcon aria-hidden="true" />
          Unggah galeri
        </Button>
        <Button size="sm" variant="outline" render={<Link href="/admin/journal/new" />}>
          <FilePenIcon aria-hidden="true" />
          Tulis jurnal
        </Button>
        <Button size="sm" render={<Link href="/admin/products/new" />}>
          <PlusIcon aria-hidden="true" />
          Produk baru
        </Button>
        <Button
          size="sm"
          variant="ghost"
          render={<Link href={getSiteUrl()} target="_blank" rel="noopener noreferrer" />}
          aria-label="Buka situs publik di tab baru"
        >
          <ExternalLinkIcon aria-hidden="true" />
        </Button>
      </PageHeader>

      <section aria-label="Ringkasan konten">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
          {stats.map((stat) => (
            <StatCard key={stat.key} stat={stat} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ActivityChart data={weeklyActivity} />
        {isAdmin ? <ActivityPanel /> : <RecentMessagesPanel />}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DraftsPanel stats={stats} className={isAdmin ? "lg:col-span-2" : "lg:col-span-3"} />
        {isAdmin ? <RecentMessagesPanel /> : null}
      </div>
    </div>
  );
}
