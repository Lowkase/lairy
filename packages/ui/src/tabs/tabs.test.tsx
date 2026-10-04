import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs } from "./tabs";

const VIEWS = [
  { value: "overview", label: "Overview", panel: "Overview panel" },
  { value: "states", label: "States", panel: "States panel" },
  { value: "usage", label: "Usage", panel: "Usage panel" },
];

describe("Tabs", () => {
  it("renders a real tablist with a tab per view", () => {
    render(<Tabs label="Docs" tabs={VIEWS} />);
    expect(screen.getByRole("tablist", { name: "Docs" })).toBeInTheDocument();
    for (const view of VIEWS) {
      expect(screen.getByRole("tab", { name: view.label })).toBeInTheDocument();
    }
  });

  it("ships with the first tab selected when nothing else is chosen (Rules 'Order is meaning')", () => {
    render(<Tabs tabs={VIEWS} />);
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview panel");
  });

  it("honours defaultValue", () => {
    render(<Tabs tabs={VIEWS} defaultValue="states" />);
    expect(screen.getByRole("tab", { name: "States" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("States panel");
  });

  it("only one tab stop: the selected tab is tabIndex 0, every other tab is -1 (Accessibility 'Arrows move, Tab leaves')", () => {
    render(<Tabs tabs={VIEWS} />);
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("tabIndex", "0");
    expect(screen.getByRole("tab", { name: "States" })).toHaveAttribute("tabIndex", "-1");
    expect(screen.getByRole("tab", { name: "Usage" })).toHaveAttribute("tabIndex", "-1");
  });

  it("clicking a tab selects it and swaps the panel", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={VIEWS} />);
    await user.click(screen.getByRole("tab", { name: "Usage" }));
    expect(screen.getByRole("tab", { name: "Usage" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Usage panel");
  });

  it("the panel is labelled by its own tab (Accessibility 'Tablist and panel')", () => {
    render(<Tabs tabs={VIEWS} />);
    const tab = screen.getByRole("tab", { name: "Overview" });
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    expect(tab).toHaveAttribute("aria-controls", panel.id);
  });

  it("ArrowRight moves to the next tab and selects it as it goes", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={VIEWS} />);
    await user.click(screen.getByRole("tab", { name: "Overview" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "States" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "States" })).toHaveFocus();
  });

  it("ArrowLeft from the first tab wraps to the last", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={VIEWS} />);
    await user.click(screen.getByRole("tab", { name: "Overview" }));
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Usage" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Usage" })).toHaveFocus();
  });

  it("Home and End jump to the ends (Accessibility 'Arrows move, Tab leaves')", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={VIEWS} defaultValue="states" />);
    await user.click(screen.getByRole("tab", { name: "States" }));
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Usage" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
  });

  it("stays controlled by the value prop rather than its own state", async () => {
    const user = userEvent.setup();
    let seen = "overview";
    render(
      <Tabs
        tabs={VIEWS}
        value={seen}
        onChange={(next) => {
          seen = next;
        }}
      />,
    );
    await user.click(screen.getByRole("tab", { name: "Usage" }));
    expect(seen).toBe("usage");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
  });

  it("shows a count in --faint after the label when given (Content rule 'A count is allowed')", () => {
    render(<Tabs tabs={[{ value: "alerts", label: "Alerts", count: 3, panel: "Alerts panel" }]} />);
    const tab = screen.getByRole("tab", { name: "Alerts 3" });
    expect(tab).toBeInTheDocument();
  });
});
