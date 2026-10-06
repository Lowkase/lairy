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

test.describe("Popover dev route", () => {
  test("shows every example with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/popover");
    await expect(page.getByRole("button", { name: "Actions" }).first()).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "popover-dark.png");
  });

  test("shows every example with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/popover");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "popover-light.png");
  });

  test("the menu kind opens on click as role=menu/menuitem, closes on an outside click (Accessibility 'Menu semantics', 'Escape and outside click')", async ({
    page,
  }) => {
    await page.goto("/dev/popover");
    const trigger = page.getByRole("button", { name: "Actions" }).first();

    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await trigger.click();

    const menu = page.getByRole("menu").first();
    await expect(menu).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("menuitem").first()).toBeVisible();

    await page.mouse.click(10, 10);
    await expect(menu).toBeHidden();
  });

  test("Escape closes the menu and returns focus to the trigger (Accessibility 'Focus moves and returns')", async ({
    page,
  }) => {
    await page.goto("/dev/popover");
    const trigger = page.getByRole("button", { name: "Actions" }).first();

    await trigger.click();
    await expect(page.getByRole("menu").first()).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu").first()).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("selecting a destructive row closes the panel (Rules 'Rows act')", async ({ page }) => {
    await page.goto("/dev/popover");
    const trigger = page.getByRole("button", { name: "Actions" }).first();

    await trigger.click();
    const menu = page.getByRole("menu").first();
    await menu.getByRole("menuitem", { name: "Delete" }).click();

    await expect(menu).toBeHidden();
  });

  test("the Detail kind shows its field rows and one link on click (Usage 'facts about the anchor')", async ({
    page,
  }) => {
    await page.goto("/dev/popover");
    const trigger = page.getByRole("button", { name: "Run 4471" }).first();

    await trigger.click();
    await expect(page.getByText("Owner").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Open run →" }).first()).toBeVisible();
  });
});
