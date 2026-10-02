import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./progress";

describe("Progress", () => {
  describe("Bar", () => {
    it("renders the label and the count as a fraction (Progress anatomy #1–2)", () => {
      render(<Progress variant="bar" label="Exporting runs" value={132} max={214} />);
      expect(screen.getByText("Exporting runs")).toBeInTheDocument();
      expect(screen.getByText("132 / 214")).toBeInTheDocument();
    });

    it("is a progressbar carrying aria-valuenow/min/max (Progress Accessibility 'Progressbar with values')", () => {
      render(<Progress variant="bar" label="Exporting runs" value={132} max={214} />);
      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-valuemin", "0");
      expect(bar).toHaveAttribute("aria-valuemax", "214");
      expect(bar).toHaveAttribute("aria-valuenow", "132");
      expect(bar).toHaveAttribute("aria-label", "Exporting runs");
    });

    it("sets the fill width from value/max", () => {
      render(<Progress variant="bar" label="Exporting runs" value={50} max={200} />);
      const fill = screen.getByRole("progressbar").firstElementChild as HTMLElement;
      expect(fill.style.width).toBe("25%");
    });

    it("defaults to the running tone (--accent at 85%)", () => {
      render(<Progress variant="bar" label="Exporting runs" value={50} max={200} />);
      const fill = screen.getByRole("progressbar").firstElementChild as HTMLElement;
      expect(fill).toHaveClass("bg-accent/85");
    });

    it("renders the complete tone as full --accent", () => {
      render(<Progress variant="bar" label="Exporting runs" value={200} max={200} status="complete" />);
      const fill = screen.getByRole("progressbar").firstElementChild as HTMLElement;
      expect(fill).toHaveClass("bg-accent");
      expect(fill).not.toHaveClass("bg-accent/85");
    });

    it("renders the failed tone in --alarm and states it in the aria value text (Progress Accessibility 'Colour is never alone')", () => {
      render(<Progress variant="bar" label="Exporting runs" value={88} max={214} status="failed" />);
      const bar = screen.getByRole("progressbar");
      const fill = bar.firstElementChild as HTMLElement;
      expect(fill).toHaveClass("bg-alarm");
      expect(bar).toHaveAttribute("aria-valuetext", "88 of 214, failed");
    });

    it("renders an optional caption prefixed with // and uppercased, in --fg when failed (Content rule 4)", () => {
      render(
        <Progress
          variant="bar"
          label="Exporting runs"
          value={88}
          max={214}
          status="failed"
          caption="stopped at 88 of 214"
        />,
      );
      const caption = screen.getByText("// stopped at 88 of 214");
      expect(caption).toHaveClass("uppercase");
      expect(caption).toHaveClass("text-fg");
    });

    it("renders no caption when none is given", () => {
      const { container } = render(<Progress variant="bar" label="Exporting runs" value={50} max={200} />);
      expect(container.querySelector('[data-slot="progress"]')?.children).toHaveLength(2);
    });

    it("merges a custom className", () => {
      const { container } = render(
        <Progress variant="bar" label="Exporting runs" value={50} max={200} className="mt-16" />,
      );
      expect(container.querySelector('[data-slot="progress"]')).toHaveClass("mt-16");
    });
  });

  describe("Steps", () => {
    it("renders one segment per step, filling every stage before the current one (Rules 'Forward only')", () => {
      const { container } = render(<Progress variant="steps" steps={4} current={3} />);
      const segments = container.querySelectorAll('[data-slot="progress-segment"]');
      expect(segments).toHaveLength(4);
      expect(segments[0]).toHaveClass("bg-accent/85");
      expect(segments[1]).toHaveClass("bg-accent/85");
      expect(segments[2]).toHaveClass("bg-panel-2");
      expect(segments[3]).toHaveClass("bg-panel-2");
    });

    it("is a progressbar reporting the filled count out of the total stages", () => {
      render(<Progress variant="steps" steps={4} current={3} />);
      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-valuemax", "4");
      expect(bar).toHaveAttribute("aria-valuenow", "2");
    });

    it("renders the stage caption and optional stage label", () => {
      render(<Progress variant="steps" steps={4} current={3} stageLabel="summarize" />);
      expect(screen.getByText("Stage 3 of 4")).toBeInTheDocument();
      expect(screen.getByText("summarize")).toBeInTheDocument();
    });

    it("renders an optional heading", () => {
      render(<Progress variant="steps" steps={4} current={1} label="ingest → export" />);
      expect(screen.getByText("ingest → export")).toBeInTheDocument();
    });
  });

  describe("Meter", () => {
    it("is a meter, not a progressbar (Progress Accessibility 'Progressbar with values')", () => {
      render(<Progress variant="meter" label="Storage quota" value={74} />);
      expect(screen.getByRole("meter")).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("renders the label and the rounded percent with no decimal places (Content rule 2)", () => {
      render(<Progress variant="meter" label="Storage quota" value={73.6} />);
      expect(screen.getByText("Storage quota")).toBeInTheDocument();
      expect(screen.getByText("74%")).toBeInTheDocument();
      expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "74");
    });

    it("clamps to 0–100", () => {
      render(<Progress variant="meter" label="Storage quota" value={140} />);
      expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "100");
    });
  });
});
