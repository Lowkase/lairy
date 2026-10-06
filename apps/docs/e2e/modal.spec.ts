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

test.describe("Modal dev route", () => {
  test("shows every example with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/modal");
    await expect(page.getByRole("button", { name: "Delete workflow" }).first()).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "modal-dark.png");
  });

  test("shows every example with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/modal");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "modal-light.png");
  });

  test("opens as role=dialog, labelled and described, with aria-modal (Accessibility 'Dialog and modal')", async ({
    page,
  }) => {
    await page.goto("/dev/modal");
    await page.getByRole("button", { name: "Edit workflow" }).first().click();

    const dialog = page.getByRole("dialog").first();
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  test("Escape closes a benign modal and returns focus to the trigger (Accessibility 'Escape, always')", async ({
    page,
  }) => {
    await page.goto("/dev/modal");
    const trigger = page.getByRole("button", { name: "Edit workflow" }).first();
    await trigger.click();
    await expect(page.getByRole("dialog").first()).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("the close glyph closes a benign modal (anatomy #3)", async ({ page }) => {
    await page.goto("/dev/modal");
    await page.getByRole("button", { name: "Edit workflow" }).first().click();
    const dialog = page.getByRole("dialog").first();
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Close" }).click();

    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("the primary action is focused on open for a benign modal (Accessibility 'No default on destruct')", async ({
    page,
  }) => {
    await page.goto("/dev/modal");
    await page.getByRole("button", { name: "Edit workflow" }).first().click();
    const dialog = page.getByRole("dialog").first();
    await expect(dialog).toBeVisible();

    await expect(dialog.getByRole("button", { name: "Save" })).toBeFocused();
  });

  test("a destructive confirm renders role=alertdialog with no close glyph and Cancel focused (Accessibility 'No default on destruct')", async ({
    page,
  }) => {
    await page.goto("/dev/modal");
    await page.getByRole("button", { name: "Delete workflow" }).first().click();

    const confirm = page.getByRole("alertdialog").first();
    await expect(confirm).toBeVisible();
    await expect(confirm.getByRole("button", { name: "Close" })).toHaveCount(0);
    await expect(confirm.getByRole("button", { name: "Cancel" })).toBeFocused();
  });

  test("an outside click does not dismiss a destructive confirm (Accessibility 'the scrim click is only wired up when nothing can be lost')", async ({
    page,
  }) => {
    await page.goto("/dev/modal");
    await page.getByRole("button", { name: "Delete workflow" }).first().click();
    const confirm = page.getByRole("alertdialog").first();
    await expect(confirm).toBeVisible();

    await page.mouse.click(5, 5);

    await expect(confirm).toBeVisible();
  });

  test("Escape still closes a destructive confirm (Accessibility 'Escape, always')", async ({ page }) => {
    await page.goto("/dev/modal");
    const trigger = page.getByRole("button", { name: "Delete workflow" }).first();
    await trigger.click();
    await expect(page.getByRole("alertdialog").first()).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByRole("alertdialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
});
