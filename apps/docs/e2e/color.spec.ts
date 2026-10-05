import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Pixel baselines are per-OS; ours were captured on macOS. Compare locally,
// where the baseline matches, and just capture (no diff) in CI, which runs on
// Linux — asserting there would fail on font rendering, not a real
// regression. CI should move to a container matching the baseline OS
// (mcr.microsoft.com/playwright) before this can diff safely everywhere.
// The shell's own clock (LDS-035, apps/docs/components/shell.tsx) ticks
// every second — masked so a baseline captured a second apart from a run
// doesn't flake on the digits alone.
async function screenshot(page: Page, name: string) {
  if (process.env.CI) {
    await page.screenshot({ path: `test-results/${name}` });
  } else {
    await expect(page).toHaveScreenshot(name, { mask: [page.locator('[data-slot="header-time"]')] });
  }
}

// The shell's theme toggle (LDS-035) lives in the header's identity menu,
// under Appearance — see foundations.spec.ts's own copy of this helper.
async function switchToLightTheme(page: Page) {
  await page.getByRole("button", { name: "Appearance" }).first().click();
  await page.getByRole("button", { name: "Theme: light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  // See foundations.spec.ts's own copy of this comment.
  await page.waitForTimeout(800);
}

test.describe("Color foundation page", () => {
  test("renders every section with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/foundations/color");
    await expect(page.getByRole("heading", { name: "Color", level: 1 })).toBeVisible();
    await expect(page.getByText("Colour in this system is a rank, not a palette.")).toBeVisible();
    await expect(page.getByText("Act. Primary buttons, focus rings")).toBeVisible();
    await expect(page.getByText("Refer. A second data series")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "color-dark.png");
  });

  test("renders every section with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/foundations/color");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await switchToLightTheme(page);

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "color-light.png");
  });

  test("relationship cards link to the now-stable Typography, Elevation and Accessibility foundations (LDS-015)", async ({
    page,
  }) => {
    await page.goto("/foundations/color");
    // Typography, Elevation and Accessibility were draft stubs under
    // LDS-014; LDS-015 gave each a full entry and a docs page, so their
    // Related cards on Color's own page now link out. Scoped to `main`
    // (LDS-035's shell): the subnav rail also links to each foundation by
    // name, so an unscoped query now matches two links, not one.
    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: /Typography/ })).toHaveCount(1);
    await expect(main.getByRole("link", { name: /Elevation/ })).toHaveCount(1);
    await expect(main.getByRole("link", { name: /Accessibility/ })).toHaveCount(1);
    await expect(page.getByText("Holds the rules colour has to satisfy")).toBeVisible();
  });

  test("a foundation with draft status 404s", async ({ page }) => {
    const response = await page.goto("/foundations/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
