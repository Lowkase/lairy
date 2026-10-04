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

test.describe("Radio dev route", () => {
  test("shows every state with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/radio");
    await expect(page.getByRole("radiogroup", { name: "Off", exact: true })).toBeVisible();
    await expect(page.getByRole("radiogroup", { name: "On", exact: true })).toBeVisible();
    await expect(page.getByRole("radiogroup", { name: "Error" })).toBeVisible();
    await expect(page.getByRole("radiogroup", { name: "Disabled off" })).toBeVisible();
    await expect(page.getByRole("radiogroup", { name: "Disabled on" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "radio-dark.png");
  });

  test("shows every state with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/radio");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "radio-light.png");
  });

  test("every dial is a real <input type=radio> with a bound label (Radio Accessibility 'One tab stop')", async ({
    page,
  }) => {
    await page.goto("/dev/radio");
    const field = page.getByRole("radiogroup", { name: "On", exact: true }).getByLabel("Every run");
    await expect(field).toHaveJSProperty("tagName", "INPUT");
    await expect(field).toHaveJSProperty("type", "radio");
  });

  test("ships with a default selected (On)", async ({ page }) => {
    await page.goto("/dev/radio");
    const group = page.getByRole("radiogroup", { name: "On", exact: true });
    await expect(group.getByLabel("Every run")).toBeChecked();
    await expect(group.getByLabel("Failures only")).not.toBeChecked();
  });

  test("arrow keys move between options and select as they move (Accessibility 'Arrows choose')", async ({
    page,
  }) => {
    await page.goto("/dev/radio");
    const group = page.getByRole("radiogroup", { name: "On", exact: true });
    await group.getByLabel("Every run").focus();
    await page.keyboard.press("ArrowDown");
    await expect(group.getByLabel("Failures only")).toBeChecked();
    await expect(group.getByLabel("Every run")).not.toBeChecked();
  });

  test("an errored group marks every option aria-invalid", async ({ page }) => {
    await page.goto("/dev/radio");
    const group = page.getByRole("radiogroup", { name: "Error" });
    await expect(group.getByLabel("Every run")).toHaveAttribute("aria-invalid", "true");
    await expect(group.getByLabel("Failures only")).toHaveAttribute("aria-invalid", "true");
    await expect(group.getByLabel("Never")).toHaveAttribute("aria-invalid", "true");
  });

  test("a disabled group is real, native disabled inputs", async ({ page }) => {
    await page.goto("/dev/radio");
    const group = page.getByRole("radiogroup", { name: "Disabled off" });
    await expect(group.getByLabel("Every run")).toBeDisabled();
    await expect(group.getByLabel("Failures only")).toBeDisabled();
  });

  test("one locked option can be disabled without disabling the group", async ({ page }) => {
    await page.goto("/dev/radio");
    const group = page.getByRole("radiogroup", { name: "One locked option" });
    await expect(group.getByLabel("Every run")).toBeEnabled();
    await expect(group.getByLabel("Never")).toBeDisabled();
  });

  test("clicking the label row selects the option (Accessibility, the row is the target)", async ({ page }) => {
    await page.goto("/dev/radio");
    const group = page.getByRole("radiogroup", { name: "Off", exact: true });
    await group.getByText("Failures only").click();
    await expect(group.getByLabel("Failures only")).toBeChecked();
  });
});
