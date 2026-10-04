// Illustration only, not a Table implementation — the real component's
// toolbar is one zone that swaps between its idle and selection content
// (Zones "Toolbar — idle" / "Toolbar — selection"), never both rendered at
// once, so a second stacked bar can't be produced by it. Drawn directly
// from tokens, the same precedent bad-overflowing-columns.tsx already set.
export function TableBadStackedToolbarExample() {
  return (
    <div className="border border-border bg-panel">
      <div className="flex items-center justify-between gap-16 border-b border-border bg-panel-2 py-12 px-18">
        <span className="font-body text-label tracking-tight-14 text-mute">3 jobs</span>
        <span className="font-body text-label uppercase tracking-tight-8 text-fg">Create</span>
      </div>
      <div className="flex items-center gap-16 border-b border-border bg-accent-2-soft py-12 px-18">
        <span className="rounded-chip border border-accent-2-line bg-accent-2-soft px-12 py-6 font-body text-label tracking-tight-10 text-accent-2">
          2 selected
        </span>
        <span className="font-body text-label uppercase tracking-tight-8 text-fg">Run</span>
      </div>
      <div className="py-12 px-18 font-body text-label text-dim">Nightly ingest</div>
    </div>
  );
}
