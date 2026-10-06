import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Popover,
  PopoverContent,
  PopoverDetailLink,
  PopoverDetailRow,
  PopoverMenu,
  PopoverMenuContent,
  PopoverMenuItem,
  PopoverMenuSeparator,
  PopoverMenuTrigger,
  PopoverTrigger,
} from "./popover";

function renderMenu() {
  const onSelect = vi.fn();
  render(
    <PopoverMenu>
      <PopoverMenuTrigger>Actions</PopoverMenuTrigger>
      <PopoverMenuContent>
        <PopoverMenuItem>Rename</PopoverMenuItem>
        <PopoverMenuItem>Duplicate</PopoverMenuItem>
        <PopoverMenuSeparator />
        <PopoverMenuItem destructive onSelect={onSelect}>
          Delete
        </PopoverMenuItem>
      </PopoverMenuContent>
    </PopoverMenu>,
  );
  return { onSelect };
}

function renderDetail() {
  render(
    <Popover>
      <PopoverTrigger>Run 4471</PopoverTrigger>
      <PopoverContent>
        <PopoverDetailRow label="Owner" value="Aria" />
        <PopoverDetailLink href="#">Open run →</PopoverDetailLink>
      </PopoverContent>
    </Popover>,
  );
}

describe("PopoverMenu", () => {
  it("the trigger carries aria-haspopup and aria-expanded (Accessibility 'Menu semantics')", () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens a role=menu of role=menuitem rows on click, and the trigger reports aria-expanded=true", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Actions" }));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute("aria-expanded", "true");
  });

  it("focus moves into the panel on open (Accessibility 'Focus moves and returns')", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Actions" }));

    const menu = screen.getByRole("menu");
    await waitFor(() => expect(menu.contains(document.activeElement)).toBe(true));
  });

  it("selecting a row fires its handler and closes the panel (Rules 'Rows act')", async () => {
    const user = userEvent.setup();
    const { onSelect } = renderMenu();
    await user.click(screen.getByRole("button", { name: "Actions" }));

    await user.click(screen.getByRole("menuitem", { name: "Delete" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("Escape closes it and returns focus to the trigger (Accessibility 'Escape and outside click')", async () => {
    const user = userEvent.setup();
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("a destructive row never ships bare alarm text (Accessibility 'Destructive is spoken')", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Actions" }));

    const destructiveRow = screen.getByRole("menuitem", { name: "Delete" });
    expect(destructiveRow.className).toContain("text-fg");
    expect(destructiveRow.className).not.toContain("text-alarm");
    expect(destructiveRow).toHaveAttribute("data-variant", "destructive");
  });

  it("is never modal — the page keeps no aria-hidden applied to it while open (boundary: 'never blocks the page behind it')", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Elsewhere</button>
        {(() => {
          renderMenu();
          return null;
        })()}
      </div>,
    );
    await user.click(screen.getByRole("button", { name: "Actions" }));

    expect(screen.getByRole("button", { name: "Elsewhere" })).not.toHaveAttribute("aria-hidden");
  });
});

describe("Popover (Detail kind)", () => {
  it("the panel is hidden until the trigger is clicked", () => {
    renderDetail();
    expect(screen.queryByText("Owner")).not.toBeInTheDocument();
  });

  it("shows its field rows and one link out on click", async () => {
    const user = userEvent.setup();
    renderDetail();
    await user.click(screen.getByRole("button", { name: "Run 4471" }));

    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByText("Aria")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open run →" })).toBeInTheDocument();
  });

  it("Escape closes it and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderDetail();
    const trigger = screen.getByRole("button", { name: "Run 4471" });
    await user.click(trigger);
    expect(screen.getByText("Owner")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByText("Owner")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});
