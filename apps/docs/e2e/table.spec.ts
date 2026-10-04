import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Pixel baselines are per-OS; ours were captured on macOS. Compare locally,
// where the baseline matches, and just capture (no diff) in CI, which runs
// on Linux — the same precedent tabs.spec.ts's own helper already sets.
async function screenshot(page: Page, name: string) {
  if (process.env.CI) {
    await page.screenshot({ path: `test-results/${name}` });
  } else {
    await expect(page).toHaveScreenshot(name);
  }
}

test.describe("Table dev route", () => {
  test("shows every state with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/table");
    await expect(page.getByRole("grid", { name: "Automations" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "table-dark.png");
  });

  test("shows every state with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/table");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "table-light.png");
  });

  test("ships with the idle toolbar when nothing is selected (Zones 'Toolbar — idle')", async ({ page }) => {
    await page.goto("/dev/table");
    await expect(page.getByText("6 automations")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create" })).toBeVisible();
  });

  test("checking a row swaps the toolbar to the selection state (Zones 'Toolbar — selection')", async ({ page }) => {
    await page.goto("/dev/table");
    // The visible box, not the sr-only input itself (Checkbox's own "real
    // inputs" pattern): clicking anywhere in the label natively forwards to
    // the input it wraps, but Playwright's own actionability check sees the
    // decorative box as "intercepting" the input's own (visually hidden)
    // point unless the click is forced past that check.
    await page.getByRole("checkbox", { name: "Select summarize" }).click({ force: true });
    await expect(page.getByText("1 selected")).toBeVisible();
    await expect(page.getByRole("row", { name: /summarize/ })).toHaveAttribute("aria-selected", "true");
  });

  test("Clear returns to the idle toolbar", async ({ page }) => {
    await page.goto("/dev/table");
    await page.getByRole("checkbox", { name: "Select summarize" }).click({ force: true });
    await page.getByRole("button", { name: "Clear" }).click();
    await expect(page.getByText("6 automations")).toBeVisible();
  });

  test("the header checkbox selects every row (Accessibility 'Selection is announced')", async ({ page }) => {
    await page.goto("/dev/table");
    await page.getByRole("checkbox", { name: "Select all rows" }).click({ force: true });
    await expect(page.getByText("6 selected")).toBeVisible();
  });

  test("row actions reveal on focus, not only on hover (Accessibility 'Nothing hover-only')", async ({ page }) => {
    await page.goto("/dev/table");
    const run = page.getByRole("button", { name: "Run summarize" });
    // `opacity` lives on the actions cell that wraps the button, not the
    // button itself — a child's own computed `opacity` is independent of
    // an ancestor's (compositing only affects final rendering).
    const actionsCell = run.locator("..");
    await expect(actionsCell).toHaveCSS("opacity", "0");
    await run.focus();
    await expect(actionsCell).toHaveCSS("opacity", "1");
  });

  test("the row's overflow menu opens, lists the destructive divider, and Escape closes it restoring focus (AGENTS.md rule 7)", async ({
    page,
  }) => {
    await page.goto("/dev/table");
    const trigger = page.getByRole("button", { name: "More actions for summarize" });
    await trigger.click();

    const menu = page.getByRole("menu", { name: "Row actions" });
    await expect(menu.getByRole("menuitem", { name: "View history" })).toBeVisible();
    await expect(menu.getByText("Destructive")).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Delete permanently" })).toBeVisible();
    // The first item overall — the one non-destructive action — gets
    // initial focus, not the first destructive one.
    await expect(menu.getByRole("menuitem", { name: "View history" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(menu).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
});
