import { WrenchIcon } from "lucide-react";

import { EmptyState } from "@/components/admin/empty-state";
import { PageHeader } from "@/components/admin/page-header";

export function SectionStub({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={title}
        description={description ?? "This section is under construction."}
      />
      <EmptyState
        icon={<WrenchIcon className="size-6" />}
        title="Coming in an upcoming sprint"
        description="The admin tooling for this section ships with its dedicated CMS sprint."
      />
    </div>
  );
}
