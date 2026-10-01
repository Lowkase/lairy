import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Glyph, type GlyphName } from "./glyph";
import { InlineIcon, type InlineIconName } from "./inline-icon";

const GLYPH_NAMES: GlyphName[] = [
  "apps",
  "grid",
  "check",
  "build",
  "book",
  "pot",
  "rings",
  "wave",
  "nodes",
  "hex",
  "scan",
  "cmd",
];

const INLINE_ICON_NAMES: InlineIconName[] = ["open", "spark", "gear", "drain", "arrow"];

describe("Glyph", () => {
  it.each(GLYPH_NAMES)("renders %s on the 40 grid with round caps and joins", (name) => {
    const { container } = render(<Glyph name={name} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 40 40");
    expect(svg).toHaveAttribute("fill", "none");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg).toHaveAttribute("stroke-width", "2.2");
    expect(svg).toHaveAttribute("stroke-linecap", "round");
    expect(svg).toHaveAttribute("stroke-linejoin", "round");
  });

  it("defaults to the tile size (34px)", () => {
    const { container } = render(<Glyph name="rings" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "34");
    expect(svg).toHaveAttribute("height", "34");
  });

  it("uses the rail size (22px) when asked", () => {
    const { container } = render(<Glyph name="rings" size="rail" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "22");
    expect(svg).toHaveAttribute("height", "22");
  });

  it("is hidden from assistive tech when it has no label (decorative, beside its own text)", () => {
    const { container } = render(<Glyph name="hex" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
  });

  it("takes an accessible name when it is the only content", () => {
    const { container } = render(<Glyph name="hex" label="Fleet" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Fleet");
    expect(svg).not.toHaveAttribute("aria-hidden");
  });

  it.each(["rings", "nodes", "scan"] as const)(
    "reserves fill for %s's centre mark only",
    (name) => {
      const { container } = render(<Glyph name={name} />);
      const filled = container.querySelectorAll('[fill="currentColor"]');
      expect(filled.length).toBe(1);
      expect(filled[0]).toHaveAttribute("stroke", "none");
    },
  );
});

describe("InlineIcon", () => {
  it.each(INLINE_ICON_NAMES)("renders %s on the 24 grid, fixed at 16px", (name) => {
    const { container } = render(<InlineIcon name={name} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
    expect(svg).toHaveAttribute("stroke-width", "2");
    expect(svg).toHaveAttribute("stroke-linecap", "round");
    expect(svg).toHaveAttribute("stroke-linejoin", "round");
  });

  it("is hidden from assistive tech when it has no label", () => {
    const { container } = render(<InlineIcon name="gear" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("takes an accessible name when it is the only content", () => {
    const { container } = render(<InlineIcon name="drain" label="Drain node" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Drain node");
  });
});
