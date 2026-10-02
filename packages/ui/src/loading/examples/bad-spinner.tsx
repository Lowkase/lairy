// Never a spinner, and never "Loading…" (Loading Do and don't). There is no
// spinner variant on the real `Loading` component — this mistake can't be
// built with it, so it's reproduced here with plain markup instead, the same
// precedent other components' own "structurally prevented" bad examples set.
export function LoadingBadSpinnerExample() {
  return (
    <div className="flex flex-col items-center gap-12">
      <span className="size-22 rounded-full border-2 border-accent-line border-t-accent" />
      <span className="text-label tracking-tight-10 text-faint">Loading…</span>
    </div>
  );
}
