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

test.describe("Text dev route", () => {
  test("shows every role with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/text");
    await expect(page.getByText("PIPELINE / RUN 4182")).toBeVisible();
    await expect(page.getByText("Everything nominal")).toBeVisible();
    await expect(page.getByText("Last checked 2m ago")).toBeVisible();
    await expect(page.getByText("DEPLOY / BUILD 912")).toBeVisible();
    await expect(page.getByText("Build succeeded")).toBeVisible();
    await expect(page.getByText("All checks passed before the deploy began.")).toBeVisible();
    await expect(page.getByText("Finished 40s ago")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "text-dark.png");
  });

  test("shows every role with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/text");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "text-light.png");
  });

  test("every role renders as a real text node, not an image or icon standing in for it", async ({ page }) => {
    await page.goto("/dev/text");
    for (const text of ["PIPELINE / RUN 4182", "Everything nominal", "214 runs · 0 failures", "Last checked 2m ago"]) {
      await expect(page.locator('[data-slot="text"]').filter({ hasText: text }).first()).toHaveJSProperty(
        "tagName",
        "SPAN",
      );
    }
  });
});
