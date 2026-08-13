"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/features/admin/products/actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(deleteProduct, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success("Product archived");
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
        aria-label={`Archive ${name}`}
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
        {pending ? "Archiving…" : "Confirm"}
      </Button>
    </form>
  );
}
