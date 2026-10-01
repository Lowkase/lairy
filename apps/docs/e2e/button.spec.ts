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

test.describe("Button dev route", () => {
  test("shows every variant with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/button");
    await expect(page.getByRole("button", { name: "Run pipeline" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Delete workspace" }).first()).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "button-dark.png");
  });

  test("shows every variant with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/button");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "button-light.png");
  });

  test("every variant is a real, keyboard-focusable button", async ({ page }) => {
    await page.goto("/dev/button");
    for (const name of ["Run pipeline", "Save", "Cancel", "Delete workspace"]) {
      const button = page.getByRole("button", { name }).first();
      await expect(button).toHaveJSProperty("tagName", "BUTTON");
      await button.focus();
      await expect(button).toBeFocused();
    }
  });

  test("a disabled button stays in the DOM and in the tab order as aria-disabled", async ({ page }) => {
    await page.goto("/dev/button");
    const disabled = page.getByRole("button", { name: "Delete workspace" }).nth(1);
    await expect(disabled).toBeVisible();
    await expect(disabled).toHaveAttribute("aria-disabled", "true");
    await expect(disabled).not.toHaveAttribute("disabled");

    await disabled.focus();
    await expect(disabled).toBeFocused();
  });
});
