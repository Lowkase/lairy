import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./select";

const OPTIONS = [
  { value: "ingest", label: "Ingest" },
  { value: "normalize", label: "Normalize" },
  { value: "summarize", label: "Summarize" },
];

function renderSelect(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  return render(<Select label="Stage" placeholder="Choose a stage" options={OPTIONS} {...props} />);
}

describe("Select", () => {
  it("is a combobox named by its visible label (Accessibility 'Combobox and listbox')", () => {
    renderSelect();
    const field = screen.getByRole("combobox", { name: "Stage" });
    expect(field).toHaveAttribute("aria-expanded", "false");
  });

  it("shows the placeholder when nothing is chosen, and the chosen option's own words otherwise", () => {
    const { unmount } = renderSelect();
    expect(screen.getByRole("combobox")).toHaveTextContent("Choose a stage");
    unmount();

    renderSelect({ defaultValue: "normalize" });
    expect(screen.getByRole("combobox")).toHaveTextContent("Normalize");
  });

  it("opens a listbox of options with the current one selected", async () => {
    const user = userEvent.setup();
    renderSelect({ defaultValue: "normalize" });
    const field = screen.getByRole("combobox");

    await user.click(field);
    expect(field).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Normalize" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Ingest" })).toHaveAttribute("aria-selected", "false");
  });

  it("commits on the click: selecting closes the menu and updates the field", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderSelect({ onValueChange });

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Summarize" }));

    expect(onValueChange).toHaveBeenCalledWith("summarize");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Summarize");
  });

  it("Enter opens the menu from the keyboard, arrows move, Enter commits", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderSelect({ defaultValue: "ingest", onValueChange });

    await user.tab();
    expect(screen.getByRole("combobox")).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("normalize");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("moves focus into the menu, and Escape closes it, returns focus to the field and keeps the old value", async () => {
    const user = userEvent.setup();
    renderSelect({ defaultValue: "ingest" });
    const field = screen.getByRole("combobox");

    await user.click(field);
    expect(screen.getByRole("listbox")).toContainElement(document.activeElement as HTMLElement);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(field).toHaveFocus();
    expect(field).toHaveTextContent("Ingest");
  });

  it("ties the error to the field with aria-describedby and sets aria-invalid", () => {
    renderSelect({ error: "Stage is required" });
    const field = screen.getByRole("combobox");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Stage is required").id).toBe(field.getAttribute("aria-describedby"));
  });

  it("has no aria-invalid or aria-describedby without an error", () => {
    renderSelect();
    const field = screen.getByRole("combobox");
    expect(field).not.toHaveAttribute("aria-invalid");
    expect(field).not.toHaveAttribute("aria-describedby");
  });

  it("is a real disabled control that cannot open", async () => {
    const user = userEvent.setup();
    renderSelect({ disabled: true, defaultValue: "ingest" });
    const field = screen.getByRole("combobox");
    expect(field).toBeDisabled();
    expect(field).toHaveTextContent("Ingest");

    await user.click(field);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("skips a disabled option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderSelect({
      onValueChange,
      options: [...OPTIONS.slice(0, 2), { value: "summarize", label: "Summarize", disabled: true }],
    });

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Summarize" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
