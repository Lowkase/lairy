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

test.describe("Textarea dev route", () => {
  test("shows every state with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/textarea");
    await expect(page.getByLabel("Why it was skipped").first()).toBeVisible();
    await expect(page.getByLabel("Empty")).toBeVisible();
    await expect(page.getByLabel("Focused")).toBeVisible();
    await expect(page.getByLabel("Disabled")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "textarea-dark.png");
  });

  test("shows every state with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/textarea");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "textarea-light.png");
  });

  test("is a real, labelled <textarea> (Textarea Accessibility 'Labelled like any field')", async ({ page }) => {
    await page.goto("/dev/textarea");
    const field = page.getByLabel("Why it was skipped").first();
    await expect(field).toHaveJSProperty("tagName", "TEXTAREA");
  });

  test("defaults to 3 rows, opening at about three lines (anatomy #2)", async ({ page }) => {
    await page.goto("/dev/textarea");
    await expect(page.getByLabel("Empty")).toHaveAttribute("rows", "3");
  });

  test("Enter inserts a newline rather than submitting (Accessibility 'Tab leaves the field')", async ({ page }) => {
    await page.goto("/dev/textarea");
    const field = page.getByLabel("Empty");
    await field.click();
    await field.pressSequentially("a");
    await field.press("Enter");
    await field.pressSequentially("b");
    await expect(field).toHaveValue("a\nb");
  });

  test("the counter turns and names how much to cut once the value runs over the limit", async ({ page }) => {
    await page.goto("/dev/textarea");
    const counter = page.getByText("528/512");
    await expect(counter).toBeVisible();
    await expect(page.getByText("528 characters — trim 16")).toBeVisible();

    const field = page.locator('[data-slot="textarea-field"][aria-invalid="true"]');
    await expect(field).toBeVisible();
  });

  test("never renders a native maxlength, so typing is never silently blocked", async ({ page }) => {
    await page.goto("/dev/textarea");
    const fields = page.locator('[data-slot="textarea-field"]');
    const count = await fields.count();
    for (let i = 0; i < count; i += 1) {
      await expect(fields.nth(i)).not.toHaveAttribute("maxlength");
    }
  });

  test("a disabled field is a real, native disabled textarea with no resize handle", async ({ page }) => {
    await page.goto("/dev/textarea");
    const field = page.getByLabel("Disabled");
    await expect(field).toBeDisabled();
    await expect(field).toHaveCSS("resize", "none");
  });
});
