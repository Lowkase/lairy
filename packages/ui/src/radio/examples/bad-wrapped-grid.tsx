// The component always stacks its own options in a single column (anatomy
// #1, Content rule "Stacked, never wrapped") with no layout prop to defeat
// that — so this "never do this" example is a static mock, not a <Radio>,
// illustrating what wrapping the same four options into a grid would look
// like and why the reading order stops being obvious.
function MockOption({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <span className="flex items-center gap-12">
      <span
        aria-hidden="true"
        className={
          selected
            ? "flex size-18 shrink-0 items-center justify-center rounded-full border border-accent"
            : "flex size-18 shrink-0 items-center justify-center rounded-full border border-border-2"
        }
      >
        {selected ? <span className="size-8 rounded-full bg-accent" /> : null}
      </span>
      <span className="text-body text-fg">{label}</span>
    </span>
  );
}

export function RadioBadWrappedGridExample() {
  return (
    <div className="flex flex-row flex-wrap gap-18">
      <MockOption label="Fastest" selected />
      <MockOption label="Safest" />
      <MockOption label="Balanced" />
      <MockOption label="Custom" />
    </div>
  );
}
