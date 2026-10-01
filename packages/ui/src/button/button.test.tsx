import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it.each(["primary", "secondary", "ghost", "danger"] as const)(
    "renders a real button for the %s variant",
    (variant) => {
      render(<Button variant={variant}>Run pipeline</Button>);
      expect(screen.getByRole("button", { name: "Run pipeline" })).toBeInTheDocument();
    },
  );

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button variant="primary" onClick={onClick}>
        Save
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders a leading icon", () => {
    render(
      <Button variant="secondary" icon={<svg data-testid="icon" />}>
        Run pipeline
      </Button>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("stays in the tab order and reachable by keyboard when disabled, rather than being removed", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button variant="primary" disabled onClick={onClick}>
        Delete workspace
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Delete workspace" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toHaveAttribute("disabled");

    button.focus();
    expect(button).toHaveFocus();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("is a real button, not a styled div, so it's a native tab stop and fires on Enter/Space", () => {
    render(<Button variant="ghost">Cancel</Button>);
    expect(screen.getByRole("button", { name: "Cancel" }).tagName).toBe("BUTTON");
  });

  it("defaults to type=button so it never submits an enclosing form", () => {
    render(<Button variant="primary">Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });
});
