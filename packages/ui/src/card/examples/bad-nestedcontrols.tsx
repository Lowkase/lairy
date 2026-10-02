// Demonstrates a pattern the real Tile can't produce — a nested <button>
// inside the Tile's own <button> is invalid HTML, and Cards Accessibility
// "Tiles are one control" forbids the extra tab stops anyway. Built from raw
// elements, the same way a bad example outside the system's own vocabulary
// is shown elsewhere (e.g. Chip's bad-tonal).
export function CardBadNestedcontrolsExample() {
  return (
    <div className="rounded-ds border border-border bg-panel p-18">
      <div className="font-heading font-semibold text-small text-fg">Fleet</div>
      <div className="mt-12 flex gap-8">
        {["OPEN", "RENAME", "ARCHIVE"].map((label) => (
          <button
            key={label}
            type="button"
            className="border border-border-2 px-12 py-6 text-micro tracking-tight-6 text-fg"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
