import "server-only";

import { createClient } from "@/lib/supabase/server";

export type ContentStat = {
  key: string;
  label: string;
  total: number;
  published: number;
  draft: number;
  archived: number;
  visible: number;
  countVisible: boolean;
};

type TableMeta = {
  key: string;
  label: string;
  countVisible?: boolean;
};

const CONTENT_TABLES: TableMeta[] = [
  { key: "products", label: "Products" },
  { key: "collections", label: "Collections" },
  { key: "categories", label: "Categories" },
  { key: "ingredients", label: "Ingredients" },
  { key: "gallery_items", label: "Gallery" },
  { key: "journal_posts", label: "Journal" },
  { key: "testimonials", label: "Testimonials" },
  { key: "faq_items", label: "FAQ" },
  { key: "store_locations", label: "Stores" },
  { key: "homepage_sections", label: "Homepage sections", countVisible: true },
];

type StatusRow = { status: string };

async function readStatusRows(key: string): Promise<StatusRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(key as "products").select("status");
  if (error) {
    console.error(`dashboard: failed to read ${key}: ${error.message}`);
    return [];
  }
  return (data ?? []) as StatusRow[];
}

async function readVisibleRows(): Promise<boolean[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("homepage_sections").select("visible");
  if (error) {
    console.error(`dashboard: failed to read homepage_sections: ${error.message}`);
    return [];
  }
  return (data ?? []).map((row) => row.visible);
}

export async function getContentStats(): Promise<ContentStat[]> {
  const stats: ContentStat[] = [];

  for (const table of CONTENT_TABLES) {
    if (table.countVisible) {
      const visible = await readVisibleRows();
      stats.push({
        key: table.key,
        label: table.label,
        total: visible.length,
        published: 0,
        draft: 0,
        archived: 0,
        visible: visible.filter(Boolean).length,
        countVisible: true,
      });
      continue;
    }

    const rows = await readStatusRows(table.key);
    stats.push({
      key: table.key,
      label: table.label,
      total: rows.length,
      published: rows.filter((row) => row.status === "published").length,
      draft: rows.filter((row) => row.status === "draft").length,
      archived: rows.filter((row) => row.status === "archived").length,
      visible: 0,
      countVisible: false,
    });
  }

  return stats;
}

export type ActivityItem = {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  createdAt: string;
  actorName: string | null;
};

export type DailyActivity = { date: string; label: string; count: number };

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

/** Audit-log events per day over the last 7 days (real data, no sampling). */
export async function getWeeklyActivity(): Promise<DailyActivity[]> {
  const supabase = await createClient();

  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - 6);

  const { data, error } = await supabase
    .from("audit_logs")
    .select("created_at")
    .gte("created_at", since.toISOString());

  if (error) {
    console.error(`dashboard: failed to read weekly audit_logs: ${error.message}`);
  }

  const indexByDate = new Map<string, number>();
  const days: DailyActivity[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    indexByDate.set(key, days.length);
    days.push({ date: key, label: DAY_LABELS[day.getDay()], count: 0 });
  }

  for (const row of data ?? []) {
    const index = indexByDate.get(String(row.created_at).slice(0, 10));
    if (index !== undefined) days[index].count += 1;
  }

  return days;
}

export async function getRecentActivity(limit = 10): Promise<ActivityItem[]> {
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("audit_logs")
    .select("id, action, resource, resource_id, actor_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`dashboard: failed to read audit_logs: ${error.message}`);
    return [];
  }

  const actorIds = [
    ...new Set(rows.map((row) => row.actor_id).filter((id): id is string => id !== null)),
  ];
  const actors = new Map<string, string | null>();

  if (actorIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", actorIds);

    for (const profile of profiles ?? []) {
      actors.set(profile.id, profile.display_name);
    }
  }

  return (rows ?? []).map((row) => ({
    id: row.id,
    action: row.action,
    resource: row.resource,
    resourceId: row.resource_id,
    createdAt: row.created_at,
    actorName: row.actor_id ? actors.get(row.actor_id) ?? null : null,
  }));
}
