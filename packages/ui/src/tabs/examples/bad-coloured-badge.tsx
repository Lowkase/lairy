// Illustration only, not a Tabs implementation — the real component's
// `count` prop only ever renders --faint text (Content rule "A count is
// allowed only ... never as a coloured badge"), so a badge-shaped count
// can't be produced by it and is drawn here directly from tokens, the same
// precedent bad-pill-tabs.tsx already set.
export function TabsBadColouredBadgeExample() {
  return (
    <div className="flex items-end gap-8 border-b border-border">
      <span className="flex items-center gap-6 border-b-2 border-accent px-12 py-6 font-body text-label uppercase tracking-tight-14 text-accent">
        Alerts
        <span className="rounded-chip bg-alarm px-6 text-micro text-alarm-ink">3 new</span>
      </span>
      <span className="border-b-2 border-transparent px-12 py-6 font-body text-label uppercase tracking-tight-14 text-mute">
        History
      </span>
    </div>
  );
}
