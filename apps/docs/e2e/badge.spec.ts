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

test.describe("Badge dev route", () => {
  test("shows every tone with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/badge");
    await expect(page.getByText("SYS")).toBeVisible();
    await expect(page.getByText("SYNCED")).toBeVisible();
    await expect(page.getByText("LIVE")).toBeVisible();
    await expect(page.getByText("FAILED")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "badge-dark.png");
  });

  test("shows every tone with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/badge");
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

    await screenshot(page, "badge-light.png");
  });

  test("renders as plain text, not an interactive element (Badge Accessibility 'Not focusable')", async ({
    page,
  }) => {
    await page.goto("/dev/badge");
    const badge = page.locator('[data-slot="badge"]').filter({ hasText: "LIVE" });
    await expect(badge).toHaveJSProperty("tagName", "SPAN");
    await expect(badge).not.toHaveAttribute("tabindex");
    await expect(badge).not.toHaveAttribute("role");
  });
});
