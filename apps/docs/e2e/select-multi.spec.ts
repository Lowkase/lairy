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

test.describe("Select (Multi) dev route", () => {
  test("shows every state with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/select-multi");
    await expect(page.getByRole("combobox", { name: "Empty" })).toBeVisible();
    await expectNoSeriousViolations(page);
    await screenshot(page, "select-multi-dark.png");
  });

  test("shows every state with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/select-multi");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    await expectNoSeriousViolations(page);
    await screenshot(page, "select-multi-light.png");
  });

  test("the open menu has no serious accessibility violations in either theme", async ({ page }) => {
    await page.goto("/dev/select-multi");
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

  test("the open menu matches the field's width and stays open while picking", async ({ page }) => {
    await page.goto("/dev/select-multi");
    const field = await fieldById(page, "Empty");
    await field.click();
    // The page's scroll lock shifts layout as the menu opens; wait for the
    // menu's width to settle on the field's.
    await expect
      .poll(async () => {
        const fieldBox = await field.boundingBox();
        const menuBox = await page.locator('[data-slot="select-multi-menu"]').boundingBox();
        return Math.abs(menuBox!.width - fieldBox!.width);
      })
      .toBeLessThan(2);

    await page.getByRole("option", { name: /Ingest/ }).click();
    await page.getByRole("option", { name: /Export/ }).click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByRole("status")).toHaveText("2 of 5 selected");
  });

  test("focus moves into the menu, is held, and Escape closes it and returns focus to the field", async ({ page }) => {
    await page.goto("/dev/select-multi");
    const field = await fieldById(page, "Empty");
    await field.click();
    await expect(page.getByRole("listbox")).toBeFocused();

    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest('[data-slot="select-multi-menu"]'))).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(page.getByRole("listbox")).toBeHidden();
    await expect(field).toBeFocused();
  });

  test("the field stays one row tall however many values are chosen", async ({ page }) => {
    await page.goto("/dev/select-multi");
    const field = await fieldById(page, "Empty");
    const before = (await field.boundingBox())!.height;
    await field.click();
    await page.getByRole("button", { name: "All" }).click();
    await page.keyboard.press("Escape");
    const after = (await field.boundingBox())!.height;
    expect(after).toBe(before);
  });

  test("a narrow field collapses the tokens that do not fit into a counted chip", async ({ page }) => {
    await page.goto("/dev/select-multi");
    const overflow = page.locator('[data-slot="select-multi-overflow"]');
    await expect(page.getByRole("combobox", { name: "Stages" })).toHaveCount(2);
    await expect(overflow).toHaveCount(1);
    // Font metrics differ per OS: where not even one token fits, the chip is the bare count.
    await expect(overflow).toHaveText(/^(\+\d+ more|\d+ selected)$/);
  });

  test("an errored field ties its message to the field via aria-describedby and aria-invalid", async ({ page }) => {
    await page.goto("/dev/select-multi");
    const field = page.getByRole("combobox", { name: "Errored" });
    await expect(field).toHaveAttribute("aria-invalid", "true");
    const describedBy = await field.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveText("Pick at least one stage");
  });

  test("a disabled field is a real, native disabled control", async ({ page }) => {
    await page.goto("/dev/select-multi");
    await expect(page.getByRole("combobox", { name: "Disabled" })).toBeDisabled();
  });
});
