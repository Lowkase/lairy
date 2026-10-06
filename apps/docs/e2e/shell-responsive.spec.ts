import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Breakpoint tokens (packages/tokens/tokens/breakpoint.json, docs/prd.md
// §8.6): phone < 640, tablet 640–1023, desktop ≥ 1024. One representative
// width per band, matching this ticket's acceptance criterion.
const PHONE = { width: 390, height: 844 };
const TABLET = { width: 768, height: 1024 };
const DESKTOP = { width: 1280, height: 800 };

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

test.describe("Shell — phone layout (LDS-037, the approved LDS-036 proposal)", () => {
  test.use({ viewport: PHONE });

  test("shows the compact header, bottom tab bar and no desktop rails", async ({ page }) => {
    await page.goto("/components/callout");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Components" })).toHaveAttribute("aria-current", "page");

    // The desktop subnav column never mounts visibly at phone width.
    await expect(page.getByRole("navigation", { name: "Components" })).toBeHidden();
  });

  test("the Pages trigger opens a full-screen overlay scoped to the active section", async ({ page }) => {
    await page.goto("/components/callout");

    const trigger = page.getByRole("button", { name: "Pages" });
    await trigger.click();

    const overlay = page.getByRole("dialog", { name: "Components pages" });
    await expect(overlay).toBeVisible();
    await expect(overlay.getByRole("link", { name: "Callout" })).toHaveAttribute("aria-current", "page");
  });

  test("Escape closes the Pages overlay and returns focus to the trigger", async ({ page }) => {
    await page.goto("/components/callout");

    const trigger = page.getByRole("button", { name: "Pages" });
    await trigger.click();
    await expect(page.getByRole("dialog", { name: "Components pages" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Components pages" })).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("the Close button closes the Pages overlay", async ({ page }) => {
    await page.goto("/components/callout");

    await page.getByRole("button", { name: "Pages" }).click();
    const overlay = page.getByRole("dialog", { name: "Components pages" });
    await expect(overlay).toBeVisible();

    await overlay.getByRole("button", { name: "Close" }).click();
    await expect(overlay).toBeHidden();
  });

  test("the bottom tab bar navigates between sections", async ({ page }) => {
    await page.goto("/components/callout");

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Foundations" }).click();
    await expect(page.getByRole("link", { name: "Foundations" })).toHaveAttribute("aria-current", "page");
  });

  test("the identity control stays reachable and switches theme", async ({ page }) => {
    await page.goto("/components/callout");

    await page.getByRole("button", { name: "Appearance" }).click();
    await page.getByRole("button", { name: "Theme: light" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("renders with no serious accessibility violations, overlay closed (dark)", async ({ page }) => {
    await page.goto("/components/callout");
    await axeCheck(page);
    await screenshot(page, "shell-phone-dark.png");
  });

  test("renders with no serious accessibility violations, overlay open (dark)", async ({ page }) => {
    await page.goto("/components/callout");
    await page.getByRole("button", { name: "Pages" }).click();
    await expect(page.getByRole("dialog", { name: "Components pages" })).toBeVisible();
    // The overlay's own entrance (animate-panel-in, 260ms) is still
    // interpolating colour when axe would otherwise sample it right after
    // `click()` — the same class of flake shell.spec.ts's own theme-switch
    // checks already wait out (LDS-035).
    await page.waitForTimeout(400);
    await axeCheck(page);
    await screenshot(page, "shell-phone-pages-open-dark.png");
  });

  test("renders with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/components/callout");
    await page.getByRole("button", { name: "Appearance" }).click();
    await page.getByRole("button", { name: "Theme: light" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.waitForTimeout(800);
    await axeCheck(page);
    await screenshot(page, "shell-phone-light.png");
  });
});

test.describe("Shell — tablet and desktop widths stay on the existing shell", () => {
  for (const [name, viewport] of [
    ["tablet", TABLET],
    ["desktop", DESKTOP],
  ] as const) {
    test(`${name}: the desktop rails show and the phone chrome stays hidden`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/components/callout");

      await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Components" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Pages" })).toBeHidden();
    });

    test(`${name}: renders with no serious accessibility violations`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/components/callout");
      await axeCheck(page);
      await screenshot(page, `shell-${name}-dark.png`);
    });
  }
});
