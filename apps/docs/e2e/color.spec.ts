import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Pixel baselines are per-OS; ours were captured on macOS. Compare locally,
// where the baseline matches, and just capture (no diff) in CI, which runs on
// Linux — asserting there would fail on font rendering, not a real
// regression. CI should move to a container matching the baseline OS
// (mcr.microsoft.com/playwright) before this can diff safely everywhere.
async function screenshot(page: Page, name: string) {
  if (process.env.CI) {
    await page.screenshot({ path: `test-results/${name}` });
  } else {
    await expect(page).toHaveScreenshot(name);
  }
}

test.describe("Color foundation page", () => {
  test("renders every section with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/foundations/color");
    await expect(page.getByRole("heading", { name: "Color", level: 1 })).toBeVisible();
    await expect(page.getByText("Colour in this system is a rank, not a palette.")).toBeVisible();
    await expect(page.getByText("Act. Primary buttons, focus rings")).toBeVisible();
    await expect(page.getByText("Refer. A second data series")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "color-dark.png");
  });

  test("renders every section with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/foundations/color");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "color-light.png");
  });

  test("relationship cards link to stable foundations and stay plain text for drafts", async ({
    page,
  }) => {
    await page.goto("/foundations/color");
    // Typography, Elevation and Accessibility are draft stubs (LDS-014) —
    // no docs page exists for them yet, so their Related cards must not
    // link anywhere.
    await expect(page.getByRole("link", { name: /Typography/ })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Elevation/ })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Accessibility/ })).toHaveCount(0);
    await expect(page.getByText("Holds the rules colour has to satisfy")).toBeVisible();
  });

  test("a foundation with draft status 404s", async ({ page }) => {
    const response = await page.goto("/foundations/typography");
    expect(response?.status()).toBe(404);
  });
});
