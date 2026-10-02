// Never part-fill a segment (Progress Do and don't). Real "steps" segments
// are always fully filled or fully empty by construction (Rules "Forward
// only") — this mistake can't be built with the real component. Reproduced
// here with plain markup instead, the same precedent other components' own
// "structurally prevented" bad examples set.
export function ProgressBadPartialfillExample() {
  return (
    <div className="flex gap-4">
      <span className="h-6 flex-1 rounded-ds bg-accent/85" />
      <span className="relative h-6 flex-1 overflow-hidden rounded-ds bg-panel-2">
        <span className="absolute inset-y-0 left-0 bg-accent/85" style={{ width: "47%" }} />
      </span>
      <span className="h-6 flex-1 rounded-ds bg-panel-2" />
    </div>
  );
}
