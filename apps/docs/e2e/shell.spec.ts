import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Mirrors foundations.spec.ts's own helpers (LDS-015). The shell's own
// clock (apps/docs/components/shell.tsx) ticks every second — masked here
// so a baseline captured one second apart from a run doesn't flake on the
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

async function openAppearanceMenu(page: Page) {
  await page.getByRole("button", { name: "Appearance" }).first().click();
}

async function switchToLightTheme(page: Page) {
  await openAppearanceMenu(page);
  await page.getByRole("button", { name: "Theme: light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
}

test.describe("Shell", () => {
  test("wraps a foundation page with main rail, subnav and header", async ({ page }) => {
    await page.goto("/foundations/color");
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Foundations" })).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("link", { name: "Foundations" })).toHaveAttribute("aria-current", "page");
  });

  test("wraps a component page, marking the current section and entry active", async ({ page }) => {
    await page.goto("/components/callout");
    await expect(page.getByRole("link", { name: "Components" })).toHaveAttribute("aria-current", "page");
    await expect(
      page.getByRole("navigation", { name: "Components" }).getByRole("link", { name: "Callout" }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("the main rail collapses and expands, keeping every item labelled", async ({ page }) => {
    await page.goto("/foundations/color");
    const rail = page.locator('[data-slot="main-rail"]');
    await expect(rail).toHaveCSS("width", "216px");

    await page.getByRole("button", { name: "Collapse" }).click();
    await expect(rail).toHaveCSS("width", "56px");
    await expect(page.getByRole("link", { name: "Foundations" })).toBeVisible();

    await page.getByRole("button", { name: "Expand" }).click();
    await expect(rail).toHaveCSS("width", "216px");
  });

  test("the subnav hides and shows", async ({ page }) => {
    await page.goto("/foundations/color");
    await expect(page.getByRole("navigation", { name: "Foundations" })).toBeVisible();

    await page.getByRole("button", { name: "Hide" }).click();
    await expect(page.getByRole("navigation", { name: "Foundations" })).toBeHidden();

    await page.getByRole("button", { name: "Show pages" }).click();
    await expect(page.getByRole("navigation", { name: "Foundations" })).toBeVisible();
  });

  test("the identity menu opens, switches theme and closes on Escape", async ({ page }) => {
    await page.goto("/foundations/color");
    await openAppearanceMenu(page);
    await expect(page.getByRole("button", { name: "Theme: dark" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Theme: dark" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Appearance" }).first()).toBeFocused();
  });

  test("switching theme from the shell updates the page", async ({ page }) => {
    await page.goto("/foundations/color");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await switchToLightTheme(page);

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);
  });

  test("renders with no serious accessibility violations on a foundation page (dark)", async ({ page }) => {
    await page.goto("/foundations/color");
    await axeCheck(page);
    await screenshot(page, "shell-foundation-dark.png");
  });

  test("renders with no serious accessibility violations on a foundation page (light)", async ({ page }) => {
    await page.goto("/foundations/color");
    await switchToLightTheme(page);
    await page.waitForTimeout(800);
    await axeCheck(page);
    await screenshot(page, "shell-foundation-light.png");
  });

  test("renders with no serious accessibility violations on a component page (dark)", async ({ page }) => {
    await page.goto("/components/callout");
    await axeCheck(page);
    await screenshot(page, "shell-component-dark.png");
  });

  test("renders with no serious accessibility violations on a component page (light)", async ({ page }) => {
    await page.goto("/components/callout");
    await switchToLightTheme(page);
    await page.waitForTimeout(800);
    await axeCheck(page);
    await screenshot(page, "shell-component-light.png");
  });

  test("an entry with no built component shows a placeholder, not a 404", async ({ page }) => {
    await page.goto("/components/modal");
    await expect(page.getByText(/no built component yet/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Modal", level: 1 })).toBeVisible();
  });
});
