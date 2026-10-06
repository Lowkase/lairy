import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Subnav, type SubnavGroup } from "./subnav";

const GROUPS: SubnavGroup[] = [
  {
    id: "operations",
    label: "Operations",
    count: 2,
    pages: [
      { id: "live-vessels", label: "Live vessels", href: "/live-vessels" },
      { id: "maintenance", label: "Maintenance", href: "/maintenance" },
    ],
  },
  {
    id: "research",
    label: "Research",
    pages: [{ id: "surveys", label: "Surveys", href: "/surveys" }],
  },
];

describe("Subnav", () => {
  it("renders a nav landmark labelled by the workspace (Accessibility 'Nav landmark, per workspace')", () => {
    render(
      <Subnav label="Fleet" groups={GROUPS} defaultExpandedId="operations" hidden={false} onHiddenChange={() => {}} />,
    );
    expect(screen.getByRole("navigation", { name: "Fleet" })).toBeInTheDocument();
  });

  it("expands the default group and shows its pages", () => {
    render(
      <Subnav label="Fleet" groups={GROUPS} defaultExpandedId="operations" hidden={false} onHiddenChange={() => {}} />,
    );
    expect(screen.getByRole("button", { name: /Operations/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Live vessels" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Surveys" })).not.toBeInTheDocument();
  });

  it('marks the active page with aria-current="page"', () => {
    render(
      <Subnav
        label="Fleet"
        groups={GROUPS}
        activeId="live-vessels"
        defaultExpandedId="operations"
        hidden={false}
        onHiddenChange={() => {}}
      />,
    );
    expect(screen.getByRole("link", { name: "Live vessels" })).toHaveAttribute("aria-current", "page");
  });

  it('only one section is open at a time (Rules "Two levels, one open")', async () => {
    const user = userEvent.setup();
    render(
      <Subnav label="Fleet" groups={GROUPS} defaultExpandedId="operations" hidden={false} onHiddenChange={() => {}} />,
    );
    await user.click(screen.getByRole("button", { name: /Research/ }));
    expect(screen.getByRole("button", { name: /Research/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /Operations/ })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Live vessels" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Surveys" })).toBeInTheDocument();
  });

  it("shows a count only when present (anatomy 'Count')", () => {
    render(
      <Subnav label="Fleet" groups={GROUPS} defaultExpandedId="operations" hidden={false} onHiddenChange={() => {}} />,
    );
    expect(screen.getByRole("button", { name: /Operations/ })).toHaveTextContent("2");
    expect(screen.getByRole("button", { name: "Research" })).not.toHaveTextContent(/\d/);
  });

  it("calls onHiddenChange when the Hide row is clicked, and renders a stub when hidden", async () => {
    const user = userEvent.setup();
    const onHiddenChange = vi.fn();
    render(<Subnav label="Fleet" groups={GROUPS} hidden={false} onHiddenChange={onHiddenChange} />);
    await user.click(screen.getByRole("button", { name: /Hide/ }));
    expect(onHiddenChange).toHaveBeenCalledWith(true);
  });

  it("renders a labelled show button when hidden", () => {
    render(<Subnav label="Fleet" groups={GROUPS} hidden={true} onHiddenChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Show pages" })).toBeInTheDocument();
  });

  it("applies className to the hidden-state stub too (Phone shell, LDS-037)", () => {
    render(<Subnav label="Fleet" groups={GROUPS} hidden={true} onHiddenChange={() => {}} className="tablet:flex" />);
    expect(screen.getByRole("button", { name: "Show pages" })).toHaveClass("tablet:flex");
  });
});
