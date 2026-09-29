import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

// Plain golden-file comparison rather than Playwright's toMatchSnapshot:
// these routes render server-side text with no browser involved, so unlike
// the callout screenshots (per-OS font rendering, see callout.spec.ts) a
// single baseline holds on every platform, including CI's Linux runner —
// no `-darwin` snapshot to keep in sync with a `-linux` one it never gets.
const SNAPSHOTS_DIR = join(import.meta.dirname, "__snapshots__");

function readSnapshot(name: string): string {
  return readFileSync(join(SNAPSHOTS_DIR, name), "utf8");
}

test.describe("llms.txt / llms-full.txt", () => {
  test("llms.txt is an index of every published entry", async ({ request }) => {
    const response = await request.get("/llms.txt");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");

    const body = await response.text();
    expect(body).toBe(readSnapshot("llms.txt"));
  });

  test("llms-full.txt renders every published entry in full", async ({ request }) => {
    const response = await request.get("/llms-full.txt");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");

    const body = await response.text();
    expect(body).toBe(readSnapshot("llms-full.txt"));
  });
});
