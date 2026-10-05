import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Patterns route", () => {
  test("the index page renders inside the shell with no patterns yet", async ({ page }) => {
    await page.goto("/patterns");
    await expect(page.getByRole("heading", { name: "Patterns", level: 1 })).toBeVisible();
    await expect(page.getByText("No patterns yet")).toBeVisible();
    await expect(page.getByRole("link", { name: "Patterns" })).toHaveAttribute("aria-current", "page");

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });

  test("an unknown pattern id 404s", async ({ page }) => {
    const response = await page.goto("/patterns/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
