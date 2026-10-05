import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function screenshot(page: Page, name: string) {
  if (process.env.CI) {
    await page.screenshot({ path: `test-results/${name}` });
  } else {
    await expect(page).toHaveScreenshot(name);
  }
}

test.describe("Navigation (Subnav) dev route", () => {
  test("shows every state with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/subnav");
    await expect(page.getByRole("navigation", { name: "Fleet" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "subnav-dark.png");
  });

  test("shows every state with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/subnav");
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

    await screenshot(page, "subnav-light.png");
  });

  test("only one section is open at a time", async ({ page }) => {
    await page.goto("/dev/subnav");
    const demo = page.getByRole("navigation", { name: "Fleet" });
    await expect(demo.getByRole("button", { name: /Operations/ })).toHaveAttribute("aria-expanded", "true");

    await demo.getByRole("button", { name: /Research/ }).click();
    await expect(demo.getByRole("button", { name: /Research/ })).toHaveAttribute("aria-expanded", "true");
    await expect(demo.getByRole("button", { name: /Operations/ })).toHaveAttribute("aria-expanded", "false");
  });

  test("the Hide row hides the column and a stub shows it again", async ({ page }) => {
    await page.goto("/dev/subnav");
    // The Hide row is chrome for the whole column, a sibling of the nav
    // landmark rather than one of its own links (subnav.tsx), so it's
    // queried directly rather than scoped to the "Fleet" navigation.
    await page.getByRole("button", { name: "Hide" }).first().click();
    await expect(page.getByRole("navigation", { name: "Fleet" })).toBeHidden();

    await page.getByRole("button", { name: "Show pages" }).first().click();
    await expect(page.getByRole("navigation", { name: "Fleet" })).toBeVisible();
  });
});
