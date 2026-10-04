import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("ties the visible label to the field by a real <label for>", () => {
    render(<Checkbox label="Send weekly digest" />);
    const input = screen.getByLabelText("Send weekly digest");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("type", "checkbox");
  });

  it("shows the description and ties it to the field via aria-describedby", () => {
    render(<Checkbox label="Send weekly digest" description="Monday 09:00, to every workspace owner." />);
    const input = screen.getByLabelText("Send weekly digest");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(screen.getByText("Monday 09:00, to every workspace owner.").id).toBe(describedBy);
  });

  it("has no aria-describedby without a description", () => {
    render(<Checkbox label="Send weekly digest" />);
    expect(screen.getByLabelText("Send weekly digest")).not.toHaveAttribute("aria-describedby");
  });

  it("toggles on click for an uncontrolled checkbox", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Include archived runs" />);
    const input = screen.getByLabelText("Include archived runs");
    expect(input).not.toBeChecked();
    await user.click(input);
    expect(input).toBeChecked();
  });

  it("toggles on click of the label text, not only the box", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Include archived runs" />);
    await user.click(screen.getByText("Include archived runs"));
    expect(screen.getByLabelText("Include archived runs")).toBeChecked();
  });

  it("stays controlled by the checked prop rather than its own state", async () => {
    const user = userEvent.setup();
    let seen = false;
    render(
      <Checkbox
        label="Include archived runs"
        checked={seen}
        onChange={(event) => {
          seen = event.target.checked;
        }}
      />,
    );
    const input = screen.getByLabelText("Include archived runs");
    expect(input).not.toBeChecked();
    await user.click(input);
    expect(seen).toBe(true);
  });

  it("sets the indeterminate DOM property, never checked, and never as a result of a click", () => {
    render(<Checkbox label="All workspaces" indeterminate />);
    const input = screen.getByLabelText("All workspaces") as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input.checked).toBe(false);
  });

  it("sets aria-invalid when error is set, and clears it when not", () => {
    const { rerender } = render(<Checkbox label="Agree to terms" error />);
    expect(screen.getByLabelText("Agree to terms")).toHaveAttribute("aria-invalid", "true");

    rerender(<Checkbox label="Agree to terms" />);
    expect(screen.getByLabelText("Agree to terms")).not.toHaveAttribute("aria-invalid");
  });

  it("is a native, disabled field — not editable, removed from the tab order", () => {
    render(<Checkbox label="Send weekly digest" disabled />);
    expect(screen.getByLabelText("Send weekly digest")).toBeDisabled();
  });
});
