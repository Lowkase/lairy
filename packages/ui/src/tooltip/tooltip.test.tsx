import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tooltip } from "./tooltip";

function renderTooltip(content = "Duplicate run · D") {
  return render(
    <Tooltip content={content}>
      <button type="button">Duplicate run</button>
    </Tooltip>,
  );
}

describe("Tooltip", () => {
  it("renders the bubble as role=tooltip, linked to the trigger via aria-describedby", () => {
    renderTooltip();
    const trigger = screen.getByRole("button", { name: "Duplicate run" });
    const bubble = screen.getByRole("tooltip", { hidden: true });
    expect(trigger).toHaveAttribute("aria-describedby", bubble.id);
    expect(bubble).toHaveTextContent("Duplicate run · D");
  });

  it("stays hidden until the trigger is hovered (Rules 'Delay in, none out')", () => {
    renderTooltip();
    const bubble = screen.getByRole("tooltip", { hidden: true });
    expect(bubble.className).toContain("opacity-0");
  });

  it("shows on hover only after the 400ms delay, not before", async () => {
    const user = userEvent.setup();
    renderTooltip();
    const trigger = screen.getByRole("button", { name: "Duplicate run" });
    const bubble = screen.getByRole("tooltip", { hidden: true });

    await user.hover(trigger);
    expect(bubble.className).toContain("opacity-0");

    await waitFor(() => expect(bubble.className).toContain("opacity-100"), { timeout: 1000 });
  });

  it("hides instantly on mouse leave, with no delay (Rules 'Delay in, none out')", async () => {
    const user = userEvent.setup();
    renderTooltip();
    const trigger = screen.getByRole("button", { name: "Duplicate run" });
    const bubble = screen.getByRole("tooltip", { hidden: true });

    await user.hover(trigger);
    await waitFor(() => expect(bubble.className).toContain("opacity-100"), { timeout: 1000 });

    await user.unhover(trigger);
    expect(bubble.className).toContain("opacity-0");
  });

  it("shows immediately on keyboard focus, with no delay (Accessibility 'Keyboard shows it too')", async () => {
    const user = userEvent.setup();
    renderTooltip();
    const bubble = screen.getByRole("tooltip", { hidden: true });

    await user.tab();
    expect(bubble.className).toContain("opacity-100");
  });

  it("Escape dismisses it and leaves focus on the trigger (Accessibility 'Keyboard shows it too')", async () => {
    const user = userEvent.setup();
    renderTooltip();
    const trigger = screen.getByRole("button", { name: "Duplicate run" });
    const bubble = screen.getByRole("tooltip", { hidden: true });

    await user.tab();
    expect(bubble.className).toContain("opacity-100");
    expect(trigger).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(bubble.className).toContain("opacity-0");
    expect(trigger).toHaveFocus();
  });

  it("hides on blur", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Tooltip content="Duplicate run · D">
          <button type="button">Duplicate run</button>
        </Tooltip>
        <button type="button">Elsewhere</button>
      </div>,
    );
    const bubble = screen.getByRole("tooltip", { hidden: true });

    await user.tab();
    expect(bubble.className).toContain("opacity-100");

    await user.tab();
    expect(bubble.className).toContain("opacity-0");
  });

  it("the bubble never carries pointer events (Rules 'No pointer events')", () => {
    renderTooltip();
    const bubble = screen.getByRole("tooltip", { hidden: true });
    expect(bubble.className).toContain("pointer-events-none");
  });

  it("the bubble never wraps (anatomy 'Label' — white-space:nowrap)", () => {
    renderTooltip();
    const bubble = screen.getByRole("tooltip", { hidden: true });
    expect(bubble.className).toContain("whitespace-nowrap");
  });

  it("preserves a handler already set on the trigger", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Tooltip content="Duplicate run · D">
        <button type="button" onClick={onClick}>
          Duplicate run
        </button>
      </Tooltip>,
    );
    await user.click(screen.getByRole("button", { name: "Duplicate run" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
