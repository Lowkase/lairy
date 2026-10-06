import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { Header } from "./header";

function renderHeader(props: Partial<ComponentProps<typeof Header>> = {}) {
  return render(
    <Header
      moduleIcon={<span>icon</span>}
      moduleLabel="Components"
      moduleCode="SYS·02"
      date="WED 23 AUG 2026"
      time="14:02:07"
      identityLabel="Appearance"
      theme="dark"
      onThemeChange={() => {}}
      {...props}
    />,
  );
}

describe("Header", () => {
  it("is the page's banner, not a nav (Accessibility 'Banner, not nav')", () => {
    renderHeader();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("names the selected module", () => {
    renderHeader();
    expect(screen.getByText("COMPONENTS")).toBeInTheDocument();
    expect(screen.getByText("SYS·02")).toBeInTheDocument();
  });

  it("shows the ambient date and clock as plain, read-only text", () => {
    renderHeader();
    expect(screen.getByText("WED 23 AUG 2026")).toBeInTheDocument();
    expect(screen.getByText("14:02:07")).toBeInTheDocument();
  });

  it("the identity control carries an accessible name (Accessibility 'Named identity control')", () => {
    renderHeader({ identityLabel: "Aria", identityStatus: "active" });
    expect(screen.getByRole("button", { name: "Aria, active" })).toBeInTheDocument();
  });

  it("opens the menu on click and moves focus into it", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: "Appearance" }));
    expect(screen.getByRole("button", { name: "Theme: dark" })).toHaveFocus();
  });

  it("calls onThemeChange and closes the menu when a theme is chosen", async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();
    renderHeader({ onThemeChange });
    await user.click(screen.getByRole("button", { name: "Appearance" }));
    await user.click(screen.getByRole("button", { name: "Theme: light" }));
    expect(onThemeChange).toHaveBeenCalledWith("light");
    expect(screen.queryByRole("button", { name: "Theme: light" })).not.toBeInTheDocument();
  });

  it("marks the current theme with aria-pressed", async () => {
    const user = userEvent.setup();
    renderHeader({ theme: "light" });
    await user.click(screen.getByRole("button", { name: "Appearance" }));
    expect(screen.getByRole("button", { name: "Theme: light" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Theme: dark" })).toHaveAttribute("aria-pressed", "false");
  });

  it("Escape closes the menu and restores focus to the trigger", async () => {
    const user = userEvent.setup();
    renderHeader();
    const trigger = screen.getByRole("button", { name: "Appearance" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("button", { name: /Theme:/ })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("Tab from the last focusable item cycles back to the first (focus trap)", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: "Appearance" }));
    const dark = screen.getByRole("button", { name: "Theme: dark" });
    const light = screen.getByRole("button", { name: "Theme: light" });
    expect(dark).toHaveFocus();
    await user.tab();
    expect(light).toHaveFocus();
    await user.tab();
    expect(dark).toHaveFocus();
  });

  it("renders extra menu items and calls onSelect", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderHeader({ menuItems: [{ id: "prefs", label: "Preferences", onSelect }] });
    await user.click(screen.getByRole("button", { name: "Appearance" }));
    await user.click(screen.getByRole("button", { name: "Preferences" }));
    expect(onSelect).toHaveBeenCalled();
  });

  it("compact hides the date, clock and module code but keeps the identity control (Phone shell, LDS-037)", () => {
    renderHeader({ compact: true });
    expect(screen.queryByText("WED 23 AUG 2026")).not.toBeInTheDocument();
    expect(screen.queryByText("14:02:07")).not.toBeInTheDocument();
    expect(screen.queryByText("SYS·02")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Appearance" })).toBeInTheDocument();
  });

  it("renders a trailing action before the identity button", () => {
    renderHeader({ trailingAction: <button type="button">Pages</button> });
    expect(screen.getByRole("button", { name: "Pages" })).toBeInTheDocument();
  });
});
