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

test.describe("Loading dev route", () => {
  test("shows every variant with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/loading");
    await expect(page.getByText("// analyzing")).toBeVisible();
    await expect(page.getByText("// syncing")).toBeVisible();
    await expect(page.locator('[data-variant="skeleton"]')).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "loading-dark.png");
  });

  test("shows every variant with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/loading");
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

    await screenshot(page, "loading-light.png");
  });

  test("the sweep stack and inline caret are busy, polite status regions (Loading Accessibility 'Busy, announced once')", async ({
    page,
  }) => {
    await page.goto("/dev/loading");
    const sweepStack = page.locator('[data-slot="loading"][data-variant="sweep-stack"]');
    await expect(sweepStack).toHaveAttribute("role", "status");
    await expect(sweepStack).toHaveAttribute("aria-busy", "true");
    await expect(sweepStack).toHaveAttribute("aria-live", "polite");

    const inlineCaret = page.locator('[data-slot="loading"][data-variant="inline-caret"]');
    await expect(inlineCaret).toHaveAttribute("role", "status");
    await expect(inlineCaret).toHaveAttribute("aria-busy", "true");
  });

  test("skeleton bars are hidden from assistive tech and carry no live region (Loading Accessibility 'Skeletons are silent')", async ({
    page,
  }) => {
    await page.goto("/dev/loading");
    const skeleton = page.locator('[data-slot="loading"][data-variant="skeleton"]');
    await expect(skeleton).not.toHaveAttribute("role", "status");
    await expect(skeleton.locator('[data-slot="loading-skeleton-line"]').first()).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  test("the caret and tracks are decorative (Loading Accessibility 'Busy, announced once')", async ({
    page,
  }) => {
    await page.goto("/dev/loading");
    const sweepStack = page.locator('[data-slot="loading"][data-variant="sweep-stack"]');
    await expect(sweepStack.locator('[data-slot="loading-track"]')).toHaveCount(3);
    await expect(sweepStack.locator('[data-slot="loading-caret"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
