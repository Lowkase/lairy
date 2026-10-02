import { Scrollbar } from "../scrollbar";

// Six bars at Space-6 height with Space-8 gaps overflow the Space-44
// viewport (6×6 + 5×8 = 76px of content in a 44px frame) so the thumb is
// always visible here, independent of real content.
const ROWS = Array.from({ length: 6 }, (_, index) => index);

export function ScrollbarPanelExample() {
  return (
    <Scrollbar className="h-44 w-full border border-border bg-bg p-8">
      <div className="flex flex-col gap-8">
        {ROWS.map((row) => (
          <span key={row} className="h-6 shrink-0 rounded-ds bg-border-2" />
        ))}
      </div>
    </Scrollbar>
  );
}
