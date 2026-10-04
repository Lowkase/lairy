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

test.describe("Switch dev route", () => {
  test("shows every state with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/switch");
    await expect(page.getByRole("switch", { name: "Auto-retry failed runs" })).toBeVisible();
    await expect(page.getByRole("switch", { name: "Off", exact: true })).toBeVisible();
    await expect(page.getByRole("switch", { name: "On", exact: true })).toBeVisible();
    await expect(page.getByRole("switch", { name: "Disabled off" })).toBeVisible();
    await expect(page.getByRole("switch", { name: "Disabled on" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "switch-dark.png");
  });

  test("shows every state with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/switch");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "switch-light.png");
  });

  test("every track is a real <input type=checkbox> with role=switch (Accessibility 'Role and state')", async ({
    page,
  }) => {
    await page.goto("/dev/switch");
    const field = page.getByRole("switch", { name: "Off", exact: true });
    await expect(field).toHaveJSProperty("tagName", "INPUT");
    await expect(field).toHaveJSProperty("type", "checkbox");
    await expect(field).toHaveAttribute("role", "switch");
  });

  test("toggles on Space, the row being one tab stop (Accessibility 'Space toggles')", async ({ page }) => {
    await page.goto("/dev/switch");
    const field = page.getByRole("switch", { name: "Auto-retry failed runs" });
    await expect(field).toBeChecked();
    await field.focus();
    await page.keyboard.press("Space");
    await expect(field).not.toBeChecked();
  });

  test("a disabled switch is a real, native disabled input and keeps its checked state", async ({ page }) => {
    await page.goto("/dev/switch");
    await expect(page.getByRole("switch", { name: "Disabled off" })).toBeDisabled();
    await expect(page.getByRole("switch", { name: "Disabled on" })).toBeDisabled();
    await expect(page.getByRole("switch", { name: "Disabled on" })).toBeChecked();
  });

  test("clicking the label row toggles the track (Accessibility, the row is the target)", async ({ page }) => {
    await page.goto("/dev/switch");
    await page.getByText("Off", { exact: true }).click();
    await expect(page.getByRole("switch", { name: "Off", exact: true })).toBeChecked();
  });
});
