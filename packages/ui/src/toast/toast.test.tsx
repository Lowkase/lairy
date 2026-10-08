import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dismissToast, Toast, Toaster, toast } from "./toast";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  act(() => dismissToast());
  vi.useRealTimers();
});

function fire(fn: () => void) {
  act(fn);
}

describe("Toast", () => {
  it("renders the title, the detail and a Dismiss button", () => {
    render(<Toast intent="success" title="Workflow approved" detail="Export resumed · 7 queued items cleared" />);
    expect(screen.getByText("Workflow approved")).toBeInTheDocument();
    expect(screen.getByText(/7 queued items cleared/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("announces failures assertively and everything else politely (Accessibility 'Announced, never focused')", () => {
    render(
      <>
        <Toast intent="success" title="Workflow approved" />
        <Toast intent="info" title="Sync scheduled" />
        <Toast intent="neutral" title="Draft saved" />
        <Toast intent="fail" title="Run failed" />
      </>,
    );
    expect(screen.getAllByRole("status")).toHaveLength(3);
    expect(screen.getByRole("alert")).toHaveTextContent("Run failed");
  });

  it("carries the intent in the rail and the dot as well as the colour", () => {
    render(<Toast intent="fail" title="Run failed" />);
    expect(document.querySelector('[data-slot="toast-rail"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="toast-dot"]')).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveAttribute("data-intent", "fail");
  });

  it("renders one optional action link on a failure", () => {
    render(<Toast intent="fail" title="Run failed" action={{ label: "View log", href: "/runs/42" }} />);
    expect(screen.getByRole("link", { name: "View log" })).toHaveAttribute("href", "/runs/42");
  });
});

describe("Toaster", () => {
  it("renders nothing until a toast fires", () => {
    render(<Toaster />);
    expect(screen.queryByRole("region", { name: "Notifications" })).not.toBeInTheDocument();
    fire(() => toast.success({ title: "Workflow approved" }));
    expect(screen.getByRole("region", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByText("Workflow approved")).toBeInTheDocument();
  });

  it("dismisses on its own after 3.2 seconds", () => {
    render(<Toaster />);
    fire(() => toast.success({ title: "Workflow approved" }));
    act(() => vi.advanceTimersByTime(3100));
    expect(screen.getByText("Workflow approved")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText("Workflow approved")).not.toBeInTheDocument();
  });

  it("never auto-dismisses a failure", () => {
    render(<Toaster />);
    fire(() => toast.fail({ title: "Run failed" }));
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText("Run failed")).toBeInTheDocument();
  });

  it("pauses the timer while the pointer is over it and resumes after", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Toaster />);
    fire(() => toast.info({ title: "Sync scheduled" }));
    await user.hover(screen.getByRole("status"));
    act(() => vi.advanceTimersByTime(10_000));
    expect(screen.getByText("Sync scheduled")).toBeInTheDocument();
    await user.unhover(screen.getByRole("status"));
    act(() => vi.advanceTimersByTime(3300));
    expect(screen.queryByText("Sync scheduled")).not.toBeInTheDocument();
  });

  it("pauses the timer while keyboard focus is anywhere inside it", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Toaster />);
    fire(() => toast.neutral({ title: "Draft saved" }));
    await user.tab();
    expect(screen.getByRole("button", { name: "Dismiss" })).toHaveFocus();
    act(() => vi.advanceTimersByTime(10_000));
    expect(screen.getByText("Draft saved")).toBeInTheDocument();
  });

  it("never takes focus when it arrives", () => {
    render(
      <>
        <input aria-label="Field" />
        <Toaster />
      </>,
    );
    screen.getByLabelText("Field").focus();
    fire(() => toast.fail({ title: "Run failed" }));
    expect(screen.getByLabelText("Field")).toHaveFocus();
  });

  it("the Dismiss button removes just that toast", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Toaster />);
    fire(() => {
      toast.fail({ title: "Run failed" });
      toast.fail({ title: "Sync failed" });
    });
    await user.click(screen.getAllByRole("button", { name: "Dismiss" })[0]!);
    expect(screen.queryByText("Run failed")).not.toBeInTheDocument();
    expect(screen.getByText("Sync failed")).toBeInTheDocument();
  });

  it("Escape clears the whole stack, failures included", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Toaster />);
    fire(() => {
      toast.fail({ title: "Run failed" });
      toast.info({ title: "Sync scheduled" });
    });
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("region", { name: "Notifications" })).not.toBeInTheDocument();
  });

  it("collapses a repeat of the same event into one counted toast", () => {
    render(<Toaster />);
    fire(() => {
      toast.success({ title: "1 run exported" });
      toast.success({ title: "1 run exported" });
      toast.success({ title: "1 run exported" });
    });
    expect(screen.getAllByText("1 run exported")).toHaveLength(1);
    expect(screen.getByText("×3")).toBeInTheDocument();
  });

  it("restarts the timer when a repeat arrives", () => {
    render(<Toaster />);
    fire(() => toast.success({ title: "1 run exported" }));
    act(() => vi.advanceTimersByTime(3000));
    fire(() => toast.success({ title: "1 run exported" }));
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText("1 run exported")).toBeInTheDocument();
  });

  it("does not collapse the same title under a different intent", () => {
    render(<Toaster />);
    fire(() => {
      toast.success({ title: "Export" });
      toast.fail({ title: "Export" });
    });
    expect(screen.getAllByText("Export")).toHaveLength(2);
  });

  it("never stacks past three, dropping the oldest", () => {
    render(<Toaster />);
    fire(() => {
      toast.neutral({ title: "One" });
      toast.neutral({ title: "Two" });
      toast.neutral({ title: "Three" });
      toast.neutral({ title: "Four" });
    });
    expect(screen.queryByText("One")).not.toBeInTheDocument();
    expect(screen.getAllByRole("status")).toHaveLength(3);
  });

  it("defaults to the Neutral intent", () => {
    render(<Toaster />);
    fire(() => toast({ title: "Draft saved" }));
    expect(screen.getByRole("status")).toHaveAttribute("data-intent", "neutral");
  });
});
