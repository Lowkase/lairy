import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("ties the visible label to the field by a real <label for>", () => {
    render(<Textarea label="Why it was skipped" />);
    const field = screen.getByLabelText("Why it was skipped");
    expect(field.tagName).toBe("TEXTAREA");
  });

  it("defaults rows to 3", () => {
    render(<Textarea label="Why it was skipped" />);
    expect(screen.getByLabelText("Why it was skipped")).toHaveAttribute("rows", "3");
  });

  it("honours an explicit rows override", () => {
    render(<Textarea label="Why it was skipped" rows={1} />);
    expect(screen.getByLabelText("Why it was skipped")).toHaveAttribute("rows", "1");
  });

  it("never renders a native maxLength, so typing is never silently blocked", () => {
    render(<Textarea label="Why it was skipped" limit={10} />);
    expect(screen.getByLabelText("Why it was skipped")).not.toHaveAttribute("maxlength");
  });

  it("shows the counter unconditionally once limit is set, with no separate toggle", () => {
    render(<Textarea label="Why it was skipped" limit={512} />);
    expect(screen.getByText("0/512")).toBeInTheDocument();
  });

  it("shows no counter without limit", () => {
    render(<Textarea label="Why it was skipped" />);
    expect(screen.queryByText(/\/\d/)).not.toBeInTheDocument();
  });

  it("counts up live as the operator types, for an uncontrolled field", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Why it was skipped" limit={10} />);
    await user.type(screen.getByLabelText("Why it was skipped"), "abc");
    expect(screen.getByText("3/10")).toBeInTheDocument();
  });

  it("turns the counter and shows an auto-generated trim message once over the limit", () => {
    render(<Textarea label="Why it was skipped" limit={512} defaultValue={"a".repeat(528)} />);
    expect(screen.getByText("528 characters — trim 16")).toBeInTheDocument();
    expect(screen.getByText("528/512")).toBeInTheDocument();
    expect(screen.getByLabelText("Why it was skipped")).toHaveAttribute("aria-invalid", "true");
  });

  it("lets an explicit error override the auto-generated over-limit message", () => {
    render(
      <Textarea label="Why it was skipped" limit={512} defaultValue={"a".repeat(528)} error="Required" />,
    );
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.queryByText(/trim/)).not.toBeInTheDocument();
  });

  it("replaces the hint with the error, in the same slot, and ties it via aria-describedby", () => {
    render(<Textarea label="Why it was skipped" hint="Plain text, no formatting" error="Required" />);
    expect(screen.queryByText("Plain text, no formatting")).not.toBeInTheDocument();
    const field = screen.getByLabelText("Why it was skipped");
    expect(screen.getByText("Required").id).toBe(field.getAttribute("aria-describedby"));
  });

  it("is a native, disabled field", () => {
    render(<Textarea label="Why it was skipped" disabled defaultValue="Locked" />);
    expect(screen.getByLabelText("Why it was skipped")).toBeDisabled();
  });

  it("inserts a newline on Enter rather than submitting (native textarea behaviour)", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Why it was skipped" />);
    const field = screen.getByLabelText("Why it was skipped") as HTMLTextAreaElement;
    await user.type(field, "a{Enter}b");
    expect(field.value).toBe("a\nb");
  });
});
