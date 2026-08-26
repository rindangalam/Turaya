import { WrenchIcon } from "lucide-react";

import { EmptyState } from "@/components/admin/empty-state";
import { PageHeader } from "@/components/admin/page-header";

export function SectionStub({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={title}
        description={description ?? "Bagian ini sedang dalam pengembangan."}
      />
      <EmptyState
        icon={<WrenchIcon className="size-6" />}
        title="Segera hadir"
        description="Tooling admin untuk bagian ini akan hadir pada sprint CMS khusus."
      />
    </div>
  );
}
