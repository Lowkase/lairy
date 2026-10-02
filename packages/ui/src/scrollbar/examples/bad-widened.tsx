// Demonstrates a misuse the real Scrollbar can't produce — it has no width
// or colour prop (Content rule 1, Do/don't caption). Built from a raw
// `overflow-auto` div with its own pseudo-element overrides, the same
// treatment a bad example outside the system's own vocabulary is shown
// elsewhere (e.g. Usage card's bad-single).
const ROWS = Array.from({ length: 6 }, (_, index) => index);

export function ScrollbarBadWidenedExample() {
  return (
    <div
      className={[
        "h-44 w-full overflow-auto border border-border bg-bg p-8",
        "[&::-webkit-scrollbar]:w-32 [&::-webkit-scrollbar]:h-32",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:rounded-ds [&::-webkit-scrollbar-thumb]:bg-accent",
      ].join(" ")}
    >
      <div className="flex flex-col gap-8">
        {ROWS.map((row) => (
          <span key={row} className="h-6 shrink-0 rounded-ds bg-border-2" />
        ))}
      </div>
    </div>
  );
}
