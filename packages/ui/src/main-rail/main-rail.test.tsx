import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MainRail, type MainRailItem } from "./main-rail";

const ITEMS: MainRailItem[] = [
  { id: "launcher", label: "Launcher", icon: <span aria-hidden="true">L</span>, href: "/" },
  { id: "fleet", label: "Fleet", icon: <span aria-hidden="true">F</span>, href: "/fleet" },
  { id: "research", label: "Research", icon: <span aria-hidden="true">R</span>, href: "/research" },
];

describe("MainRail", () => {
  it("renders a nav landmark with one link per item (Accessibility 'Nav landmark')", () => {
    render(<MainRail items={ITEMS} collapsed={false} onCollapsedChange={() => {}} />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    for (const item of ITEMS) {
      expect(screen.getByRole("link", { name: item.label })).toBeInTheDocument();
    }
  });

  it('marks the active item with aria-current="page" (Accessibility "Current page")', () => {
    render(
      <MainRail items={ITEMS} activeId="fleet" collapsed={false} onCollapsedChange={() => {}} />,
    );
    expect(screen.getByRole("link", { name: "Fleet" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Launcher" })).not.toHaveAttribute("aria-current");
  });

  it("keeps every item's accessible name when collapsed (Accessibility 'Collapsed still labelled')", () => {
    render(<MainRail items={ITEMS} collapsed={true} onCollapsedChange={() => {}} />);
    for (const item of ITEMS) {
      expect(screen.getByRole("link", { name: item.label })).toBeInTheDocument();
    }
  });

  it("names each collapsed item with a Tooltip, not a native title (#103)", () => {
    render(<MainRail items={ITEMS} collapsed={true} onCollapsedChange={() => {}} />);
    for (const item of ITEMS) {
      const link = screen.getByRole("link", { name: item.label });
      expect(link).not.toHaveAttribute("title");
      const bubble = document.getElementById(link.getAttribute("aria-describedby") ?? "");
      expect(bubble).toHaveAttribute("role", "tooltip");
      expect(bubble).toHaveTextContent(item.label);
    }
  });

  it("renders no tooltips when expanded, and keeps the collapse button mounted across a toggle", () => {
    const { rerender } = render(
      <MainRail items={ITEMS} collapsed={false} onCollapsedChange={() => {}} />,
    );
    expect(screen.queryByRole("tooltip", { hidden: true })).not.toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Collapse" });

    rerender(<MainRail items={ITEMS} collapsed={true} onCollapsedChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Expand" })).toBe(button);
    expect(button).not.toHaveAttribute("title");
  });

  it("calls onCollapsedChange when the collapse row is clicked", async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();
    render(<MainRail items={ITEMS} collapsed={false} onCollapsedChange={onCollapsedChange} />);
    await user.click(screen.getByRole("button", { name: "Collapse" }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it("renders the brand lockup as a link home", () => {
    render(
      <MainRail
        items={ITEMS}
        collapsed={false}
        onCollapsedChange={() => {}}
        brandHref="/"
        brandLabel="Lairy"
      />,
    );
    expect(screen.getByRole("link", { name: "LAIRY" })).toHaveAttribute("href", "/");
  });
});
