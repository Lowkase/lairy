import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { __unstable__loadDesignSystem } from "tailwindcss";
import { describe, expect, it } from "vitest";

const dir = path.dirname(fileURLToPath(import.meta.url));
const read = (p: string) => readFileSync(path.join(dir, p), "utf8");

// The Tailwind design system built from our generated theme, exactly as
// apps/docs/app/globals.css assembles it (ADR-0003: default theme removed).
async function loadLairyDesignSystem() {
  const tailwindPkgCss = fileURLToPath(import.meta.resolve("tailwindcss/index.css"));
  const tailwindDefaults = readFileSync(tailwindPkgCss, "utf8");
  const css = [tailwindDefaults, read("./css/tailwind-theme.css")].join("\n");
  return __unstable__loadDesignSystem(css, { base: dir });
}

describe("Tailwind theme (seam 4: no off-system CSS)", () => {
  it("produces no CSS for off-system named utilities (bg-blue-500, rounded-lg)", async () => {
    // Removing Tailwind's default theme (ADR-0003) makes these two produce
    // nothing. Arbitrary-value syntax (text-[10.5px]) bypasses the theme
    // entirely and can't be blocked here — that's `tailwindcss/no-arbitrary-value`
    // in eslint.config.js, exercised in packages/ui and apps/docs lint.
    const design = await loadLairyDesignSystem();
    const [bg, rounded] = design.candidatesToCss(["bg-blue-500", "rounded-lg"]);

    expect(bg).toBeNull();
    expect(rounded).toBeNull();
  });

  it("produces CSS for Lairy's own tokens", async () => {
    const design = await loadLairyDesignSystem();
    const [bg, rounded, spacing] = design.candidatesToCss(["bg-accent", "rounded-ds", "p-16"]);

    expect(bg).toContain("var(--color-accent)");
    expect(rounded).toContain("var(--radius-ds)");
    expect(spacing).toContain("var(--spacing-16)");
  });
});

describe("Alarm tokens (ADR-0007: identical in every theme)", () => {
  it('keeps the same value in :root and [data-theme="light"]', () => {
    const css = read("./css/tokens.css");
    const darkBlock = css.slice(css.indexOf(":root"), css.indexOf('[data-theme="light"]'));
    const lightBlock = css.slice(css.indexOf('[data-theme="light"]'));

    for (const name of ["--alarm:", "--alarm-soft:", "--alarm-line:"]) {
      const darkLine = darkBlock.split("\n").find((l) => l.trim().startsWith(name));
      expect(darkLine).toBeDefined();
      expect(lightBlock).not.toContain(name);
    }
  });
});
