"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateMessageStatus } from "@/features/admin/messages/actions";
import type { MessageStatus } from "@/services/messages";

const TRANSITIONS: { status: Exclude<MessageStatus, "new">; label: string }[] = [
  { status: "read", label: "Mark as read" },
  { status: "replied", label: "Mark as replied" },
  { status: "archived", label: "Archive" },
];

export function MessageStatusControl({ id, status }: { id: string; status: MessageStatus }) {
  const [state, formAction, pending] = useActionState(updateMessageStatus, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(`Message ${state.data?.status}`);
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state]);

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
