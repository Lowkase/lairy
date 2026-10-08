/** Anti-pattern: a field that grows a row per pick, so the form reflows
 * under the operator as they work. Static markup — the component cannot
 * produce this on purpose. */
export function SelectMultiBadGrowingFieldExample() {
  return (
    <div className="flex w-full flex-wrap items-center gap-6 rounded-ds border border-border-2 bg-bg px-8 py-8">
      {["Ingest", "Normalize", "Summarize", "Export"].map((label) => (
        <span
          key={label}
          className="inline-flex items-center gap-6 rounded-ds border border-accent-line bg-accent-soft py-4 pl-8 pr-6 text-small text-fg"
        >
          {label}
          <span aria-hidden className="text-label text-mute">
            ✕
          </span>
        </span>
      ))}
    </div>
  );
}
