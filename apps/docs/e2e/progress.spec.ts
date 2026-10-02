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

test.describe("Progress dev route", () => {
  test("shows every variant with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/progress");
    await expect(page.getByText("Exporting runs")).toBeVisible();
    await expect(page.getByText("132 / 214")).toBeVisible();
    await expect(page.getByText("Storage quota")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "progress-dark.png");
  });

  test("shows every variant with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/progress");
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

    await screenshot(page, "progress-light.png");
  });

  test("the bar carries aria-valuenow/min/max (Progress Accessibility 'Progressbar with values')", async ({
    page,
  }) => {
    await page.goto("/dev/progress");
    const bar = page.locator('[data-slot="progress"][data-variant="bar"]').locator('[role="progressbar"]');
    await expect(bar).toHaveAttribute("aria-valuemin", "0");
    await expect(bar).toHaveAttribute("aria-valuemax", "214");
    await expect(bar).toHaveAttribute("aria-valuenow", "132");
  });

  test("steps render as a progressbar reporting the filled stage count", async ({ page }) => {
    await page.goto("/dev/progress");
    const steps = page.locator('[data-slot="progress"][data-variant="steps"]').locator('[role="progressbar"]');
    await expect(steps).toHaveAttribute("aria-valuemax", "4");
    await expect(steps).toHaveAttribute("aria-valuenow", "2");
    await expect(page.locator('[data-slot="progress-segment"]')).toHaveCount(4);
  });

  test("the meter is a meter, not a progressbar (Progress Accessibility 'Progressbar with values')", async ({
    page,
  }) => {
    await page.goto("/dev/progress");
    const meterRegion = page.locator('[data-slot="progress"][data-variant="meter"]');
    await expect(meterRegion.locator('[role="meter"]')).toHaveAttribute("aria-valuenow", "74");
    await expect(meterRegion.locator('[role="progressbar"]')).toHaveCount(0);
  });
});
