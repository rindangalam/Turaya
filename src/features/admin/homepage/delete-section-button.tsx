"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteHomepageSection } from "@/features/admin/homepage/actions";

export function DeleteSectionButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(deleteHomepageSection, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success("Section deleted");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
    if (state) {
      window.setTimeout(() => setConfirming(false), 0);
    }
  }, [state]);

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setConfirming(true)}
        aria-label="Delete section"
      >
        <Trash2Icon className="size-3.5" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <form action={formAction} className="flex items-center gap-1">
      <input type="hidden" name="id" value={id} />
      <Button type="button" variant="outline" size="xs" onClick={() => setConfirming(false)} disabled={pending}>
        Cancel
      </Button>
      <Button type="submit" variant="destructive" size="xs" disabled={pending}>
        {pending ? "Deleting…" : "Confirm delete"}
      </Button>
    </form>
  );
}
