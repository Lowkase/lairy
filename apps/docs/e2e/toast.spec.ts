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

// The page also renders static Toast examples, which share the same roles —
// live toasts are scoped to the Notifications region.
const live = (page: Page) => page.getByRole("region", { name: "Notifications" });

async function fireAll(page: Page) {
  for (const label of ["Success", "Fail", "Info", "Neutral"]) {
    await page.getByRole("button", { name: label, exact: true }).click();
  }
  // The entrance fades in from transparent; axe and the screenshot must see
  // the settled colours, not a frame partway through.
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState === "finished"));
}

test.describe("Toast dev route", () => {
  test("shows every example and a fired stack with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/dev/toast");
    await expect(page.getByText("Workflow approved").first()).toBeVisible();
    await fireAll(page);
    await expect(page.getByRole("region", { name: "Notifications" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "toast-dark.png");
  });

  test("shows every example and a fired stack with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/dev/toast");
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole("button", { name: /Theme:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);

    await fireAll(page);
    await expect(page.getByRole("region", { name: "Notifications" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    await screenshot(page, "toast-light.png");
  });

  test("docks to the top right under the header, above the overlay stop (Anatomy 'Surface')", async ({ page }) => {
    await page.goto("/dev/toast");
    await page.getByRole("button", { name: "Success", exact: true }).click();
    const stack = page.getByRole("region", { name: "Notifications" });
    await expect(stack).toBeVisible();

    const box = await stack.boundingBox();
    const viewport = page.viewportSize();
    expect(box?.y).toBeCloseTo(78, 0);
    expect((viewport?.width ?? 0) - ((box?.x ?? 0) + (box?.width ?? 0))).toBeCloseTo(22, 0);
    expect(await stack.evaluate((el) => getComputedStyle(el).zIndex)).toBe("90");
  });

  test("a success toast leaves on its own", async ({ page }) => {
    await page.goto("/dev/toast");
    await page.getByRole("button", { name: "Neutral", exact: true }).click();
    await expect(live(page).getByRole("status").filter({ hasText: "Draft saved" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Notifications" })).toHaveCount(0, { timeout: 6000 });
  });

  test("a failure does not leave on its own and announces assertively", async ({ page }) => {
    await page.goto("/dev/toast");
    await page.getByRole("button", { name: "Fail", exact: true }).click();
    const alert = live(page).getByRole("alert").filter({ hasText: "Run failed" });
    await expect(alert).toBeVisible();
    await page.waitForTimeout(4000);
    await expect(alert).toBeVisible();
  });

  test("firing never moves focus into the stack (Accessibility 'Announced, never focused')", async ({ page }) => {
    await page.goto("/dev/toast");
    const trigger = page.getByRole("button", { name: "Fail", exact: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(live(page).getByRole("alert").filter({ hasText: "Run failed" })).toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("Escape clears the whole stack, failures included (Accessibility 'Dismiss is reachable')", async ({ page }) => {
    await page.goto("/dev/toast");
    await fireAll(page);
    await expect(page.getByRole("region", { name: "Notifications" })).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByRole("region", { name: "Notifications" })).toHaveCount(0);
  });

  test("Dismiss removes one toast and is reachable by Tab", async ({ page }) => {
    await page.goto("/dev/toast");
    await page.getByRole("button", { name: "Fail", exact: true }).click();
    await page.getByRole("button", { name: "Info", exact: true }).click();
    const stack = page.getByRole("region", { name: "Notifications" });

    await stack.getByRole("button", { name: "Dismiss" }).first().focus();
    await expect(stack.getByRole("button", { name: "Dismiss" }).first()).toBeFocused();
    await stack.getByRole("button", { name: "Dismiss" }).first().click();

    await expect(live(page).getByRole("alert").filter({ hasText: "Run failed" })).toHaveCount(0);
    await expect(live(page).getByRole("status").filter({ hasText: "Sync scheduled" })).toBeVisible();
  });

  test("a repeat collapses into one counted toast", async ({ page }) => {
    await page.goto("/dev/toast");
    const fail = page.getByRole("button", { name: "Fail", exact: true });
    await fail.click();
    await fail.click();
    await fail.click();

    await expect(live(page).getByRole("alert").filter({ hasText: "Run failed" })).toHaveCount(1);
    await expect(live(page).getByText("×3")).toBeVisible();
  });

  test("the docs page renders from the entry with a live demo that fires a toast", async ({ page }) => {
    await page.goto("/components/toast");
    await expect(page.getByRole("heading", { name: "Toast", level: 1 })).toBeVisible();
    await expect(page.getByText("A toast reports what just happened, in the corner, and leaves on its own.")).toBeVisible();
    await expect(page.getByText("There is no Warning intent")).toBeVisible();

    await page.getByRole("button", { name: "Fail", exact: true }).first().click();
    await expect(live(page).getByRole("alert")).toContainText("Run failed");
  });
});
