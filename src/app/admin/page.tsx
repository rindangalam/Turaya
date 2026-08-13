import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { getContentStats } from "@/services/dashboard";
import { StatCard } from "@/features/admin/dashboard/stat-card";
import { DraftsPanel } from "@/features/admin/dashboard/drafts-panel";
import { ActivityPanel } from "@/features/admin/dashboard/activity-panel";
import { RecentMessagesPanel } from "@/features/admin/dashboard/recent-messages-panel";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireAuth();
  const stats = await getContentStats();

  const isAdmin = user.role === "admin" || user.role === "super_admin";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back. Here is what is live on the site right now.`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.key} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DraftsPanel stats={stats} />
        {isAdmin ? <ActivityPanel /> : <RecentMessagesPanel />}
      </div>
    </div>
  );
}
