import { expect, test } from "@playwright/test";

// LDS-157: the rail's links are full page loads, so its collapsed state has
// to be remembered, not held in React state alone.

const COLLAPSED = 56; // --shell-rail-width-collapsed
const EXPANDED = 216; // --shell-rail-width

async function railWidth(page: import("@playwright/test").Page) {
  return (await page.locator('[data-slot="main-rail"]').boundingBox())?.width;
}

test.use({ viewport: { width: 1153, height: 856 } });

test.describe("Main rail remembers its state", () => {
  test("a collapsed rail stays collapsed across a section change and a subnav page", async ({ page }) => {
    await page.goto("/foundations/color");
    expect(await railWidth(page)).toBe(EXPANDED);

    await page.getByRole("button", { name: /collapse/i }).click();
    await expect.poll(() => railWidth(page)).toBe(COLLAPSED);

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Components" }).click();
    await expect(page).toHaveURL(/\/components\//);
    await expect.poll(() => railWidth(page)).toBe(COLLAPSED);

    await page.getByRole("navigation", { name: "Components" }).getByRole("link", { name: "Callout" }).click();
    await expect(page).toHaveURL(/\/components\/callout/);
    await expect.poll(() => railWidth(page)).toBe(COLLAPSED);

    await page.goto("/");
    await expect.poll(() => railWidth(page)).toBe(COLLAPSED);
  });

  test("an expanded rail stays expanded, and expanding again is remembered", async ({ page }) => {
    await page.goto("/components/callout");
    await page.getByRole("button", { name: /collapse/i }).click();
    await expect.poll(() => railWidth(page)).toBe(COLLAPSED);
    await page.reload();
    await expect.poll(() => railWidth(page)).toBe(COLLAPSED);

    await page.getByRole("button", { name: /^expand/i }).click();
    await expect.poll(() => railWidth(page)).toBe(EXPANDED);
    await page.goto("/foundations/color");
    await expect.poll(() => railWidth(page)).toBe(EXPANDED);
  });

  test("with storage blocked the toggle still works and nothing throws", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("blocked");
        },
      });
    });
    await page.goto("/");
    expect(await railWidth(page)).toBe(EXPANDED);
    await page.getByRole("button", { name: /collapse/i }).click();
    await expect.poll(() => railWidth(page)).toBe(COLLAPSED);
    expect(errors).toEqual([]);
  });
});
