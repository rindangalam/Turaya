/**
 * Build-time route isolation for the two-deployment setup.
 *
 * Reads NEXT_PUBLIC_APP_TARGET (default "public") and temporarily moves the
 * route folders belonging to the *other* app out of src/app before running
 * `next build`, then restores them afterwards (matters for local builds;
 * Vercel always uses a fresh checkout).
 *
 *   public — excludes admin, login, update-password, auth
 *   admin  — excludes the (public) route group + public-only metadata routes
 *
 * When adding new route folders, extend the lists below.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, renameSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import process from "node:process";

const APP_DIR = join(process.cwd(), "src", "app");

const TARGETS = {
  public: {
    app: "public",
    move: [
      join(APP_DIR, "admin"),
      join(APP_DIR, "login"),
      join(APP_DIR, "update-password"),
      join(APP_DIR, "auth"),
    ],
  },
  admin: {
    app: "admin",
    move: [
      join(APP_DIR, "(public)"),
      join(APP_DIR, "robots.ts"),
      join(APP_DIR, "sitemap.ts"),
      join(APP_DIR, "api", "og"),
    ],
  },
};

function log(message) {
  console.log(`[build-target] ${message}`);
}

function movePath(source, staging) {
  if (!existsSync(source)) {
    log(`skip (not found): ${relative(process.cwd(), source)}`);
    return;
  }
  const dest = join(staging, relative(APP_DIR, source));
  mkdirSync(join(dest, ".."), { recursive: true });
  renameSync(source, dest);
  log(`moved out: ${relative(process.cwd(), source)}`);
}

function restorePath(source, staging) {
  const staged = join(staging, relative(APP_DIR, source));
  if (!existsSync(staged)) return;
  renameSync(staged, source);
  log(`restored: ${relative(process.cwd(), source)}`);
}

async function main() {
  const target = TARGETS[process.env.NEXT_PUBLIC_APP_TARGET] ?? TARGETS.public;
  log(`building target: ${target.app}`);

  // Stale-state guard: if any route to move is already missing, a previous
  // run may have been interrupted and moved it out. Abort rather than
  // silently building the wrong app.
  const missing = target.move.filter((source) => !existsSync(source));
  if (missing.length > 0) {
    throw new Error(
      `expected route(s) missing: ${missing
        .map((p) => relative(process.cwd(), p))
        .join(", ")}. ` +
        "A previous build may have been interrupted. Restore these files or run `npm run dev` first.",
    );
  }

  const staging = mkdtempSync(join(tmpdir(), "turaya-isolate-"));

  try {
    for (const source of target.move) {
      movePath(source, staging);
    }

    // Clear the incremental cache: stale route types in .next would still
    // reference the moved-out pages and fail the type-check stage. A clean
    // .next also guarantees the two targets never contaminate each other.
    rmSync(join(process.cwd(), ".next"), { recursive: true, force: true });

    const nextBin = join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
    const result = spawnSync(process.execPath, [nextBin, "build"], {
      stdio: "inherit",
      env: process.env,
    });

    if (result.error) throw result.error;
    process.exitCode = result.status ?? 1;
  } finally {
    for (const source of target.move) {
      restorePath(source, staging);
    }
    rmSync(staging, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(`[build-target] ERROR: ${error.message}`);
  process.exitCode = 1;
});
