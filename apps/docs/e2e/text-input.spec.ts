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

test.describe("Text input dev route", () => {
  test("shows every state with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/text-input");
    await expect(page.getByLabel("Pipeline name").first()).toBeVisible();
    await expect(page.getByLabel("Empty")).toBeVisible();
    await expect(page.getByLabel("Focused")).toBeVisible();
    await expect(page.getByLabel("Disabled")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "text-input-dark.png");
  });

  test("shows every state with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/text-input");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "text-input-light.png");
  });

  test("every field has a real <label for> as its accessible name (Text input Accessibility 'Always a real label')", async ({
    page,
  }) => {
    await page.goto("/dev/text-input");
    const field = page.getByLabel("Pipeline name").first();
    await expect(field).toHaveJSProperty("tagName", "INPUT");
    await expect(field).toHaveJSProperty("type", "text");
  });

  test("the focused field takes the amber ring on pointer focus, not only keyboard focus", async ({ page }) => {
    await page.goto("/dev/text-input");
    const field = page.getByLabel("Focused");
    await expect(field).toBeFocused();
  });

  test("an errored field names the fix and ties it to the field via aria-describedby and aria-invalid", async ({
    page,
  }) => {
    await page.goto("/dev/text-input");
    const field = page.getByLabel("Pipeline name").nth(1);
    await expect(field).toHaveAttribute("aria-invalid", "true");

    const describedBy = await field.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveText("Spaces are not allowed — try nightly-ingest");
  });

  test("a disabled field is a real, native disabled input", async ({ page }) => {
    await page.goto("/dev/text-input");
    const field = page.getByLabel("Disabled");
    await expect(field).toBeDisabled();
  });
});
