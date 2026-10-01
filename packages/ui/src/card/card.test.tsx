import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Card } from "./card";

describe("Card", () => {
  describe("Plain", () => {
    it("renders its children with no header", () => {
      render(<Card>Grouped controls and prose.</Card>);
      expect(screen.getByText("Grouped controls and prose.")).toBeInTheDocument();
    });

    it("carries data-kind='plain' by default", () => {
      render(<Card>Body</Card>);
      expect(screen.getByText("Body").closest('[data-slot="card"]')).toHaveAttribute(
        "data-kind",
        "plain",
      );
    });

    it("uses the locked radius token, not an arbitrary value", () => {
      render(<Card>Body</Card>);
      const card = screen.getByText("Body").closest('[data-slot="card"]');
      expect(card?.className).toContain("rounded-ds");
    });
  });

  describe("With header", () => {
    it("renders the title as a real heading element (Cards Accessibility 'Headings, not styling')", () => {
      render(
        <Card kind="with-header" title="Coverage">
          Body
        </Card>,
      );
      expect(screen.getByRole("heading", { name: "Coverage" })).toBeInTheDocument();
    });

    it("defaults the title to an h3", () => {
      render(
        <Card kind="with-header" title="Coverage">
          Body
        </Card>,
      );
      expect(screen.getByRole("heading", { name: "Coverage", level: 3 })).toBeInTheDocument();
    });

    it("renders the meta slot when given one", () => {
      render(
        <Card kind="with-header" title="Coverage" meta="12 SPEC'D">
          Body
        </Card>,
      );
      expect(screen.getByText("12 SPEC'D")).toBeInTheDocument();
    });

    it("omits the meta slot entirely when none is given", () => {
      render(
        <Card kind="with-header" title="Coverage">
          Body
        </Card>,
      );
      expect(screen.queryByText(/SPEC/)).not.toBeInTheDocument();
    });

    it("carries data-kind='with-header'", () => {
      render(
        <Card kind="with-header" title="Coverage">
          Body
        </Card>,
      );
      expect(screen.getByText("Body").closest('[data-slot="card"]')).toHaveAttribute(
        "data-kind",
        "with-header",
      );
    });
  });

  describe("HUD", () => {
    it("renders its body content", () => {
      render(<Card kind="hud">Live telemetry only.</Card>);
      expect(screen.getByText("Live telemetry only.")).toBeInTheDocument();
    });

    it("renders four corner marks, hidden from assistive tech", () => {
      render(<Card kind="hud">Body</Card>);
      const card = screen.getByText("Body").closest('[data-slot="card"]') as HTMLElement;
      const corners = card.querySelectorAll('[data-slot="card-hud-corner"]');
      expect(corners).toHaveLength(4);
      for (const corner of corners) {
        expect(corner).toHaveAttribute("aria-hidden", "true");
      }
    });
  });

  describe("Stat", () => {
    it("renders the label before the value in source order (Cards Accessibility 'Order matters')", () => {
      render(<Card kind="stat" label="Open items" value="32" unit="of 33" />);
      const card = screen.getByText("Open items").closest('[data-slot="card"]') as HTMLElement;
      const text = card.textContent ?? "";
      expect(text.indexOf("Open items")).toBeLessThan(text.indexOf("32"));
    });

    it("renders the unit only when given one", () => {
      const { rerender } = render(<Card kind="stat" label="Open items" value="32" unit="of 33" />);
      expect(screen.getByText("of 33")).toBeInTheDocument();

      rerender(<Card kind="stat" label="Open items" value="32" />);
      expect(screen.queryByText("of 33")).not.toBeInTheDocument();
    });

    it("carries data-kind='stat'", () => {
      render(<Card kind="stat" label="Open items" value="32" />);
      expect(screen.getByText("32").closest('[data-slot="card"]')).toHaveAttribute(
        "data-kind",
        "stat",
      );
    });
  });

  describe("Tile", () => {
    it("is a single real button, not a div wrapping extra tab stops (Cards Accessibility 'Tiles are one control')", () => {
      render(
        <Card kind="tile" onClick={() => {}}>
          Fleet
        </Card>,
      );
      const tile = screen.getByRole("button", { name: "Fleet" });
      expect(tile.tagName).toBe("BUTTON");
    });

    it("calls onClick when activated", () => {
      const onClick = vi.fn();
      render(
        <Card kind="tile" onClick={onClick}>
          Fleet
        </Card>,
      );
      screen.getByRole("button", { name: "Fleet" }).click();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("has no positive tabindex (AGENTS.md rule 7)", () => {
      render(
        <Card kind="tile" onClick={() => {}}>
          Fleet
        </Card>,
      );
      const tabIndex = screen.getByRole("button", { name: "Fleet" }).getAttribute("tabindex");
      expect(tabIndex === null || Number(tabIndex) <= 0).toBe(true);
    });

    it("carries data-kind='tile'", () => {
      render(
        <Card kind="tile" onClick={() => {}}>
          Fleet
        </Card>,
      );
      expect(screen.getByRole("button", { name: "Fleet" })).toHaveAttribute("data-kind", "tile");
    });
  });
});
