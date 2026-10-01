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

test.describe("Chip dev route", () => {
  test("shows every variant with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/chip");
    await expect(page.getByText("OPEN").first()).toBeVisible();
    await expect(page.getByText("FAILED")).toBeVisible();
    await expect(page.getByText("QUEUED")).toBeVisible();
    await expect(page.getByText("FLEET")).toBeVisible();
    await expect(page.getByText("RESEARCH")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "chip-dark.png");
  });

  test("shows every variant with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/chip");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "chip-light.png");
  });

  test("a Filter/Toggle chip is a real button reporting aria-pressed (Chips Accessibility 'Pressed, not checked')", async ({
    page,
  }) => {
    await page.goto("/dev/chip");
    const openChip = page.locator('[data-slot="chip"]').filter({ hasText: "OPEN" }).first();
    await expect(openChip).toHaveJSProperty("tagName", "BUTTON");
    await expect(openChip).toHaveAttribute("aria-pressed", "true");

    const doneChip = page.locator('[data-slot="chip"]').filter({ hasText: "DONE" }).first();
    await expect(doneChip).toHaveAttribute("aria-pressed", "false");

    const tabIndex = await openChip.getAttribute("tabindex");
    expect(tabIndex === null || Number(tabIndex) <= 0).toBe(true);
  });

  test("a Removable chip gives its dismiss control its own label naming what it removes (Chips Accessibility 'Two targets, two labels')", async ({
    page,
  }) => {
    await page.goto("/dev/chip");
    const fleetChip = page.locator('[data-slot="chip"]').filter({ hasText: "FLEET" });
    await expect(fleetChip).toHaveJSProperty("tagName", "SPAN");

    const dismiss = fleetChip.locator('[data-slot="chip-dismiss"]');
    await expect(dismiss).toHaveJSProperty("tagName", "BUTTON");
    await expect(dismiss).toHaveAttribute("aria-label", "Remove FLEET");
  });
});
