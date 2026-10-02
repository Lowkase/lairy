import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Scrollbar } from "./scrollbar";

describe("Scrollbar", () => {
  it("renders its children", () => {
    render(
      <Scrollbar>
        <span>Overflowing content</span>
      </Scrollbar>,
    );

    expect(screen.getByText("Overflowing content")).toBeInTheDocument();
  });

  it("is a plain, native scrollable container — no role, no tabindex, no ARIA added", () => {
    render(<Scrollbar data-testid="scrollbar">Content</Scrollbar>);

    const node = screen.getByTestId("scrollbar");
    expect(node.tagName).toBe("DIV");
    expect(node).toHaveAttribute("data-slot", "scrollbar");
    expect(node).not.toHaveAttribute("role");
    expect(node).not.toHaveAttribute("tabindex");
  });

  it("merges a caller's className alongside its own overflow styling", () => {
    render(
      <Scrollbar data-testid="scrollbar" className="h-44">
        Content
      </Scrollbar>,
    );

    const node = screen.getByTestId("scrollbar");
    expect(node.className).toContain("overflow-auto");
    expect(node.className).toContain("h-44");
  });

  it("forwards arbitrary div props (Scrollbar Accessibility 'Native, not custom')", () => {
    render(<Scrollbar data-testid="scrollbar" id="pane-one" />);

    expect(screen.getByTestId("scrollbar")).toHaveAttribute("id", "pane-one");
  });
});
