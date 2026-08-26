import type { Metadata } from "next";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, LayoutTemplateIcon, PencilIcon, PlusIcon } from "lucide-react";

import { requireAuth } from "@/lib/auth/guards";
import { MoveButtons } from "@/components/admin/move-buttons";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { SortableList } from "@/components/admin/sortable-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  moveHomepageSection,
  reorderHomepageSections,
  toggleSectionVisibility,
} from "@/features/admin/homepage/actions";
import { DeleteSectionButton } from "@/features/admin/homepage/delete-section-button";
import { listSections } from "@/services/homepage";
import type { HomepageSection } from "@/services/homepage";

export const metadata: Metadata = { title: "Bagian beranda" };

export default async function HomepagePage() {
  await requireAuth();
  const sections = await listSections();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bagian beranda"
        description="Urutan dan visibilitas menentukan apa yang dirender beranda publik."
      >
        <Button size="sm" render={<Link href="/admin/homepage/new" />}>
          <PlusIcon aria-hidden="true" />
          Bagian baru
        </Button>
      </PageHeader>

      {sections.length === 0 ? (
        <EmptyState
          icon={<LayoutTemplateIcon className="size-6" aria-hidden="true" />}
          title="Belum ada bagian"
          description="Buat bagian beranda pertama untuk menyusun halaman."
          action={
            <Button size="sm" render={<Link href="/admin/homepage/new" />}>
              <PlusIcon aria-hidden="true" />
              Bagian baru
            </Button>
          }
        />
      ) : (
        <SortableList ids={sections.map((item) => item.id)} action={reorderHomepageSections}>
          {sections.map((section, index) => (
            <SectionRow
              key={section.id}
              section={section}
              isFirst={index === 0}
              isLast={index === sections.length - 1}
            />
          ))}
        </SortableList>
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
              {section.visible ? "Tampil" : "Tersembunyi"}
            </Badge>
          </p>
          <p className="truncate text-xs text-muted-foreground">
            <span className="font-mono">{section.slug}</span>
            {section.headline ? ` · ${section.headline}` : ""}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <MoveButtons
          id={section.id}
          name={section.name}
          isFirst={isFirst}
          isLast={isLast}
          action={moveHomepageSection}
        />
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
