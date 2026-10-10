import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { listComponents, listFoundations } from "@lairy/content";

// docs/prd.md §13: "all 9 foundations and 28 non-chart components have ...
// docs pages ...; both themes pass axe with no serious violations." The
// per-component specs run axe on /dev example routes; this sweeps the
// published /components/[slug] and /foundations/[slug] pages themselves.
const pages = [
  ...listComponents().map((e) => `/components/${e.meta.id}`),
  ...listFoundations().map((e) => `/foundations/${e.meta.id}`),
];

test("the catalogue is 28 components and 9 foundations", () => {
  expect(listComponents()).toHaveLength(28);
  expect(listFoundations()).toHaveLength(9);
});

for (const theme of ["dark", "light"] as const) {
  for (const path of pages) {
    test(`${path} has no serious axe violations (${theme})`, async ({ page }) => {
      await page.goto(path);
      // The theme switch transitions colour; axe must read the settled state.
      await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important}" });
      await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(serious, JSON.stringify(serious.map((v) => [v.id, v.nodes.length]))).toEqual([]);
    });
  }
}
