import { execSync } from "node:child_process";

// The commit a build came from, shown in the footer as "Ver. abc123" (as BetterGov.ph does). Cloudflare Pages sets
// CF_PAGES_COMMIT_SHA; a local build asks git. No commit known: the footer leaves the version out.
function commit(): string | null {
  if (process.env.CF_PAGES_COMMIT_SHA) return process.env.CF_PAGES_COMMIT_SHA;
  try {
    return execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim() || null;
  } catch {
    return null;
  }
}

export const buildCommit = commit();
export const buildVersion = buildCommit?.slice(0, 6) ?? null;
