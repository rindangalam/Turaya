import Link from "next/link";
import {
  BookOpenIcon,
  BoxIcon,
  ImagesIcon,
  LayoutTemplateIcon,
  LayersIcon,
  LeafIcon,
  MapPinIcon,
  QuoteIcon,
  TagIcon,
} from "lucide-react";
import type { ComponentType } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContentStat } from "@/services/dashboard";

const SECTION_META: Record<string, { href: string; icon: ComponentType<{ className?: string }> }> = {
  homepage_sections: { href: "/admin/homepage", icon: LayoutTemplateIcon },
  products: { href: "/admin/products", icon: BoxIcon },
  collections: { href: "/admin/collections", icon: LayersIcon },
  categories: { href: "/admin/categories", icon: TagIcon },
  ingredients: { href: "/admin/ingredients", icon: LeafIcon },
  gallery_items: { href: "/admin/gallery", icon: ImagesIcon },
  journal_posts: { href: "/admin/journal", icon: BookOpenIcon },
  testimonials: { href: "/admin/testimonials", icon: QuoteIcon },
  store_locations: { href: "/admin/stores", icon: MapPinIcon },
};

export function StatCard({ stat }: { stat: ContentStat }) {
  const meta = SECTION_META[stat.key];
  const Icon = meta?.icon;

  const summary = stat.countVisible
    ? `${stat.visible} visible · ${stat.total - stat.visible} hidden`
    : `${stat.published} published · ${stat.draft} draft · ${stat.archived} archived`;

  const card = (
    <Card className="h-full transition-colors hover:bg-muted/30">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {stat.label}
        </CardTitle>
        {Icon ? (
          <span aria-hidden className="flex size-8 items-center justify-center rounded-full bg-muted">
            <Icon className="size-4 text-muted-foreground" />
          </span>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums tracking-tight">{stat.total}</p>
        <p className="mt-1.5 text-xs text-muted-foreground">{summary}</p>
      </CardContent>
    </Card>
  );

  if (!meta?.href) return card;

  return (
    <Link
      href={meta.href}
      className="focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {card}
    </Link>
  );
}
