import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UsageCard } from "./usage-card";

describe("UsageCard", () => {
  it("renders every row on both sides", () => {
    render(
      <UsageCard
        useWhen={["Condition one.", "Condition two."]}
        useInstead={["Reach for something else instead."]}
      />,
    );

    expect(screen.getByText("Condition one.")).toBeInTheDocument();
    expect(screen.getByText("Condition two.")).toBeInTheDocument();
    expect(screen.getByText("Reach for something else instead.")).toBeInTheDocument();
  });

  it('defaults the left title to "Use when"', () => {
    render(<UsageCard useWhen={["A condition."]} useInstead={["An alternative."]} />);

    expect(screen.getByText("Use when")).toBeInTheDocument();
  });

  it("accepts a custom left title without changing the fixed right title", () => {
    render(
      <UsageCard
        useWhenTitle="Reach for amber when"
        useWhen={["A condition."]}
        useInstead={["An alternative."]}
      />,
    );

    expect(screen.getByText("Reach for amber when")).toBeInTheDocument();
    expect(screen.queryByText("Use when")).not.toBeInTheDocument();
    expect(screen.getByText("Use something else when")).toBeInTheDocument();
  });

  it("is read-only: neither side is a button, link or focusable control", () => {
    render(<UsageCard useWhen={["A condition."]} useInstead={["An alternative."]} />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("renders the recommended side first in markup, ahead of the alternative", () => {
    render(<UsageCard useWhen={["A condition."]} useInstead={["An alternative."]} />);

    const recommended = screen.getByText("A condition.").compareDocumentPosition(
      screen.getByText("An alternative."),
    );
    // Node.DOCUMENT_POSITION_FOLLOWING: "An alternative." comes after "A condition." in the DOM.
    expect(recommended & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
