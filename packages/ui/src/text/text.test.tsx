import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "./text";

describe("Text", () => {
  it("renders its children", () => {
    render(<Text variant="body">Four stages finished inside their windows.</Text>);
    expect(screen.getByText("Four stages finished inside their windows.")).toBeInTheDocument();
  });

  it("renders a span by default", () => {
    render(<Text variant="body">Body copy</Text>);
    expect(screen.getByText("Body copy").tagName).toBe("SPAN");
  });

  it.each([
    ["eyebrow", "SPAN"],
    ["heading", "SPAN"],
    ["body", "SPAN"],
    ["caption", "SPAN"],
  ] as const)("variant %s renders as a span by default", (variant, tag) => {
    render(<Text variant={variant}>content</Text>);
    expect(screen.getByText("content").tagName).toBe(tag);
  });

  it("renders as the element passed via `as`, decoupling structure from the visual role", () => {
    render(
      <Text variant="heading" as="h2">
        Everything nominal
      </Text>,
    );
    const node = screen.getByText("Everything nominal");
    expect(node.tagName).toBe("H2");
    expect(node.className).toContain("text-heading");
  });

  it("eyebrow and caption are uppercase, tracked and --mute (AA-safe; --faint fails 4.5:1 in the light theme)", () => {
    render(<Text variant="eyebrow">PIPELINE / RUN 4182</Text>);
    const eyebrow = screen.getByText("PIPELINE / RUN 4182");
    expect(eyebrow.className).toContain("uppercase");
    expect(eyebrow.className).toContain("tracking-tight-20");
    expect(eyebrow.className).toContain("text-mute");

    render(<Text variant="caption">SYS·00 · 2m ago</Text>);
    const caption = screen.getByText("SYS·00 · 2m ago");
    expect(caption.className).toContain("uppercase");
    expect(caption.className).toContain("text-mute");
  });

  it("heading uses the heading type style in --fg with Grotesk", () => {
    render(<Text variant="heading">Everything nominal</Text>);
    const heading = screen.getByText("Everything nominal");
    expect(heading.className).toContain("font-heading");
    expect(heading.className).toContain("text-heading");
    expect(heading.className).toContain("text-fg");
  });

  it("body sits in --dim rather than --fg, so a heading above it keeps its rank", () => {
    render(<Text variant="body">Four stages finished inside their windows.</Text>);
    expect(screen.getByText("Four stages finished inside their windows.").className).toContain("text-dim");
  });

  it("emphasis steps the text up to --fg, the system's entire emphasis vocabulary", () => {
    render(
      <Text variant="body" emphasis>
        two stages were skipped
      </Text>,
    );
    const node = screen.getByText("two stages were skipped");
    expect(node.className).toContain("text-fg");
    expect(node.className).not.toContain("font-semibold");
  });

  it("numeric sets Grotesk with tabular figures, for a value read as a number", () => {
    render(
      <Text variant="body" numeric>
        214
      </Text>,
    );
    const node = screen.getByText("214");
    expect(node.className).toContain("font-heading");
    expect(node.className).toContain("tabular-nums");
  });
});
