import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Switch } from "./switch";

describe("Switch", () => {
  it("ties the visible label to the field by a real <label for>", () => {
    render(<Switch label="Auto-retry failed runs" />);
    const input = screen.getByLabelText("Auto-retry failed runs");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("type", "checkbox");
  });

  it("exposes role=switch, overriding the native checkbox role", () => {
    render(<Switch label="Auto-retry failed runs" />);
    expect(screen.getByRole("switch", { name: "Auto-retry failed runs" })).toBeInTheDocument();
  });

  it("shows the description and ties it to the field via aria-describedby", () => {
    render(<Switch label="Auto-retry failed runs" description="Retries twice, then stops and notifies." />);
    const input = screen.getByLabelText("Auto-retry failed runs");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(screen.getByText("Retries twice, then stops and notifies.").id).toBe(describedBy);
  });

  it("has no aria-describedby without a description", () => {
    render(<Switch label="Auto-retry failed runs" />);
    expect(screen.getByLabelText("Auto-retry failed runs")).not.toHaveAttribute("aria-describedby");
  });

  it("toggles on click for an uncontrolled switch", async () => {
    const user = userEvent.setup();
    render(<Switch label="Auto-retry failed runs" />);
    const input = screen.getByLabelText("Auto-retry failed runs");
    expect(input).not.toBeChecked();
    await user.click(input);
    expect(input).toBeChecked();
  });

  it("toggles on click of the label text, not only the track", async () => {
    const user = userEvent.setup();
    render(<Switch label="Auto-retry failed runs" />);
    await user.click(screen.getByText("Auto-retry failed runs"));
    expect(screen.getByLabelText("Auto-retry failed runs")).toBeChecked();
  });

  it("toggles on Space, the row being one tab stop (Accessibility 'Space toggles')", async () => {
    const user = userEvent.setup();
    render(<Switch label="Auto-retry failed runs" />);
    const input = screen.getByLabelText("Auto-retry failed runs");
    input.focus();
    await user.keyboard(" ");
    expect(input).toBeChecked();
  });

  it("stays controlled by the checked prop rather than its own state", async () => {
    const user = userEvent.setup();
    let seen = false;
    render(
      <Switch
        label="Auto-retry failed runs"
        checked={seen}
        onChange={(event) => {
          seen = event.target.checked;
        }}
      />,
    );
    const input = screen.getByLabelText("Auto-retry failed runs");
    expect(input).not.toBeChecked();
    await user.click(input);
    expect(seen).toBe(true);
  });

  it("is a native, disabled field — not editable, removed from the tab order", () => {
    render(<Switch label="Auto-retry failed runs" disabled />);
    expect(screen.getByLabelText("Auto-retry failed runs")).toBeDisabled();
  });

  it("stays checked when disabled on (States 'Disabled on')", () => {
    render(<Switch label="Auto-retry failed runs" disabled defaultChecked />);
    const input = screen.getByLabelText("Auto-retry failed runs") as HTMLInputElement;
    expect(input).toBeDisabled();
    expect(input).toBeChecked();
  });
});
