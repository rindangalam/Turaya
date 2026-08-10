"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { updatePassword, type AuthFormState } from "@/features/auth/actions";

export function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    updatePassword,
    undefined,
  );

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="h-9 rounded-sm border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {state?.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="mt-1">
        {pending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
