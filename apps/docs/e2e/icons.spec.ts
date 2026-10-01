import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Pixel baselines are per-OS; ours were captured on macOS. Compare locally,
// where the baseline matches, and just capture (no diff) in CI, which runs on
// Linux — asserting there would fail on font rendering, not a real
// regression. Mirrors callout.spec.ts's own helper.
async function screenshot(page: Page, name: string) {
  if (process.env.CI) {
    await page.screenshot({ path: `test-results/${name}` });
  } else {
    await expect(page).toHaveScreenshot(name);
  }
}

test.describe("Icons dev route", () => {
  test("shows both families with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/icons");
    await expect(page.getByRole("heading", { name: "Icons — both families", level: 1 })).toBeVisible();
    await expect(page.getByText("Glyphs", { exact: true })).toBeVisible();
    await expect(page.getByText("Inline icons", { exact: true })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "icons-gallery-dark.png");
  });

  test("shows both families with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/icons");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "icons-gallery-light.png");
  });

  test("renders every glyph and inline icon named in the Icons foundation's inventory", async ({ page }) => {
    await page.goto("/dev/icons");

    const glyphNames = [
      "apps",
      "grid",
      "check",
      "build",
      "book",
      "pot",
      "rings",
      "wave",
      "nodes",
      "hex",
      "scan",
      "cmd",
    ];
    for (const name of glyphNames) {
      await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
    }

    const inlineIconNames = ["open", "spark", "gear", "drain", "arrow"];
    for (const name of inlineIconNames) {
      await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
    }
  });
});
