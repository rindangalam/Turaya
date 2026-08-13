import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/empty-state";
import { getRecentActivity } from "@/services/dashboard";
import { formatRelativeTime } from "@/lib/format";
import { ActivityIcon } from "lucide-react";

const ACTION_LABELS: Record<string, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  login: "Signed in",
  logout: "Signed out",
  role_change: "Changed role",
};

export async function ActivityPanel() {
  const activity = await getRecentActivity(8);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Audit trail of staff actions.</CardDescription>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <EmptyState
            icon={<ActivityIcon className="size-6" aria-hidden="true" />}
            title="No activity yet"
            description="Changes to settings and content will be logged here."
          />
        ) : (
          <ol className="divide-y divide-border">
            {activity.map((item) => (
              <li key={item.id} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="min-w-0 text-sm">
                    <span className="font-medium">{ACTION_LABELS[item.action] ?? item.action}</span>{" "}
                    <span className="text-muted-foreground">{item.resource}</span>
                  </p>
                  <time
                    dateTime={item.createdAt}
                    className="shrink-0 text-xs text-muted-foreground"
                    title={item.createdAt}
                  >
                    {formatRelativeTime(item.createdAt)}
                  </time>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {item.actorName ?? "System"}
                </p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
