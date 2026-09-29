import { defineConfig } from "@playwright/test";

// `next dev` forks a long-lived `next-server` child that Playwright's
// teardown doesn't reliably reap (confirmed in CI: the 4 tests passed in
// seconds, then the job hung for 6 hours until GitHub's own orphan-process
// cleanup finally killed a leftover `next-server`). `next start` against a
// production build doesn't fork that child, so the process tree exits
// cleanly when Playwright kills it.
//
// In CI the build already exists (the turbo build step ran first) — start it
// directly. Locally, build into a separate directory first: reusing the
// default .next could clobber a dev server another session has running
// against this same checkout.
const command = process.env.CI
  ? "pnpm exec next start --port 4310"
  : "pnpm exec next build && pnpm exec next start --port 4310";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4310",
  },
  webServer: {
    command,
    url: "http://127.0.0.1:4310",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: process.env.CI ? {} : { LAIRY_NEXT_DIST_DIR: ".next-e2e" },
  },
});
