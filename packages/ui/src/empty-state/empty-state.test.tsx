import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  describe("First run", () => {
    it("renders the headline and body", () => {
      render(
        <EmptyState
          kind="first-run"
          headline="No runs in this window"
          body="Runs from the last 24 hours appear here once a workflow is scheduled."
        />,
      );
      expect(screen.getByText("No runs in this window")).toBeInTheDocument();
      expect(
        screen.getByText("Runs from the last 24 hours appear here once a workflow is scheduled."),
      ).toBeInTheDocument();
    });

    it("renders a primary Button for its action (Empty state Variants 'First run')", () => {
      render(
        <EmptyState kind="first-run" headline="No workflows yet" action={{ label: "New workflow" }} />,
      );
      const action = screen.getByRole("button", { name: "New workflow" });
      expect(action.className).toContain("bg-accent");
    });

    it("calls the action's onClick when activated", () => {
      const onClick = vi.fn();
      render(
        <EmptyState
          kind="first-run"
          headline="No workflows yet"
          action={{ label: "New workflow", onClick }}
        />,
      );
      screen.getByRole("button", { name: "New workflow" }).click();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("omits the action entirely when none is given", () => {
      render(<EmptyState kind="first-run" headline="No workflows yet" />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("carries data-kind='first-run'", () => {
      render(<EmptyState kind="first-run" headline="No workflows yet" />);
      expect(screen.getByText("No workflows yet").closest('[data-slot="empty-state"]')).toHaveAttribute(
        "data-kind",
        "first-run",
      );
    });
  });

  describe("No results", () => {
    it("renders a ghost Button for its action, never primary (Empty state Variants 'No results')", () => {
      render(
        <EmptyState
          kind="no-results"
          headline="No runs match FAILED"
          action={{ label: "Clear filter" }}
        />,
      );
      const action = screen.getByRole("button", { name: "Clear filter" });
      expect(action.className).not.toContain("bg-accent");
      expect(action.className).toContain("border-transparent");
    });

    it("carries data-kind='no-results'", () => {
      render(<EmptyState kind="no-results" headline="No runs match FAILED" />);
      expect(
        screen.getByText("No runs match FAILED").closest('[data-slot="empty-state"]'),
      ).toHaveAttribute("data-kind", "no-results");
    });
  });

  describe("Restricted", () => {
    it("renders the headline and body with no action at all (Empty state Content rule 5)", () => {
      render(
        <EmptyState
          kind="restricted"
          headline="Not visible to you"
          body="Ask the workspace owner to grant access to Fleet."
        />,
      );
      expect(screen.getByText("Not visible to you")).toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("carries data-kind='restricted'", () => {
      render(<EmptyState kind="restricted" headline="Not visible to you" />);
      expect(screen.getByText("Not visible to you").closest('[data-slot="empty-state"]')).toHaveAttribute(
        "data-kind",
        "restricted",
      );
    });
  });

  it("hides the mark from assistive tech (Empty state Accessibility 'Decorative mark')", () => {
    render(<EmptyState kind="first-run" headline="No workflows yet" />);
    const region = screen.getByText("No workflows yet").closest('[data-slot="empty-state"]') as HTMLElement;
    const mark = region.querySelector("svg");
    expect(mark).toHaveAttribute("aria-hidden", "true");
  });

  it("is a polite live region, not an alert (Empty state Accessibility 'Not an alert', 'Announced once')", () => {
    render(<EmptyState kind="first-run" headline="No workflows yet" />);
    const region = screen.getByText("No workflows yet").closest('[data-slot="empty-state"]');
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).not.toHaveAttribute("role", "alert");
  });

  it("omits the body entirely when none is given", () => {
    render(<EmptyState kind="restricted" headline="Not visible to you" />);
    const region = screen.getByText("Not visible to you").closest('[data-slot="empty-state"]') as HTMLElement;
    expect(region.querySelector('[data-slot="empty-state-body"]')).not.toBeInTheDocument();
  });
});
