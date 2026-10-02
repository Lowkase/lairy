import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Loading, LoadingSkeletonLine } from "./loading";

describe("Loading", () => {
  describe("Sweep stack", () => {
    it("renders the phase label prefixed with // and uppercased", () => {
      render(<Loading variant="sweep-stack" phase="analyzing" />);
      expect(screen.getByText("// analyzing")).toBeInTheDocument();
      expect(screen.getByText("// analyzing")).toHaveClass("uppercase");
    });

    it("renders three tracks by default (Loading anatomy #2)", () => {
      render(<Loading variant="sweep-stack" phase="analyzing" />);
      const region = screen.getByRole("status");
      expect(region.querySelectorAll('[data-slot="loading-track"]')).toHaveLength(3);
    });

    it("renders two tracks when lines={2}", () => {
      render(<Loading variant="sweep-stack" phase="analyzing" lines={2} />);
      const region = screen.getByRole("status");
      expect(region.querySelectorAll('[data-slot="loading-track"]')).toHaveLength(2);
    });

    it("is a polite, busy status region (Loading Accessibility 'Busy, announced once')", () => {
      render(<Loading variant="sweep-stack" phase="analyzing" />);
      const region = screen.getByRole("status");
      expect(region).toHaveAttribute("aria-busy", "true");
      expect(region).toHaveAttribute("aria-live", "polite");
    });

    it("carries data-variant='sweep-stack'", () => {
      render(<Loading variant="sweep-stack" phase="analyzing" />);
      expect(screen.getByRole("status")).toHaveAttribute("data-variant", "sweep-stack");
    });
  });

  describe("Inline caret", () => {
    it("renders the phase label and a caret", () => {
      render(<Loading variant="inline-caret" phase="syncing" />);
      expect(screen.getByText("// syncing")).toBeInTheDocument();
      const region = screen.getByRole("status");
      expect(region.querySelector('[data-slot="loading-caret"]')).toBeInTheDocument();
    });

    it("is a polite, busy status region", () => {
      render(<Loading variant="inline-caret" phase="syncing" />);
      const region = screen.getByRole("status");
      expect(region).toHaveAttribute("aria-busy", "true");
      expect(region).toHaveAttribute("aria-live", "polite");
    });

    it("carries data-variant='inline-caret'", () => {
      render(<Loading variant="inline-caret" phase="syncing" />);
      expect(screen.getByRole("status")).toHaveAttribute("data-variant", "inline-caret");
    });
  });

  describe("Skeleton", () => {
    it("renders its children", () => {
      render(
        <Loading variant="skeleton">
          <LoadingSkeletonLine />
          <LoadingSkeletonLine />
        </Loading>,
      );
      expect(document.querySelectorAll('[data-slot="loading-skeleton-line"]')).toHaveLength(2);
    });

    it("carries data-variant='skeleton' and is not a live region (Loading Accessibility 'Skeletons are silent')", () => {
      const { container } = render(
        <Loading variant="skeleton">
          <LoadingSkeletonLine />
        </Loading>,
      );
      const region = container.querySelector('[data-slot="loading"]');
      expect(region).toHaveAttribute("data-variant", "skeleton");
      expect(region).not.toHaveAttribute("role");
      expect(region).not.toHaveAttribute("aria-busy");
    });
  });

  it("merges a custom className", () => {
    render(<Loading variant="inline-caret" phase="syncing" className="mt-16" />);
    expect(screen.getByRole("status")).toHaveClass("mt-16");
  });
});

describe("LoadingSkeletonLine", () => {
  it("renders an aria-hidden bar", () => {
    const { container } = render(<LoadingSkeletonLine className="w-44" />);
    const bar = container.firstElementChild;
    expect(bar).toHaveAttribute("aria-hidden", "true");
    expect(bar).toHaveClass("w-44");
  });
});
