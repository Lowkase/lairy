import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Radio } from "./radio";

const RETRY_OPTIONS = [
  { value: "every-run", label: "Every run" },
  { value: "failures-only", label: "Failures only" },
  { value: "never", label: "Never" },
];

describe("Radio", () => {
  it("renders a real radiogroup labelled by its question", () => {
    render(<Radio label="Notify me about" name="notify" options={RETRY_OPTIONS} />);
    const group = screen.getByRole("radiogroup", { name: "Notify me about" });
    expect(group).toBeInTheDocument();
  });

  it("renders every option as a real <input type=radio> tied to a bound label", () => {
    render(<Radio name="retry-policy" options={RETRY_OPTIONS} />);
    for (const option of RETRY_OPTIONS) {
      const input = screen.getByLabelText(option.label);
      expect(input.tagName).toBe("INPUT");
      expect(input).toHaveAttribute("type", "radio");
    }
  });

  it("ships with a default selected and never starts with nothing chosen", () => {
    render(<Radio name="retry-policy" defaultValue="every-run" options={RETRY_OPTIONS} />);
    expect(screen.getByLabelText("Every run")).toBeChecked();
    expect(screen.getByLabelText("Failures only")).not.toBeChecked();
    expect(screen.getByLabelText("Never")).not.toBeChecked();
  });

  it("can render with nothing chosen (the bad-empty-group example)", () => {
    render(<Radio name="retry-policy" options={RETRY_OPTIONS} />);
    for (const option of RETRY_OPTIONS) {
      expect(screen.getByLabelText(option.label)).not.toBeChecked();
    }
  });

  it("choosing one option is exclusive — the previous choice clears", async () => {
    const user = userEvent.setup();
    render(<Radio name="retry-policy" defaultValue="every-run" options={RETRY_OPTIONS} />);
    await user.click(screen.getByLabelText("Never"));
    expect(screen.getByLabelText("Never")).toBeChecked();
    expect(screen.getByLabelText("Every run")).not.toBeChecked();
  });

  it("clicking the label row selects the option, not only the dial", async () => {
    const user = userEvent.setup();
    render(<Radio name="retry-policy" options={RETRY_OPTIONS} />);
    await user.click(screen.getByText("Never"));
    expect(screen.getByLabelText("Never")).toBeChecked();
  });

  it("stays controlled by the value prop rather than its own state", async () => {
    const user = userEvent.setup();
    let seen = "every-run";
    render(
      <Radio
        name="retry-policy"
        value={seen}
        options={RETRY_OPTIONS}
        onChange={(next) => {
          seen = next;
        }}
      />,
    );
    expect(screen.getByLabelText("Every run")).toBeChecked();
    await user.click(screen.getByLabelText("Never"));
    expect(seen).toBe("never");
  });

  it("shows the description and ties it to the option via aria-describedby", () => {
    render(
      <Radio
        name="validation-speed"
        options={[
          { value: "fastest", label: "Fastest", description: "Skips validation" },
          { value: "safest", label: "Safest" },
        ]}
      />,
    );
    const input = screen.getByLabelText("Fastest");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(screen.getByText("Skips validation").id).toBe(describedBy);
    expect(screen.getByLabelText("Safest")).not.toHaveAttribute("aria-describedby");
  });

  it("sets aria-invalid on every option when error is set, and clears it when not", () => {
    const { rerender } = render(<Radio name="retry-policy" error options={RETRY_OPTIONS} />);
    for (const option of RETRY_OPTIONS) {
      expect(screen.getByLabelText(option.label)).toHaveAttribute("aria-invalid", "true");
    }

    rerender(<Radio name="retry-policy" options={RETRY_OPTIONS} />);
    for (const option of RETRY_OPTIONS) {
      expect(screen.getByLabelText(option.label)).not.toHaveAttribute("aria-invalid");
    }
  });

  it("disables every option when the group is disabled", () => {
    render(<Radio name="retry-policy" disabled options={RETRY_OPTIONS} />);
    for (const option of RETRY_OPTIONS) {
      expect(screen.getByLabelText(option.label)).toBeDisabled();
    }
  });

  it("disables one locked option without disabling the rest", () => {
    render(
      <Radio
        name="retry-policy"
        options={[
          { value: "every-run", label: "Every run" },
          { value: "never", label: "Never", disabled: true },
        ]}
      />,
    );
    expect(screen.getByLabelText("Every run")).not.toBeDisabled();
    expect(screen.getByLabelText("Never")).toBeDisabled();
  });

  it("gives every option the same name, so the browser enforces one choice", () => {
    render(<Radio name="retry-policy" options={RETRY_OPTIONS} />);
    for (const option of RETRY_OPTIONS) {
      expect(screen.getByLabelText(option.label)).toHaveAttribute("name", "retry-policy");
    }
  });
});
