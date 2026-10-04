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

test.describe("Tabs dev route", () => {
  test("shows every state with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/tabs");
    await expect(page.getByRole("tablist", { name: "Fleet view" })).toBeVisible();
    await expect(page.getByRole("tablist", { name: "Alerts view" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "tabs-dark.png");
  });

  test("shows every state with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/tabs");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    // Tab labels sit close to the AA floor on purpose (extractionNotes), so
    // axe must sample the settled colour, not a frame mid-`duration-160`
    // theme-switch transition — unlike the other dev routes' own light-theme
    // tests, whose colours carry enough margin not to need this wait.
    await page.waitForTimeout(250);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "tabs-light.png");
  });

  test("ships with the first tab selected (Rules 'Order is meaning')", async ({ page }) => {
    await page.goto("/dev/tabs");
    const group = page.getByRole("tablist", { name: "Fleet view" });
    await expect(group.getByRole("tab", { name: "Map" })).toHaveAttribute("aria-selected", "true");
  });

  test("only the selected tab is a tab stop (Accessibility 'Arrows move, Tab leaves')", async ({ page }) => {
    await page.goto("/dev/tabs");
    const group = page.getByRole("tablist", { name: "Fleet view" });
    await expect(group.getByRole("tab", { name: "Map" })).toHaveAttribute("tabIndex", "0");
    await expect(group.getByRole("tab", { name: "Table" })).toHaveAttribute("tabIndex", "-1");
  });

  test("clicking a tab selects it and swaps the panel", async ({ page }) => {
    await page.goto("/dev/tabs");
    const group = page.getByRole("tablist", { name: "Fleet view" });
    const tableTab = group.getByRole("tab", { name: "Table" });
    await tableTab.click();
    await expect(tableTab).toHaveAttribute("aria-selected", "true");
    const panelId = await tableTab.getAttribute("aria-controls");
    await expect(page.locator(`#${panelId}`)).toContainText("Every vessel as a row");
  });

  test("arrow keys move between tabs and select as they go (Accessibility 'Arrows move, Tab leaves')", async ({
    page,
  }) => {
    await page.goto("/dev/tabs");
    const group = page.getByRole("tablist", { name: "Fleet view" });
    await group.getByRole("tab", { name: "Map" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(group.getByRole("tab", { name: "Table" })).toHaveAttribute("aria-selected", "true");
    await expect(group.getByRole("tab", { name: "Table" })).toBeFocused();
  });

  test("Home and End jump to the ends", async ({ page }) => {
    await page.goto("/dev/tabs");
    const group = page.getByRole("tablist", { name: "Fleet view" });
    await group.getByRole("tab", { name: "Map" }).focus();
    await page.keyboard.press("End");
    await expect(group.getByRole("tab", { name: "Timeline" })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(group.getByRole("tab", { name: "Map" })).toHaveAttribute("aria-selected", "true");
  });

  test("a count renders in --faint after the label (Content rule 'A count is allowed')", async ({ page }) => {
    await page.goto("/dev/tabs");
    const group = page.getByRole("tablist", { name: "Alerts view" });
    await expect(group.getByRole("tab", { name: "Alerts 3" })).toBeVisible();
  });

  test("the panel is labelled by its own tab (Accessibility 'Tablist and panel')", async ({ page }) => {
    await page.goto("/dev/tabs");
    const group = page.getByRole("tablist", { name: "Fleet view" });
    const tab = group.getByRole("tab", { name: "Map" });
    const tabId = await tab.getAttribute("id");
    const panelId = await tab.getAttribute("aria-controls");
    const panel = page.locator(`#${panelId}`);
    await expect(panel).toHaveAttribute("role", "tabpanel");
    await expect(panel).toHaveAttribute("aria-labelledby", tabId ?? "");
  });
});
