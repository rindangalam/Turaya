import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { getContentStats, getWeeklyActivity } from "@/services/dashboard";
import { StatCard } from "@/features/admin/dashboard/stat-card";
import { ActivityChart } from "@/features/admin/dashboard/activity-chart";
import { DraftsPanel } from "@/features/admin/dashboard/drafts-panel";
import { ActivityPanel } from "@/features/admin/dashboard/activity-panel";
import { RecentMessagesPanel } from "@/features/admin/dashboard/recent-messages-panel";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireAuth();
  const [stats, weeklyActivity] = await Promise.all([
    getContentStats(),
    getWeeklyActivity(),
  ]);

  const isAdmin = user.role === "admin" || user.role === "super_admin";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Selamat datang kembali, ${user.displayName ?? "Staff"}`}
        description="Ringkasan singkat kondisi situs Turaya hari ini."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.key} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ActivityChart data={weeklyActivity} />
        {isAdmin ? <ActivityPanel /> : <RecentMessagesPanel />}
      </div>

      <DraftsPanel stats={stats} />
    </div>
  );
}
