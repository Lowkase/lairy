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

test.describe("Scrollbar dev route", () => {
  test("shows every example with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/scrollbar");

    const panes = page.locator('[data-slot="scrollbar"]');
    await expect(panes).toHaveCount(2);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "scrollbar-dark.png");
  });

  test("shows every example with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/scrollbar");
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

    await screenshot(page, "scrollbar-light.png");
  });

  test("is a plain overflow container — no role, no tabindex, no ARIA added (Scrollbar Accessibility 'Native, not custom')", async ({
    page,
  }) => {
    await page.goto("/dev/scrollbar");

    const pane = page.locator('[data-slot="scrollbar"]').first();
    await expect(pane).toHaveJSProperty("tagName", "DIV");
    await expect(pane).not.toHaveAttribute("role");
    await expect(pane).not.toHaveAttribute("tabindex");

    const overflow = await pane.evaluate((el) => getComputedStyle(el).overflow);
    expect(overflow).toBe("auto");
  });

  test("the thumb lightens on hover without any timed transition (Scrollbar States 'Hover')", async ({
    page,
  }) => {
    await page.goto("/dev/scrollbar");

    const pane = page.locator('[data-slot="scrollbar"]').first();
    const transition = await pane.evaluate(
      (el) => getComputedStyle(el, "::-webkit-scrollbar-thumb").transitionDuration,
    );
    expect(["0s", ""]).toContain(transition);
  });
});
