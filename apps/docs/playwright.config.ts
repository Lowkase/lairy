import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4310",
  },
  webServer: {
    command: "pnpm exec next dev --port 4310",
    url: "http://127.0.0.1:4310",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { LAIRY_NEXT_DIST_DIR: ".next-e2e" },
  },
});
