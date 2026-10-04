// Illustration only, not a Table implementation — the real component's
// `rowActions` only ever renders icons inline, with the rare verbs behind
// the row's own overflow menu (anatomy #5), so a row of spelled-out text
// buttons can't be produced by it. Drawn directly from tokens, the same
// precedent bad-overflowing-columns.tsx already set.
const JOBS = ["Nightly ingest", "Weekly rollup"];

export function TableBadEveryActionSpelledOutExample() {
  return (
    <div className="flex flex-col border border-border bg-panel">
      {JOBS.map((name) => (
        <div
          key={name}
          className="flex items-center gap-8 border-b border-border py-12 px-12 font-body text-label"
        >
          <span className="flex-1 text-fg">{name}</span>
          <span className="rounded-ds border border-border-2 px-8 py-4 text-micro uppercase tracking-tight-8 text-fg">
            Run
          </span>
          <span className="rounded-ds border border-border-2 px-8 py-4 text-micro uppercase tracking-tight-8 text-fg">
            Duplicate
          </span>
          <span className="rounded-ds border border-alarm-line px-8 py-4 text-micro uppercase tracking-tight-8 text-fg">
            Delete
          </span>
        </div>
      ))}
    </div>
  );
}
