/** Good: ambient stays grey — date in --dim, clock in --mute, divided by a hairline. */
export function HeaderGoodAmbientGreyExample() {
  return (
    <div className="flex items-center gap-8 border border-border bg-bg p-16">
      <span className="text-label tracking-tight-14 text-dim">WED 23 AUG 2026</span>
      <span aria-hidden="true" className="h-12 w-0 border-l border-border-2" />
      <span className="text-label tracking-tight-14 text-mute">14:02:07</span>
    </div>
  );
}
