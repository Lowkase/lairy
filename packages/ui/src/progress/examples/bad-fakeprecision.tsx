// Never invent decimals or say "Working" (Progress Do and don't). The real
// `Progress` bar variant has no percent-display mode — it only ever shows a
// count (Content rule 2) — so this mistake can't be built with it. Reproduced
// here with plain markup instead, the same precedent other components' own
// "structurally prevented" bad examples set.
export function ProgressBadFakeprecisionExample() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-12">
        <span className="text-small text-dim">Working…</span>
        <span className="text-label text-mute">87.4%</span>
      </div>
      <div className="h-6 overflow-hidden rounded-ds bg-panel-2">
        <div className="h-full rounded-ds bg-accent/85" style={{ width: "87%" }} />
      </div>
    </div>
  );
}
