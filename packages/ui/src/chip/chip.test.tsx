import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "./chip";

describe("Chip", () => {
  it("renders its label", () => {
    render(
      <Chip pressed={false} onPressedChange={() => {}}>
        OPEN
      </Chip>,
    );
    expect(screen.getByText("OPEN")).toBeInTheDocument();
  });

  it("uses the chip shape token, not the locked 2px radius (AGENTS.md rule 5)", () => {
    render(
      <Chip pressed={false} onPressedChange={() => {}}>
        OPEN
      </Chip>,
    );
    const chip = screen.getByRole("button", { name: "OPEN" });
    expect(chip.className).toContain("rounded-chip");
    expect(chip.className).not.toContain("rounded-ds");
  });

  describe("Filter / Toggle (pressable)", () => {
    it("defaults to the Filter variant, carried as data-variant (Chips Variants)", () => {
      render(
        <Chip pressed={false} onPressedChange={() => {}}>
          OPEN
        </Chip>,
      );
      expect(screen.getByRole("button", { name: "OPEN" })).toHaveAttribute(
        "data-variant",
        "filter",
      );
    });

    it("distinguishes the Toggle variant from Filter via data-variant, even though both render the same classes (Chips Variants 'Same shape')", () => {
      render(
        <Chip variant="toggle" pressed={false} onPressedChange={() => {}}>
          QUEUED
        </Chip>,
      );
      const toggle = screen.getByRole("button", { name: "QUEUED" });
      expect(toggle).toHaveAttribute("data-variant", "toggle");
    });

    it("is a real button reporting aria-pressed, not aria-checked (Chips Accessibility 'Pressed, not checked')", () => {
      render(
        <Chip pressed={true} onPressedChange={() => {}}>
          OPEN
        </Chip>,
      );
      const chip = screen.getByRole("button", { name: "OPEN" });
      expect(chip.tagName).toBe("BUTTON");
      expect(chip).toHaveAttribute("aria-pressed", "true");
      expect(chip).not.toHaveAttribute("aria-checked");
    });

    it("reports aria-pressed=false at rest", () => {
      render(
        <Chip pressed={false} onPressedChange={() => {}}>
          OPEN
        </Chip>,
      );
      expect(screen.getByRole("button", { name: "OPEN" })).toHaveAttribute("aria-pressed", "false");
    });

    it("calls onPressedChange with the inverted state on click", () => {
      const onPressedChange = vi.fn();
      render(
        <Chip pressed={false} onPressedChange={onPressedChange}>
          OPEN
        </Chip>,
      );
      fireEvent.click(screen.getByRole("button", { name: "OPEN" }));
      expect(onPressedChange).toHaveBeenCalledWith(true);
    });

    it("carries the on-state treatment only when pressed (Chips Variants 'Active')", () => {
      render(
        <Chip pressed={true} onPressedChange={() => {}}>
          OPEN
        </Chip>,
      );
      const chip = screen.getByRole("button", { name: "OPEN" });
      expect(chip.className).toContain("border-accent");
      expect(chip.className).toContain("bg-accent-soft");
    });

    it("has no positive tabindex (AGENTS.md rule 7)", () => {
      render(
        <Chip pressed={false} onPressedChange={() => {}}>
          OPEN
        </Chip>,
      );
      const chip = screen.getByRole("button", { name: "OPEN" });
      const tabIndex = chip.getAttribute("tabindex");
      expect(tabIndex === null || Number(tabIndex) <= 0).toBe(true);
    });
  });

  describe("Removable", () => {
    it("carries data-variant='removable' on the outer slot", () => {
      render(
        <Chip removable onRemove={() => {}}>
          FLEET
        </Chip>,
      );
      expect(screen.getByText("FLEET").closest('[data-slot="chip"]')).toHaveAttribute(
        "data-variant",
        "removable",
      );
    });

    it("renders the label as plain text, not itself a button (Chips Variants 'Removable')", () => {
      render(
        <Chip removable onRemove={() => {}}>
          FLEET
        </Chip>,
      );
      const label = screen.getByText("FLEET");
      expect(label.tagName).toBe("SPAN");
    });

    it("gives the dismiss control its own accessible name naming what it removes (Chips Accessibility 'Two targets, two labels')", () => {
      render(
        <Chip removable onRemove={() => {}}>
          FLEET
        </Chip>,
      );
      expect(screen.getByRole("button", { name: "Remove FLEET" })).toBeInTheDocument();
    });

    it("calls onRemove when the dismiss control is activated", () => {
      const onRemove = vi.fn();
      render(
        <Chip removable onRemove={onRemove}>
          FLEET
        </Chip>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Remove FLEET" }));
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it("uses the chip shape token on the dismiss control, not a bare circle reserved for layout-free marks (AGENTS.md rule 5)", () => {
      render(
        <Chip removable onRemove={() => {}}>
          FLEET
        </Chip>,
      );
      const dismiss = screen.getByRole("button", { name: "Remove FLEET" });
      expect(dismiss.className).toContain("rounded-chip");
      expect(dismiss.className).not.toContain("rounded-full");
    });

    it("has exactly one button — the dismiss target — not two hit targets for the body too", () => {
      render(
        <Chip removable onRemove={() => {}}>
          FLEET
        </Chip>,
      );
      expect(screen.getAllByRole("button")).toHaveLength(1);
    });
  });
});
