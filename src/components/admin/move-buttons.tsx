import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Up/down ordering controls for server-action sorted rows (collections,
 * categories, ingredients, homepage sections). Rendered as two standalone
 * forms so it stays a server component.
 */
export function MoveButtons({
  id,
  name,
  isFirst,
  isLast,
  action,
}: {
  id: string;
  name: string;
  isFirst: boolean;
  isLast: boolean;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <Button
          type="submit"
          variant="ghost"
          size="icon-sm"
          disabled={isFirst}
          aria-label={`Naikkan ${name}`}
        >
          <ArrowUpIcon className="size-3.5" aria-hidden="true" />
        </Button>
      </form>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <Button
          type="submit"
          variant="ghost"
          size="icon-sm"
          disabled={isLast}
          aria-label={`Turunkan ${name}`}
        >
          <ArrowDownIcon className="size-3.5" aria-hidden="true" />
        </Button>
      </form>
    </>
  );
}
