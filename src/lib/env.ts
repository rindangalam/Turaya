/**
 * Environment variables — validated once per process.
 * Fails fast in dev when a required variable is missing; in production
 * throws so misconfiguration never silently reaches runtime.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    const message = `Missing required environment variable: ${name}`;
    if (process.env.NODE_ENV === "development") {
      throw new Error(`${message}. Copy .env.example to .env.local and fill in values.`);
    }
    throw new Error(message);
  }
  return value;
}

export const env = {
  /** Public — safe for the client bundle. */
  NEXT_PUBLIC_SUPABASE_URL: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  /** Server-only — never import this module from client code. */
  SUPABASE_SERVICE_ROLE_KEY: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
} as const;
