// Demonstrates a pattern the real Chip component can't produce — it has no
// tone prop (Chips Variants "There is no tonal chip"). Built from raw
// elements, the same way a bad example outside the system's own vocabulary
// is shown elsewhere (e.g. Badge's bad-dotonly).
export function ChipBadTonalExample() {
  return (
    <div className="flex flex-wrap gap-8">
      <span className="inline-flex items-center rounded-chip border border-accent bg-accent-soft px-12 py-6 font-body text-label uppercase tracking-tight-10 text-accent">
        OPEN
      </span>
      <span className="inline-flex items-center rounded-chip border border-accent-2-line bg-accent-2-soft px-12 py-6 font-body text-label uppercase tracking-tight-10 text-accent-2">
        DONE
      </span>
      <span className="inline-flex items-center rounded-chip border border-alarm-line px-12 py-6 font-body text-label uppercase tracking-tight-10 text-alarm">
        ALL
      </span>
    </div>
  );
}
