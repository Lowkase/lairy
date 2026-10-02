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

test.describe("Usage card dev route", () => {
  test("shows every example with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/usage-card");
    await expect(page.getByText("A condition is standing, not momentary.")).toBeVisible();
    await expect(page.getByText("Reach for amber when")).toBeVisible();
    await expect(page.getByText("The colour is informing rather than acting.")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "usage-card-dark.png");
  });

  test("shows every example with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/usage-card");
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

    await screenshot(page, "usage-card-light.png");
  });

  test("the recommended card is first in markup, ahead of the alternative (Usage card Accessibility 'Reading order matches DOM order')", async ({
    page,
  }) => {
    await page.goto("/dev/usage-card");

    const order = await page.evaluate(() => {
      const recommended = document.querySelector('[data-slot="usage-card-recommended"]');
      const alternative = document.querySelector('[data-slot="usage-card-alternative"]');
      if (!recommended || !alternative) return null;
      return Boolean(
        recommended.compareDocumentPosition(alternative) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });

    expect(order).toBe(true);
  });

  test("neither card is a control (Usage card Accessibility 'Not interactive')", async ({ page }) => {
    await page.goto("/dev/usage-card");

    const usageCards = page.locator('[data-slot="usage-card"]');
    await expect(usageCards.first().locator("button, a")).toHaveCount(0);
  });
});
