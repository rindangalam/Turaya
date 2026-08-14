import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-sm border border-border bg-background p-8 shadow-sm">
        <h1 className="font-display text-3xl font-medium">
          Turaya
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to the studio.</p>

        {params.error === "confirm" ? (
          <p role="alert" className="mt-4 text-sm text-destructive">
            The link is invalid or has expired.
          </p>
        ) : null}

        <div className="mt-6">
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
