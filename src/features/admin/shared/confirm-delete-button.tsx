"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/validation/action-result";

export function ConfirmDeleteButton({
  id,
  name,
  action,
  successMessage,
}: {
  id: string;
  name: string;
  action: (prev: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
  successMessage: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(successMessage);
    } else if (state?.formError) {
      toast.error(state.formError);
    }
    if (state) {
      window.setTimeout(() => setConfirming(false), 0);
    }
  }, [state, successMessage]);

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${name}`}
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
        {pending ? "Deleting…" : "Confirm"}
      </Button>
    </form>
  );
}
