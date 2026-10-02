import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextInput } from "./text-input";

describe("TextInput", () => {
  it("ties the visible label to the field by a real <label for>", () => {
    render(<TextInput label="Pipeline name" />);
    const input = screen.getByLabelText("Pipeline name");
    expect(input.tagName).toBe("INPUT");
  });

  it("shows the hint and ties it to the field via aria-describedby", () => {
    render(<TextInput label="Pipeline name" hint="Lowercase, no spaces" />);
    const input = screen.getByLabelText("Pipeline name");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(screen.getByText("Lowercase, no spaces").id).toBe(describedBy);
  });

  it("replaces the hint with the error, in the same slot, and sets aria-invalid", () => {
    render(<TextInput label="Pipeline name" hint="Lowercase, no spaces" error="Spaces are not allowed" />);
    expect(screen.queryByText("Lowercase, no spaces")).not.toBeInTheDocument();
    const input = screen.getByLabelText("Pipeline name");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Spaces are not allowed").id).toBe(input.getAttribute("aria-describedby"));
  });

  it("has no aria-invalid and no aria-describedby with neither hint nor error", () => {
    render(<TextInput label="Pipeline name" />);
    const input = screen.getByLabelText("Pipeline name");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("counts up toward maxLength as the operator types, for an uncontrolled field", async () => {
    const user = userEvent.setup();
    render(<TextInput label="Pipeline name" maxLength={10} showCounter />);
    expect(screen.getByText("0/10")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Pipeline name"), "abc");
    expect(screen.getByText("3/10")).toBeInTheDocument();
  });

  it("counts from the controlled value rather than its own state", () => {
    render(<TextInput label="Pipeline name" value="nightly" maxLength={20} showCounter onChange={() => {}} />);
    expect(screen.getByText("7/20")).toBeInTheDocument();
  });

  it("shows no counter without maxLength, even when showCounter is set", () => {
    render(<TextInput label="Pipeline name" showCounter />);
    expect(screen.queryByText(/\/\d/)).not.toBeInTheDocument();
  });

  it("is a native, disabled field — not editable, removed from the tab order", () => {
    render(<TextInput label="Pipeline name" disabled defaultValue="Locked" />);
    const input = screen.getByLabelText("Pipeline name");
    expect(input).toBeDisabled();
  });

  it("fires onChange with the real DOM event for a controlled consumer", async () => {
    const user = userEvent.setup();
    let seen = "";
    render(
      <TextInput
        label="Pipeline name"
        value={seen}
        onChange={(event) => {
          seen = event.target.value;
        }}
      />,
    );
    await user.type(screen.getByLabelText("Pipeline name"), "a");
    expect(seen).toBe("a");
  });
});
