import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function screenshot(page: Page, name: string) {
  if (process.env.CI) {
    await page.screenshot({ path: `test-results/${name}` });
  } else {
    await expect(page).toHaveScreenshot(name);
  }
}

test.describe("Header dev route", () => {
  test("shows every state with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/header");
    await expect(page.getByRole("banner").first()).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "header-dark.png");
  });

  test("shows every state with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/header");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    // Many rows transition colour at once on a theme switch (duration-160,
    // tabs.spec.ts's own precedent for this exact class of flake) — wait
    // for it to settle before axe samples colour.
    await page.waitForTimeout(800);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "header-light.png");
  });

  test("opens the Appearance menu and switches theme from within it", async ({ page }) => {
    await page.goto("/dev/header");
    await page.getByRole("button", { name: "Appearance" }).first().click();
    await page.getByRole("button", { name: "Theme: light" }).first().click();
  });

  test("Escape closes the menu and restores focus", async ({ page }) => {
    await page.goto("/dev/header");
    const trigger = page.getByRole("button", { name: "Appearance" }).first();
    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });
});
