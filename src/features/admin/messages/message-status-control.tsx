"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { messageStatusLabel } from "@/lib/labels";
import { updateMessageStatus } from "@/features/admin/messages/actions";
import type { MessageStatus } from "@/services/messages";

const TRANSITIONS: { status: Exclude<MessageStatus, "new">; label: string }[] = [
  { status: "read", label: "Tandai dibaca" },
  { status: "replied", label: "Tandai dibalas" },
  { status: "archived", label: "Arsipkan" },
];

export function MessageStatusControl({ id, status }: { id: string; status: MessageStatus }) {
  const [state, formAction, pending] = useActionState(updateMessageStatus, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(`Pesan ditandai ${messageStatusLabel(state.data?.status ?? status)}`);
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, status]);

  return (
    <form action={formAction} className="flex flex-wrap gap-2">
      <input type="hidden" name="id" value={id} />
      {TRANSITIONS.filter((transition) => transition.status !== status).map((transition) => (
        <Button
          key={transition.status}
          type="submit"
          name="status"
          value={transition.status}
          variant="outline"
          size="sm"
          disabled={pending}
        >
          {transition.label}
        </Button>
      ))}
    </form>
  );
}
