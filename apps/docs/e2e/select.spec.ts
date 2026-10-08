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

async function expectNoSeriousViolations(page: Page, { menuOpen = false } = {}) {
  // While the menu is open Radix marks the rest of the page aria-hidden and
  // traps focus inside the listbox, so the page's buttons are unreachable
  // even though they stay in the DOM; axe's aria-hidden-focus rule can't see
  // the trap. The menu's panel-in animation is waited out too, or contrast is
  // sampled mid-fade.
  if (menuOpen) await page.waitForTimeout(400);
  const builder = new AxeBuilder({ page });
  if (menuOpen) builder.disableRules(["aria-hidden-focus"]);
  const results = await builder.analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

// Radix hides everything outside an open menu from the accessibility tree
// (aria-hidden), so the field can't be re-found by role while it is open.
// Capture its id up front and address it by that.
async function fieldById(page: Page, name: string) {
  const id = await page.getByRole("combobox", { name }).first().getAttribute("id");
  return page.locator(`[id="${id}"]`);
}

test.describe("Select dev route", () => {
  test("shows every state with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/select");
    await expect(page.getByRole("combobox", { name: "Empty" })).toBeVisible();
    await expectNoSeriousViolations(page);
    await screenshot(page, "select-dark.png");
  });

  test("shows every state with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/select");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    await expectNoSeriousViolations(page);
    await screenshot(page, "select-light.png");
  });

  test("the open menu has no serious accessibility violations in either theme", async ({ page }) => {
    await page.goto("/dev/select");
    const field = await fieldById(page, "Empty");
    await field.click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await expectNoSeriousViolations(page, { menuOpen: true });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("listbox")).toBeHidden();

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await field.click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await expectNoSeriousViolations(page, { menuOpen: true });
  });

  test("the open menu matches the field's width", async ({ page }) => {
    await page.goto("/dev/select");
    const field = await fieldById(page, "Empty");
    await field.click();
    const fieldBox = await field.boundingBox();
    const menuBox = await page.getByRole("listbox").boundingBox();
    expect(fieldBox).not.toBeNull();
    expect(menuBox).not.toBeNull();
    expect(Math.abs(menuBox!.width - fieldBox!.width)).toBeLessThan(2);
  });

  test("focus moves into the menu, Escape closes it and returns focus to the field", async ({ page }) => {
    await page.goto("/dev/select");
    const field = await fieldById(page, "Empty");
    await field.click();
    await expect(page.getByRole("option", { name: "Ingest" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("listbox")).toBeHidden();
    await expect(field).toBeFocused();
  });

  test("an errored field ties its message to the field via aria-describedby and aria-invalid", async ({ page }) => {
    await page.goto("/dev/select");
    const field = page.getByRole("combobox", { name: "Stage" }).last();
    await expect(field).toHaveAttribute("aria-invalid", "true");

    const describedBy = await field.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveText("Stage is required");
  });

  test("a disabled field is a real, native disabled control", async ({ page }) => {
    await page.goto("/dev/select");
    await expect(page.getByRole("combobox", { name: "Disabled" })).toBeDisabled();
  });
});
