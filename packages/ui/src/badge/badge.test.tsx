import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge tone="success">LIVE</Badge>);
    expect(screen.getByText("LIVE")).toBeInTheDocument();
  });

  it("renders a span, not an interactive element", () => {
    render(<Badge tone="neutral">SYS</Badge>);
    expect(screen.getByText("SYS").tagName).toBe("SPAN");
  });

  it("is not focusable: no tabindex and no role (Badge Accessibility 'Not focusable')", () => {
    render(<Badge tone="neutral">SYS</Badge>);
    const badge = screen.getByText("SYS");
    expect(badge).not.toHaveAttribute("tabindex");
    expect(badge).not.toHaveAttribute("role");
  });

  it.each([
    ["neutral", "border-border", "text-mute"],
    ["info", "border-accent-2-line", "text-accent-2"],
    ["success", "border-accent-line", "text-accent"],
    // Fail's label is --fg, not --alarm: bare --alarm text fails AA against
    // --bg in the light theme (confirmed by axe in apps/docs/e2e/badge.spec.ts).
    // The border alone carries the tone.
    ["fail", "border-alarm-line", "text-fg"],
  ] as const)("tone %s carries its own border and text colour", (tone, borderClass, textClass) => {
    render(<Badge tone={tone}>STATE</Badge>);
    const badge = screen.getByText("STATE");
    expect(badge.className).toContain(borderClass);
    expect(badge.className).toContain(textClass);
  });

  it("is uppercase at the Micro type style, never sentence case (Badge Content rule 1)", () => {
    render(<Badge tone="success">live</Badge>);
    const badge = screen.getByText("live");
    expect(badge.className).toContain("uppercase");
    expect(badge.className).toContain("text-micro");
    expect(badge.className).toContain("tracking-tight-12");
  });

  it("never grows to fill a column: padding is fixed, not full width (Badge anatomy #3)", () => {
    render(<Badge tone="neutral">SYS</Badge>);
    expect(screen.getByText("SYS").className).toContain("w-fit");
  });
});
