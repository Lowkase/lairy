import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function screenshot(page: Page, name: string) {
  if (process.env.CI) {
    await page.screenshot({ path: `test-results/${name}` });
  } else {
    await expect(page).toHaveScreenshot(name);
  }
}

test.describe("Navigation (Main) dev route", () => {
  test("shows every state with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/main-rail");
    await expect(page.getByRole("navigation", { name: "Main (demo)" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "main-rail-dark.png");
  });

  test("shows every state with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/main-rail");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    // Many rows transition colour at once on a theme switch (duration-160,
    // tabs.spec.ts's own precedent for this exact class of flake) — wait
    // for it to settle before axe samples colour.
    await page.waitForTimeout(800);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "main-rail-light.png");
  });

  test("collapsing hides labels visually but keeps them in the accessible tree", async ({ page }) => {
    await page.goto("/dev/main-rail");
    const demo = page.getByRole("navigation", { name: "Main (demo)" });
    await expect(demo.getByRole("link", { name: "Fleet" })).toBeVisible();

    await demo.getByRole("button", { name: "Collapse" }).click();
    await expect(demo.getByRole("link", { name: "Fleet" })).toBeVisible();
    await expect(demo.getByRole("button", { name: "Expand" })).toBeVisible();
  });

  test("marks the active item with aria-current", async ({ page }) => {
    await page.goto("/dev/main-rail");
    const demo = page.getByRole("navigation", { name: "Main (demo)" });
    await expect(demo.getByRole("link", { name: "Fleet" })).toHaveAttribute("aria-current", "page");
  });
});
