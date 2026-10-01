import { expect, test } from "@playwright/test";

// This suite always runs against a production build (playwright.config.ts:
// `next build && next start`), so these two checks are the real enforcement
// of the ticket's "excluded from production builds" acceptance criterion
// (LDS-016) — not just a manual spot-check. The route's actual UI (baseline
// vs. live, the theme/view toggles, opacity) only exists in `next dev` by
// design and is verified there by hand per docs/build-guide.md §2.
test.describe("Compare route (dev-only, LDS-016)", () => {
  test("the compare page 404s in a production build", async ({ page }) => {
    const response = await page.goto("/dev/compare/callout");
    expect(response?.status()).toBe(404);
  });

  test("the screenshot handler 404s in a production build", async ({ request }) => {
    const response = await request.get("/dev/compare/screenshot/callout/dark");
    expect(response.status()).toBe(404);
  });
});
