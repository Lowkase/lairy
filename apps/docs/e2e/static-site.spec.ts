import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

// LDS-159: the docs site is fully static, so a Vercel deploy needs no repo
// files at request time (serverless functions only get traced files).

test.describe("Static site", () => {
  test("every docs route is prerendered at build, none on demand", () => {
    const dist = process.env.LAIRY_NEXT_DIST_DIR ?? ".next";
    const manifest = JSON.parse(readFileSync(join(process.cwd(), dist, "prerender-manifest.json"), "utf8")) as {
      routes: Record<string, unknown>;
    };
    const prerendered = Object.keys(manifest.routes);
    for (const route of [
      "/",
      "/components",
      "/components/callout",
      "/foundations/color",
      "/llms.txt",
      "/llms-full.txt",
      "/registry.json",
      "/r/callout.json",
    ]) {
      expect(prerendered, `${route} is rendered on demand`).toContain(route);
    }
  });

  test("?theme= still picks the theme, applied on the client", async ({ page }) => {
    await page.goto("/components/callout?theme=light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.goto("/foundations/color?theme=dark");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", "light");
  });

  test("the Overview registry command carries the site's own origin after load", async ({ page, baseURL }) => {
    await page.goto("/");
    await expect(page.getByText(`npx shadcn@latest add ${baseURL}/r/callout.json`)).toBeVisible();
  });

  test("the generated files serve as static content with the right types", async ({ request }) => {
    const registry = await request.get("/registry.json");
    expect(registry.status()).toBe(200);
    expect(registry.headers()["content-type"]).toContain("application/json");
    const llms = await request.get("/llms.txt");
    expect(llms.headers()["content-type"]).toContain("text/plain");
  });
});
