import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function StatCard({ stat }: { stat: ContentStat }) {
  const href = SECTION_HREF[stat.key];

  const summary = stat.countVisible
    ? `${stat.visible} visible · ${stat.total - stat.visible} hidden`
    : `${stat.published} published · ${stat.draft} draft · ${stat.archived} archived`;

  const card = (
    <Card className="h-full transition-colors hover:bg-muted/30">
      <CardHeader>
        <CardTitle>{stat.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums">{stat.total}</p>
        <p className="mt-1 text-xs text-muted-foreground">{summary}</p>
      </CardContent>
    </Card>
  );

  if (!href) return card;

  return (
    <Link
      href={href}
      className="focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {card}
    </Link>
  );
}
