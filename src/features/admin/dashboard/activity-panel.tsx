import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/empty-state";
import { getRecentActivity } from "@/services/dashboard";
import { formatRelativeTime } from "@/lib/format";
import { ActivityIcon } from "lucide-react";

const ACTION_META: Record<string, { label: string; className: string }> = {
  create: { label: "Dibuat", className: "bg-emerald-50 text-emerald-700" },
  update: { label: "Diubah", className: "bg-blue-50 text-blue-700" },
  delete: { label: "Dihapus", className: "bg-red-50 text-red-700" },
  login: { label: "Masuk", className: "bg-muted text-muted-foreground" },
  logout: { label: "Keluar", className: "bg-muted text-muted-foreground" },
  login_failed: { label: "Gagal masuk", className: "bg-red-50 text-red-700" },
  role_change: { label: "Peran", className: "bg-amber-50 text-amber-700" },
};

const RESOURCE_LABELS: Record<string, string> = {
  auth: "Autentikasi",
  products: "Produk",
  collections: "Koleksi",
  categories: "Kategori",
  ingredients: "Bahan",
  gallery_items: "Galeri",
  journal_posts: "Jurnal",
  testimonials: "Testimoni",
  store_locations: "Toko",
  homepage_sections: "Beranda",
  site_settings: "Pengaturan situs",
  profiles: "Pengguna",
  messages: "Pesan",
};

/** "profiles.create" → "create", "role_change" → "role_change" */
function baseAction(action: string): string {
  return action.includes(".") ? action.split(".").pop() ?? action : action;
}

export async function ActivityPanel() {
  const activity = await getRecentActivity(6);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Aktivitas terbaru</CardTitle>
        <CardDescription>Jejak audit aksi staf.</CardDescription>
        <CardAction>
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
            {activity.length}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <EmptyState
            icon={<ActivityIcon className="size-6" aria-hidden="true" />}
            title="Belum ada aktivitas"
            description="Perubahan konten dan pengaturan akan tercatat di sini."
          />
        ) : (
          <ul className="flex flex-col">
            {activity.map((item) => {
              const badge = ACTION_META[baseAction(item.action)] ?? {
                label: baseAction(item.action),
                className: "bg-muted text-muted-foreground",
              };
              const resource = RESOURCE_LABELS[item.resource] ?? item.resource;

              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 border-b border-border/70 py-2.5 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm">
                      <span
                        className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      <span className="truncate font-medium">{resource}</span>
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {item.actorName ?? "Sistem"}
                    </p>
                  </div>
                  <time
                    dateTime={item.createdAt}
                    title={item.createdAt}
                    className="shrink-0 text-xs tabular-nums text-muted-foreground"
                  >
                    {formatRelativeTime(item.createdAt)}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
