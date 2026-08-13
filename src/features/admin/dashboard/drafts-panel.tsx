import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/empty-state";
import type { ContentStat } from "@/services/dashboard";

const SECTION_HREF: Record<string, string> = {
  homepage_sections: "/admin/homepage",
  products: "/admin/products",
  collections: "/admin/collections",
  categories: "/admin/categories",
  ingredients: "/admin/ingredients",
  gallery_items: "/admin/gallery",
  journal_posts: "/admin/journal",
  testimonials: "/admin/testimonials",
  store_locations: "/admin/stores",
};

export function DraftsPanel({ stats }: { stats: ContentStat[] }) {
  const drafts = stats.filter((stat) => stat.draft > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drafts needing attention</CardTitle>
        <CardDescription>Content set to draft across your sections.</CardDescription>
      </CardHeader>
      <CardContent>
        {drafts.length === 0 ? (
          <EmptyState
            title="No drafts"
            description="Every section is either published or still empty."
          />
        ) : (
          <ul className="divide-y divide-border">
            {drafts.map((stat) => {
              const href = SECTION_HREF[stat.key];
              return (
                <li
                  key={stat.key}
                  className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <span className="text-sm font-medium">{stat.label}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {stat.draft} draft{stat.draft === 1 ? "" : "s"}
                    </span>
                    {href ? (
                      <Link
                        href={href}
                        className="text-sm text-primary underline-offset-4 hover:underline focus-visible:underline"
                      >
                        Open section
                      </Link>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
