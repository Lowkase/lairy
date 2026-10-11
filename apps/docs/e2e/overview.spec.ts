import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { listComponents, listFoundations, listPatterns } from "@lairy/content";

const PHONE = { width: 390, height: 844 };

// Pixel baselines are per-OS; see callout.spec.ts. Compare locally, capture in CI.
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

// The shell fades colour on a theme switch; axe must read the settled state.
async function switchTheme(page: Page, theme: "dark" | "light") {
  await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important}" });
  await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
}

test.describe("Overview (/)", () => {
  test("renders the four blocks with no serious accessibility violations (dark)", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Overview" })).toBeVisible();
    await axeCheck(page);
    await screenshot(page, "overview-dark.png");
  });

  test("renders the four blocks with no serious accessibility violations (light)", async ({ page }) => {
    await page.goto("/");
    await switchTheme(page, "light");
    await axeCheck(page);
    await screenshot(page, "overview-light.png");
  });

  test("the entry cards show the real counts from the catalogue", async ({ page }) => {
    await page.goto("/");
    const card = (name: string) =>
      page.locator('[data-slot="card"]').filter({ has: page.getByRole("heading", { level: 3, name }) });
    await expect(card("Foundations")).toContainText(`${listFoundations().length} entries`);
    await expect(card("Components")).toContainText(`${listComponents().length} entries`);
    const patterns = listPatterns().length;
    await expect(card("Patterns")).toContainText(patterns === 0 ? "None yet" : `${patterns} entries`);
    await expect(card("Components").getByRole("link", { name: "Open Components" })).toHaveAttribute(
      "href",
      "/components",
    );
  });

  test("Start here names the real commands, with the registry origin of the running site", async ({ page, baseURL }) => {
    await page.goto("/");
    await expect(page.getByText("npm install @lairy/tokens")).toBeVisible();
    await expect(page.getByText(`npx shadcn@latest add ${baseURL}/r/callout.json`)).toBeVisible();
    await expect(page.getByText("pnpm --filter mcp start")).toBeVisible();
    await expect(page.getByRole("link", { name: "llms.txt", exact: true })).toHaveAttribute("href", "/llms.txt");
    await expect(page.getByRole("link", { name: "llms-full.txt" })).toHaveAttribute("href", "/llms-full.txt");
  });

  test("each principle quotes its foundation and links to it", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Every surface in this system is 2px, and that is not a default — it is the lock.")).toBeVisible();
    for (const [name, href] of [
      ["Spacing", "/foundations/spacing"],
      ["Radius", "/foundations/radius"],
      ["Color", "/foundations/color"],
      ["Typography", "/foundations/typography"],
    ] as const) {
      await expect(page.getByRole("list").getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
    }
  });

  test("the rail lists Overview first and marks it current, with no subnav", async ({ page }) => {
    await page.goto("/");
    const main = page.getByRole("navigation", { name: "Main" });
    // The rail's items are its list rows; the Lairy mark above them is not one.
    const rows = main.getByRole("listitem");
    await expect(rows).toHaveCount(4);
    await expect(rows.first()).toContainText("Overview");
    await expect(main.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
    // Only the main rail is a navigation here: the subnav (labelled by its
    // module, "Overview") is not rendered at all.
    await expect(page.getByRole("navigation", { name: "Overview" })).toHaveCount(0);
    await expect(page.getByRole("banner").getByText("SYS·00").first()).toBeVisible();
  });

  test("other sections still mark themselves current, and Overview is reachable from them", async ({ page }) => {
    await page.goto("/components/callout");
    const main = page.getByRole("navigation", { name: "Main" });
    await expect(main.getByRole("link", { name: "Components" })).toHaveAttribute("aria-current", "page");
    await main.getByRole("link", { name: "Overview" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1, name: "Overview" })).toBeVisible();
  });
});

test.describe("Overview (/) at phone width", () => {
  test.use({ viewport: PHONE });

  test("shows four tabs, no Pages trigger, no horizontal scroll", async ({ page }) => {
    await page.goto("/");
    const tabs = page.getByRole("navigation", { name: "Main" });
    await expect(tabs.getByRole("link")).toHaveCount(4);
    await expect(tabs.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("button", { name: "Pages" })).toHaveCount(0);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    await axeCheck(page);
    await screenshot(page, "overview-phone.png");
  });
});
