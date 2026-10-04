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

test.describe("Checkbox dev route", () => {
  test("shows every state with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/checkbox");
    await expect(page.getByLabel("Retry failed steps")).toBeVisible();
    await expect(page.getByLabel("Off", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Indeterminate")).toBeVisible();
    await expect(page.getByLabel("Error")).toBeVisible();
    await expect(page.getByLabel("Disabled off")).toBeVisible();
    await expect(page.getByLabel("Disabled on")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "checkbox-dark.png");
  });

  test("shows every state with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/checkbox");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "checkbox-light.png");
  });

  test("every box is a real <input type=checkbox> with a bound label (Checkbox Accessibility 'Real inputs')", async ({
    page,
  }) => {
    await page.goto("/dev/checkbox");
    const field = page.getByLabel("Retry failed steps");
    await expect(field).toHaveJSProperty("tagName", "INPUT");
    await expect(field).toHaveJSProperty("type", "checkbox");
  });

  test("toggles on Space and is checked by default (Retry failed steps)", async ({ page }) => {
    await page.goto("/dev/checkbox");
    const field = page.getByLabel("Retry failed steps");
    await expect(field).toBeChecked();
    await field.focus();
    await page.keyboard.press("Space");
    await expect(field).not.toBeChecked();
  });

  test("the indeterminate box sets the DOM property, not aria-checked or the checked attribute", async ({
    page,
  }) => {
    await page.goto("/dev/checkbox");
    const field = page.getByLabel("Indeterminate");
    await expect(field).not.toBeChecked();
    const indeterminate = await field.evaluate((el: HTMLInputElement) => el.indeterminate);
    expect(indeterminate).toBe(true);
  });

  test("an errored box is a real input with aria-invalid set", async ({ page }) => {
    await page.goto("/dev/checkbox");
    await expect(page.getByLabel("Error")).toHaveAttribute("aria-invalid", "true");
  });

  test("a disabled box is a real, native disabled input", async ({ page }) => {
    await page.goto("/dev/checkbox");
    await expect(page.getByLabel("Disabled off")).toBeDisabled();
    await expect(page.getByLabel("Disabled on")).toBeDisabled();
    await expect(page.getByLabel("Disabled on")).toBeChecked();
  });

  test("clicking the label row toggles the box (Accessibility 'The row is the target')", async ({ page }) => {
    await page.goto("/dev/checkbox");
    const row = page.getByText("Off", { exact: true });
    await row.click();
    await expect(page.getByLabel("Off", { exact: true })).toBeChecked();
  });
});
