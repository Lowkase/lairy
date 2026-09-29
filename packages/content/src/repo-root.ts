import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Walks up from this file to find the workspace root, identified by
 * `pnpm-workspace.yaml`. Robust whether this module runs from `src` (tsx,
 * tests) or `dist` (the built package) — a fixed relative `../../..` would
 * break for one of the two. Mirrors packages/mcp/src/repo-root.ts. */
function findRepoRoot(startDir: string): string {
  let dir = startDir;
  while (true) {
    if (existsSync(join(dir, "pnpm-workspace.yaml"))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error(
        `@lairy/content: couldn't find the repo root (no pnpm-workspace.yaml above ${startDir}).`,
      );
    }
    dir = parent;
  }
}

export const REPO_ROOT = findRepoRoot(dirname(fileURLToPath(import.meta.url)));
