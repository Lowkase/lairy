import { defineConfig } from "@playwright/test";

// Playwright's own webServer management leaks a process in CI: Next forks a
// next-server child that escapes the process group Playwright signals on
// teardown. Confirmed with both next dev and next start — the 4 tests pass
// in ~2s, then the step hangs until something else (GitHub's 6-hour job
// timeout, or the step timeout that replaced it) kills the orphan. CI now
// starts and stops the server itself (.github/workflows/ci.yml) and this
// config only ever reuses it there. Locally, no such hang was observed, so
// Playwright still manages its own server — building into a separate
// directory first so it doesn't clobber a dev server another session has
// running against this same checkout.
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
    reuseExistingServer: true,
    timeout: 120_000,
    env: process.env.CI ? {} : { LAIRY_NEXT_DIST_DIR: ".next-e2e" },
  },
});
