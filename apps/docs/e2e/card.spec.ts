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

test.describe("Card dev route", () => {
  test("shows every kind with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/card");
    await expect(page.getByText("Grouped controls and prose with no title of their own.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Coverage" })).toBeVisible();
    await expect(page.getByText("Live telemetry only.")).toBeVisible();
    await expect(page.getByText("Open items")).toBeVisible();
    await expect(page.getByRole("button", { name: /Interactive tile/ })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "card-dark.png");
  });

  test("shows every kind with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/card");
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

    await screenshot(page, "card-light.png");
  });

  test("a With header card's title is a real heading in the reading order (Cards Accessibility 'Headings, not styling')", async ({
    page,
  }) => {
    await page.goto("/dev/card");
    const heading = page.getByRole("heading", { name: "Coverage" });
    await expect(heading).toHaveJSProperty("tagName", "H3");
  });

  test("a Tile is a single real button with no nested tab stops (Cards Accessibility 'Tiles are one control')", async ({
    page,
  }) => {
    await page.goto("/dev/card");
    const tile = page.getByRole("button", { name: /Interactive tile/ });
    await expect(tile).toHaveJSProperty("tagName", "BUTTON");

    const nestedButtons = tile.locator("button");
    await expect(nestedButtons).toHaveCount(0);

    const tabIndex = await tile.getAttribute("tabindex");
    expect(tabIndex === null || Number(tabIndex) <= 0).toBe(true);
  });
});
