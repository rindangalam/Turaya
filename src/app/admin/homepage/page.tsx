import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownIcon, ArrowUpIcon, EyeIcon, EyeOffIcon, LayoutTemplateIcon, PencilIcon, PlusIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  moveHomepageSection,
  toggleSectionVisibility,
} from "@/features/admin/homepage/actions";
import { DeleteSectionButton } from "@/features/admin/homepage/delete-section-button";
import { listSections } from "@/services/homepage";
import type { HomepageSection } from "@/services/homepage";

export const metadata: Metadata = { title: "Homepage" };

export default async function HomepagePage() {
  await requireAuth();
  const sections = await listSections();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Homepage sections"
        description="Order and visibility control what the public homepage renders."
      >
        <Button size="sm" render={<Link href="/admin/homepage/new" />}>
          <PlusIcon aria-hidden="true" />
          New section
        </Button>
      </PageHeader>

      {sections.length === 0 ? (
        <EmptyState
          icon={<LayoutTemplateIcon className="size-6" aria-hidden="true" />}
          title="No sections yet"
          description="Create your first homepage section to start composing the page."
          action={
            <Button size="sm" render={<Link href="/admin/homepage/new" />}>
              <PlusIcon aria-hidden="true" />
              New section
            </Button>
          }
        />
      ) : (
        <ol className="flex flex-col gap-3">
          {sections.map((section, index) => (
            <li key={section.id}>
              <SectionRow
                section={section}
                isFirst={index === 0}
                isLast={index === sections.length - 1}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function SectionRow({
  section,
  isFirst,
  isLast,
}: {
  section: HomepageSection;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="w-6 shrink-0 text-center text-sm tabular-nums text-muted-foreground">
          {section.sort_order}
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
            <span className="truncate">{section.name}</span>
            <Badge variant={section.visible ? "default" : "secondary"}>
              {section.visible ? "visible" : "hidden"}
            </Badge>
          </p>
          <p className="truncate text-xs text-muted-foreground">
            <span className="font-mono">{section.slug}</span>
            {section.headline ? ` · ${section.headline}` : ""}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <form action={moveHomepageSection}>
          <input type="hidden" name="id" value={section.id} />
          <input type="hidden" name="direction" value="up" />
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            disabled={isFirst}
            aria-label={`Move ${section.name} up`}
          >
            <ArrowUpIcon className="size-3.5" aria-hidden="true" />
          </Button>
        </form>
        <form action={moveHomepageSection}>
          <input type="hidden" name="id" value={section.id} />
          <input type="hidden" name="direction" value="down" />
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            disabled={isLast}
            aria-label={`Move ${section.name} down`}
          >
            <ArrowDownIcon className="size-3.5" aria-hidden="true" />
          </Button>
        </form>
        <form action={toggleSectionVisibility}>
          <input type="hidden" name="id" value={section.id} />
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            aria-label={section.visible ? `Hide ${section.name}` : `Show ${section.name}`}
          >
            {section.visible ? (
              <EyeIcon className="size-3.5" aria-hidden="true" />
            ) : (
              <EyeOffIcon className="size-3.5" aria-hidden="true" />
            )}
          </Button>
        </form>
        <Button
          variant="ghost"
          size="icon-sm"
          render={<Link href={`/admin/homepage/${section.id}/edit`} />}
          aria-label={`Edit ${section.name}`}
        >
          <PencilIcon className="size-3.5" aria-hidden="true" />
        </Button>
        <DeleteSectionButton id={section.id} />
      </div>
    </div>
  );
}
