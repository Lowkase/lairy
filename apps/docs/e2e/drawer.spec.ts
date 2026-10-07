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

test.describe("Drawer dev route", () => {
  test("shows every example with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/drawer");
    await expect(page.getByRole("button", { name: "Edit workflow" }).first()).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "drawer-dark.png");
  });

  test("shows every example with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/drawer");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "drawer-light.png");
  });

  test("opens as role=dialog, labelled and described, with aria-modal (Accessibility 'Dialog, and modal about it')", async ({
    page,
  }) => {
    await page.goto("/dev/drawer");
    await page.getByRole("button", { name: "Edit workflow" }).first().click();

    const dialog = page.getByRole("dialog").first();
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  test("Escape closes it and returns focus to the trigger (Accessibility 'Two ways out')", async ({ page }) => {
    await page.goto("/dev/drawer");
    const trigger = page.getByRole("button", { name: "Edit workflow" }).first();
    await trigger.click();
    await expect(page.getByRole("dialog").first()).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("the close glyph closes it (anatomy #3)", async ({ page }) => {
    await page.goto("/dev/drawer");
    await page.getByRole("button", { name: "Edit workflow" }).first().click();
    const dialog = page.getByRole("dialog").first();
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Close" }).click();

    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("a scrim click closes it (anatomy #1: 'a click on it closes the drawer')", async ({ page }) => {
    await page.goto("/dev/drawer");
    await page.getByRole("button", { name: "Edit workflow" }).first().click();
    await expect(page.getByRole("dialog").first()).toBeVisible();

    await page.mouse.click(5, 5);

    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
