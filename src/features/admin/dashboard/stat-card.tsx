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

function Chip({
  tone,
  children,
}: {
  tone: "positive" | "warning" | "neutral";
  children: React.ReactNode;
}) {
  const tones = {
    positive: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    neutral: "bg-muted text-muted-foreground",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium leading-4 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Dot({ tone }: { tone: "positive" | "warning" | "neutral" }) {
  const tones = {
    positive: "bg-emerald-500",
    warning: "bg-amber-500",
    neutral: "bg-neutral-400",
  } as const;

  return <span aria-hidden className={`size-1.5 rounded-full ${tones[tone]}`} />;
}

export function StatCard({ stat }: { stat: ContentStat }) {
  const meta = SECTION_META[stat.key];
  const Icon = meta?.icon;

  const liveCount = stat.countVisible ? stat.visible : stat.published;
  const hasLive = liveCount > 0;

  const body = (
    <Card className="relative h-full transition-all group-hover:-translate-y-0.5 group-hover:bg-muted/40 group-hover:ring-foreground/20">
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-0.5 bg-primary opacity-0 transition-opacity group-hover:opacity-100"
      />
      <CardHeader className="flex-row items-start justify-between space-y-0 gap-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {stat.label}
        </CardTitle>
        {Icon ? (
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-background"
          >
            <Icon className="size-3.5 text-muted-foreground" />
          </span>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums tracking-tight">{stat.total}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {stat.countVisible ? (
            <Chip tone={hasLive ? "positive" : "neutral"}>
              <Dot tone={hasLive ? "positive" : "neutral"} />
              {liveCount} tayang
            </Chip>
          ) : (
            <Chip tone={hasLive ? "positive" : "neutral"}>
              <Dot tone={hasLive ? "positive" : "neutral"} />
              {liveCount} terbit
            </Chip>
          )}
          {stat.draft > 0 ? (
            <Chip tone="warning">
              <Dot tone="warning" />
              {stat.draft} draf
            </Chip>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );

  if (!meta?.href) return body;

  return (
    <Link
      href={meta.href}
      aria-label={`${stat.label}: ${stat.total} konten`}
      className="group focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {body}
    </Link>
  );
}
