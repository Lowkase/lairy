import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Callout } from "./callout";

describe("Callout", () => {
  it("renders the title and body", () => {
    render(
      <Callout tone="info" title="Sync scheduled">
        Nightly export will run at 02:00 UTC.
      </Callout>,
    );

    expect(screen.getByText("Sync scheduled")).toBeInTheDocument();
    expect(screen.getByText("Nightly export will run at 02:00 UTC.")).toBeInTheDocument();
  });

  it.each([
    ["info", "status"],
    ["success", "status"],
    ["warning", "alert"],
    ["error", "alert"],
  ] as const)("uses role=%s -> %s so assistive tech announces it correctly", (tone, role) => {
    render(
      <Callout tone={tone} title="Title">
        Body
      </Callout>,
    );

    expect(screen.getByRole(role)).toBeInTheDocument();
  });

  it("renders no actions when none are given", () => {
    render(
      <Callout tone="info" title="Title">
        Body
      </Callout>,
    );

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders each action and calls its handler on click, primary first", async () => {
    const onRetry = vi.fn();
    const onViewLog = vi.fn();
    const user = userEvent.setup();

    render(
      <Callout
        tone="error"
        title="Export failed"
        actions={[
          { label: "Retry export", onClick: onRetry },
          { label: "View log", onClick: onViewLog },
        ]}
      >
        The nightly export stopped after 3 of 6 regions.
      </Callout>,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual(["Retry export", "View log"]);

    await user.click(screen.getByRole("button", { name: "Retry export" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onViewLog).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "View log" }));
    expect(onViewLog).toHaveBeenCalledTimes(1);
  });

  it("never auto-dismisses: the callout stays in the DOM over time", async () => {
    render(
      <Callout tone="warning" title="Approaching rate limit">
        Signal throughput is at 92% of the hourly cap.
      </Callout>,
    );

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.getByText("Approaching rate limit")).toBeInTheDocument();
  });
});
