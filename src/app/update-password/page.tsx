import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import { UpdatePasswordForm } from "@/features/auth/update-password-form";

export const metadata: Metadata = {
  title: "Update password",
};

export default async function UpdatePasswordPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-sm border border-border bg-background p-8 shadow-sm">
        <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-medium">
          Update password
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose a new password.</p>

        <div className="mt-6">
          <UpdatePasswordForm />
        </div>
      </div>
    </main>
  );
}
