// Switch has no shipped component yet (its own future ticket) — this is a
// token-built illustration of the prototype's own hand-drawn switch sketch
// (archive/v1/Workspace Shell.dc.html:221-232), used only to show why "one
// setting, two states" belongs to a Switch rather than a Radio group. It is
// not a Switch implementation.
export function RadioGoodSwitchInsteadExample() {
  return (
    <span className="flex items-center gap-12">
      <span className="flex h-22 w-44 items-center justify-end rounded-chip border border-accent-line bg-accent px-4">
        <span className="size-16 shrink-0 rounded-full bg-bg" />
      </span>
      <span className="text-body text-fg">Auto-retry failures</span>
    </span>
  );
}
