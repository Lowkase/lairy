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

test.describe("Empty state dev route", () => {
  test("shows every kind with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/empty-state");
    await expect(page.getByText("No runs in this window")).toBeVisible();
    await expect(page.getByRole("button", { name: "Schedule a run" })).toBeVisible();
    await expect(page.getByText("No runs match FAILED")).toBeVisible();
    await expect(page.getByRole("button", { name: "Clear filter" })).toBeVisible();
    await expect(page.getByText("Not visible to you")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "empty-state-dark.png");
  });

  test("shows every kind with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/empty-state");
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

    await screenshot(page, "empty-state-light.png");
  });

  test("the mark is hidden from assistive tech (Empty state Accessibility 'Decorative mark')", async ({
    page,
  }) => {
    await page.goto("/dev/empty-state");
    const region = page.locator('[data-slot="empty-state"][data-kind="first-run"]');
    const mark = region.locator("svg");
    await expect(mark).toHaveAttribute("aria-hidden", "true");
  });

  test("restricted offers no action (Empty state Content rule 5)", async ({ page }) => {
    await page.goto("/dev/empty-state");
    const region = page.locator('[data-slot="empty-state"][data-kind="restricted"]');
    await expect(region.getByRole("button")).toHaveCount(0);
  });

  test("is a polite live region, not an alert (Empty state Accessibility 'Not an alert')", async ({
    page,
  }) => {
    await page.goto("/dev/empty-state");
    const region = page.locator('[data-slot="empty-state"][data-kind="first-run"]');
    await expect(region).toHaveAttribute("aria-live", "polite");
    await expect(region).not.toHaveAttribute("role", "alert");
  });
});
