import "server-only";

/**
 * App-level login rate limiting: exponential backoff per email+IP.
 *
 * NOTE: this is an in-process guard (single server instance). Supabase
 * Auth's own protections remain the primary defense; this guard adds
 * backoff UX + audit damping. Deploy-time, prefer a shared store
 * (Redis/Upstash) if the app runs multiple instances.
 */

type Attempt = { failures: number; blockedUntil: number };

const attempts = new Map<string, Attempt>();

const BASE_DELAY_MS = 1_000;
const MAX_DELAY_MS = 5 * 60 * 1_000;

function keyFor(email: string, ip: string | null) {
  return `${email.toLowerCase()}|${ip ?? "unknown"}`;
}

export function loginRateLimit(email: string, ip: string | null) {
  const now = Date.now();
  const key = keyFor(email, ip);
  const current = attempts.get(key);

  if (current && current.blockedUntil > now) {
    const retryInSec = Math.ceil((current.blockedUntil - now) / 1000);
    return { allowed: false as const, retryInSec };
  }

  return { allowed: true as const, retryInSec: 0 };
}

export function recordLoginFailure(email: string, ip: string | null) {
  const now = Date.now();
  const key = keyFor(email, ip);
  const current = attempts.get(key);
  const failures = (current?.failures ?? 0) + 1;

  // Exponential backoff: 1s, 2s, 4s, ... capped at 5 minutes.
  const delay = Math.min(BASE_DELAY_MS * 2 ** (failures - 1), MAX_DELAY_MS);

  attempts.set(key, { failures, blockedUntil: now + delay });

  // Keep the map bounded.
  if (attempts.size > 10_000) {
    for (const [k, v] of attempts) {
      if (v.blockedUntil < now) attempts.delete(k);
    }
  }
}

export function clearLoginFailures(email: string, ip: string | null) {
  attempts.delete(keyFor(email, ip));
}
