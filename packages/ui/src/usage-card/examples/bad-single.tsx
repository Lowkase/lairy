// Demonstrates a pattern the real UsageCard can't produce — `useWhen` and
// `useInstead` are both required, so there is no way to render only one
// side. Built from raw elements, the same way Cards' own
// bad-nestedcontrols.tsx shows a misuse its real component forbids (Usage
// card Content rule 5: "Never a single card").
export function UsageCardBadSingleExample() {
  return (
    <div className="border border-accent-line bg-accent-soft p-18">
      <div className="mb-12 text-micro uppercase tracking-tight-6 text-fg">Use when</div>
      <div className="flex flex-col gap-8 text-small text-dim">
        <span>The colour is informing rather than acting.</span>
      </div>
    </div>
  );
}
