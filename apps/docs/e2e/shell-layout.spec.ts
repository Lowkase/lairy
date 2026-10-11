import { expect, test } from "@playwright/test";

// LDS-155: the shell matches the design it was ported from — a full-height
// rail with the header starting where it ends, the identity dot on the
// tile's corner, the thin two-grey scrollbar, and a 320px floor.

test.describe("Shell layout (desktop)", () => {
  test.use({ viewport: { width: 1153, height: 856 } });

  test("the rail runs the full height and the header starts where it ends", async ({ page }) => {
    await page.goto("/components/callout");
    const rail = await page.locator('[data-slot="main-rail"]').boundingBox();
    const header = await page.locator('header[data-slot="header"]:visible').boundingBox();
    expect(rail).not.toBeNull();
    expect(header).not.toBeNull();
    if (!rail || !header) return;
    expect(rail.y).toBe(0);
    expect(rail.height).toBe(856);
    expect(header.y).toBe(0);
    expect(header.x).toBeCloseTo(rail.x + rail.width, 0);
    // The rail's brand cell is level with the header (both 52px).
    const brand = await page.locator('[data-slot="main-rail"] a').first().boundingBox();
    expect(brand?.height).toBe(header.height);
  });

  test("with no subnav (Overview) the page still sits to the right of the rail", async ({ page }) => {
    await page.goto("/");
    const rail = await page.locator('[data-slot="main-rail"]').boundingBox();
    const main = await page.locator("main").boundingBox();
    expect(main?.x).toBeCloseTo((rail?.x ?? 0) + (rail?.width ?? 0), 0);
  });

  test("the identity status dot sits on the tile's corner, not inside it", async ({ page }) => {
    await page.goto("/");
    const tile = await page.locator('header[data-slot="header"]:visible button[aria-haspopup="true"]').boundingBox();
    const dot = await page
      .locator('header[data-slot="header"]:visible button[aria-haspopup="true"] span.animate-pulse')
      .boundingBox();
    expect(tile).not.toBeNull();
    expect(dot).not.toBeNull();
    if (!tile || !dot) return;
    // Centre of the dot is on or beyond the tile's bottom-right corner.
    expect(dot.x + dot.width / 2).toBeGreaterThanOrEqual(tile.x + tile.width - 1);
    expect(dot.y + dot.height / 2).toBeGreaterThanOrEqual(tile.y + tile.height - 1);
  });

  for (const theme of ["dark", "light"] as const) {
    test(`the page scrolls with the thin two-grey scrollbar (${theme})`, async ({ page }) => {
      await page.goto("/");
      await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
      const style = await page.evaluate(() => {
        const cs = getComputedStyle(document.querySelector("main") as Element);
        const border2 = getComputedStyle(document.documentElement).getPropertyValue("--border-2").trim();
        return { width: cs.scrollbarWidth, color: cs.scrollbarColor, border2 };
      });
      expect(style.width).toBe("thin");
      // `<thumb> <track>`: a --border-2 thumb on a transparent track.
      expect(style.color).toMatch(/transparent$|rgba\(0, 0, 0, 0\)$/);
      expect(style.border2.length).toBeGreaterThan(0);
    });
  }
});

test.describe("Shell minimum width", () => {
  test("below 320px the page scrolls sideways instead of compressing", async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 700 });
    await page.goto("/");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeGreaterThanOrEqual(320);
  });

  test("at 320px the four tab labels have a gutter between them", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");
    const labels = page.getByRole("navigation", { name: "Main" }).getByRole("link");
    await expect(labels).toHaveCount(4);
    const boxes = await labels.evaluateAll((links) =>
      links.map((link) => {
        const text = Array.from(link.querySelectorAll("span")).at(-1) as HTMLElement;
        const r = text.getBoundingClientRect();
        return { left: r.left, right: r.right };
      }),
    );
    for (let i = 1; i < boxes.length; i += 1) {
      const gap = (boxes[i]?.left ?? 0) - (boxes[i - 1]?.right ?? 0);
      expect(gap).toBeGreaterThanOrEqual(8);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
