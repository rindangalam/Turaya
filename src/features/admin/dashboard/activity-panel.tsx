import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/empty-state";
import { getRecentActivity } from "@/services/dashboard";
import { formatRelativeTime } from "@/lib/format";
import { ActivityIcon } from "lucide-react";

const ACTION_BADGES: Record<string, { label: string; className: string }> = {
  create: { label: "Dibuat", className: "bg-emerald-50 text-emerald-700" },
  update: { label: "Diubah", className: "bg-blue-50 text-blue-700" },
  delete: { label: "Dihapus", className: "bg-red-50 text-red-700" },
  login: { label: "Masuk", className: "bg-muted text-muted-foreground" },
  logout: { label: "Keluar", className: "bg-muted text-muted-foreground" },
  role_change: { label: "Peran", className: "bg-amber-50 text-amber-700" },
};

export async function ActivityPanel() {
  const activity = await getRecentActivity(8);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas terbaru</CardTitle>
        <CardDescription>Jejak audit aksi staf.</CardDescription>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <EmptyState
            icon={<ActivityIcon className="size-6" aria-hidden="true" />}
            title="Belum ada aktivitas"
            description="Perubahan konten dan pengaturan akan tercatat di sini."
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="pb-2 font-medium">Aksi</th>
                <th scope="col" className="hidden pb-2 font-medium sm:table-cell">Pengguna</th>
                <th scope="col" className="pb-2 text-right font-medium">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activity.map((item) => {
                const badge = ACTION_BADGES[item.action] ?? {
                  label: item.action,
                  className: "bg-muted text-muted-foreground",
                };
                return (
                  <tr key={item.id}>
                    <td className="py-2.5 pr-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      <span className="ml-2 text-muted-foreground">{item.resource}</span>
                    </td>
                    <td className="hidden py-2.5 pr-2 text-muted-foreground sm:table-cell">
                      {item.actorName ?? "Sistem"}
                    </td>
                    <td className="py-2.5 text-right text-xs text-muted-foreground">
                      <time dateTime={item.createdAt} title={item.createdAt}>
                        {formatRelativeTime(item.createdAt)}
                      </time>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
