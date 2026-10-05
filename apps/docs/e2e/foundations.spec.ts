import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Pixel baselines are per-OS; ours were captured on macOS. Compare locally,
// where the baseline matches, and just capture (no diff) in CI, which runs on
// Linux — asserting there would fail on font rendering, not a real
// regression. CI should move to a container matching the baseline OS
// (mcr.microsoft.com/playwright) before this can diff safely everywhere.
// Mirrors color.spec.ts's own helper (LDS-014). The shell's own clock
// (LDS-035, apps/docs/components/shell.tsx) ticks every second — masked so
// a baseline captured a second apart from a run doesn't flake on the
// digits alone.
async function screenshot(page: Page, name: string) {
  if (process.env.CI) {
    await page.screenshot({ path: `test-results/${name}` });
  } else {
    await expect(page).toHaveScreenshot(name, { mask: [page.locator('[data-slot="header-time"]')] });
  }
}

async function axeCheck(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

// The shell's theme toggle (LDS-035) lives in the header's identity menu,
// under Appearance — not a single always-visible button the way the plain
// ThemeToggle wrapper's own "Theme: ..." button is on /dev/* routes.
async function switchToLightTheme(page: Page) {
  await page.getByRole("button", { name: "Appearance" }).first().click();
  await page.getByRole("button", { name: "Theme: light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  // The shell's rail, subnav and header all transition colour at once on a
  // theme switch (duration-160) — wait for it to settle before axe samples
  // colour (tabs.spec.ts's own precedent for this exact class of flake,
  // widened here since the shell transitions many more elements at once).
  await page.waitForTimeout(800);
}

// The eight remaining foundations (LDS-015; Color has its own richer spec,
// color.spec.ts, from LDS-014). One name per id, taken from each entry's
// own meta.name, for the h1 assertion.
const FOUNDATIONS: Array<{ id: string; name: string }> = [
  { id: "typography", name: "Typography" },
  { id: "spacing", name: "Spacing" },
  { id: "radius", name: "Radius" },
  { id: "icons", name: "Icons" },
  { id: "elevation", name: "Elevation" },
  { id: "motion", name: "Motion" },
  { id: "visualization", name: "Visualization" },
  { id: "accessibility", name: "Accessibility" },
];

for (const { id, name } of FOUNDATIONS) {
  test.describe(`${name} foundation page`, () => {
    test(`renders with no serious accessibility violations (dark)`, async ({ page }) => {
      await page.goto(`/foundations/${id}`);
      await expect(page.getByRole("heading", { name, level: 1 })).toBeVisible();

      await axeCheck(page);
      await screenshot(page, `${id}-dark.png`);
    });

    test(`renders with no serious accessibility violations (light)`, async ({ page }) => {
      await page.goto(`/foundations/${id}`);
      const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

      await switchToLightTheme(page);

      const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(lightBg).not.toBe(darkBg);

      await axeCheck(page);
      await screenshot(page, `${id}-light.png`);
    });
  });
}

test.describe("get_foundation coverage", () => {
  test("every foundation route renders real content from its entry, not a placeholder", async ({ page }) => {
    for (const { id } of FOUNDATIONS) {
      await page.goto(`/foundations/${id}`);
      // Every entry has a Changelog (Section 07/08/09/10/11 depending on
      // how many sections the page has) and an Application section driven
      // by `principles`, so this is true for all eight regardless of their
      // differing section counts.
      await expect(page.getByText("Changelog", { exact: true })).toBeVisible();
    }
  });
});
