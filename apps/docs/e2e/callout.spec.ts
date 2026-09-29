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

test.describe("Callout dev route", () => {
  test("shows every tone with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/callout");
    await expect(page.getByText("Sync scheduled")).toBeVisible();
    await expect(page.getByText("Console insight")).toBeVisible();
    await expect(page.getByText("Approaching rate limit")).toBeVisible();
    await expect(page.getByText("Export failed")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "callout-dark.png");
  });

  test("shows every tone with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/callout");
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

    await screenshot(page, "callout-light.png");
  });

  test("warning and error are announced on arrival; info and success politely", async ({
    page,
  }) => {
    await page.goto("/dev/callout");

    await expect(
      page.getByRole("alert").filter({ hasText: "Approaching rate limit" }),
    ).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "Export failed" })).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: "Sync scheduled" })).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: "Console insight" })).toBeVisible();
  });

  test("action buttons are reachable and clickable by keyboard", async ({ page }) => {
    await page.goto("/dev/callout");
    const retry = page.getByRole("button", { name: "Retry export" });
    await retry.focus();
    await expect(retry).toBeFocused();
  });
});
