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

test.describe("Tooltip dev route", () => {
  test("shows every example with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/tooltip");
    await expect(page.getByRole("button", { name: "Duplicate run" }).first()).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "tooltip-dark.png");
  });

  test("shows every example with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/tooltip");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "tooltip-light.png");
  });

  test("the bubble is hidden until the trigger is hovered, then shown after the delay (Rules 'Delay in, none out')", async ({
    page,
  }) => {
    await page.goto("/dev/tooltip");
    const trigger = page.getByRole("button", { name: "Duplicate run" }).first();
    const bubble = page.getByRole("tooltip", { includeHidden: true }).first();

    await expect(bubble).toHaveCSS("opacity", "0");
    await trigger.hover();
    await expect(bubble).toHaveCSS("opacity", "1");
    await expect(bubble).toHaveText("Duplicate run · D");
  });

  test("hides instantly on mouse leave", async ({ page }) => {
    await page.goto("/dev/tooltip");
    const trigger = page.getByRole("button", { name: "Duplicate run" }).first();
    const bubble = page.getByRole("tooltip", { includeHidden: true }).first();

    await trigger.hover();
    await expect(bubble).toHaveCSS("opacity", "1");

    await page.mouse.move(0, 0);
    await expect(bubble).toHaveCSS("opacity", "0");
  });

  test("shows immediately on keyboard focus and Escape dismisses it without moving focus (Accessibility 'Keyboard shows it too')", async ({
    page,
  }) => {
    await page.goto("/dev/tooltip");
    const trigger = page.getByRole("button", { name: "Duplicate run" }).first();
    const bubble = page.getByRole("tooltip", { includeHidden: true }).first();

    await trigger.focus();
    await expect(bubble).toHaveCSS("opacity", "1");
    await expect(trigger).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(bubble).toHaveCSS("opacity", "0");
    await expect(trigger).toBeFocused();
  });

  test("the trigger carries aria-describedby pointing at the role=tooltip bubble (Accessibility 'Described, not labelled')", async ({
    page,
  }) => {
    await page.goto("/dev/tooltip");
    const trigger = page.getByRole("button", { name: "Duplicate run" }).first();
    const bubble = page.getByRole("tooltip", { includeHidden: true }).first();

    const describedBy = await trigger.getAttribute("aria-describedby");
    const bubbleId = await bubble.getAttribute("id");
    expect(describedBy).toBe(bubbleId);
  });
});
