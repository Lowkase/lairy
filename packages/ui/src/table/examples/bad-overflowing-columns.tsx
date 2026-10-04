// Illustration only, not a Table implementation — the real component lets a
// consumer pick as many columns as they want (Table is generic over its
// caller's own data), so it can't refuse a column count on its own behalf
// the way a locked variant set can. Drawn directly from tokens to show the
// shape Usage "use something else when" rules out, the same precedent
// tabs.ts's own bad-pill-tabs.tsx already set for a shape its real component
// structurally can't render.
const COLUMNS = ["NAME", "ID", "OWNER", "REGION", "SRC", "UPDATED"];
const ROWS = [
  ["Nightly…", "RUN-4…", "A. Vaz", "eu-w1", "12", "2026-08…"],
  ["Weekly…", "RUN-4…", "M. Oke", "us-e2", "4", "2026-08…"],
];

export function TableBadOverflowingColumnsExample() {
  return (
    <div className="overflow-hidden border border-border bg-panel-2">
      <div className="grid grid-cols-6 gap-6 border-b border-border px-8 py-8">
        {COLUMNS.map((name) => (
          <span key={name} className="truncate font-body text-micro tracking-tight-10 text-faint">
            {name}
          </span>
        ))}
      </div>
      {ROWS.map((cells) => (
        <div key={cells[0]} className="grid grid-cols-6 gap-6 px-8 py-8">
          {cells.map((cell, index) => (
            <span key={COLUMNS[index]} className="truncate font-body text-micro text-fg">
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
