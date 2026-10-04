// Illustration only, not a Tabs implementation — the real component is
// locked to the one underline style (Rules "Underline only"; AGENTS.md
// rule 5, the chip shape is reserved), so a pill-shaped row can't be
// produced by it and is drawn here directly from tokens instead, the same
// precedent radio.ts's own "good-switch-instead" example already set for
// a shape the real component can't render.
export function TabsBadPillTabsExample() {
  return (
    <div className="flex gap-8">
      <span className="rounded-chip bg-accent px-12 py-6 font-body text-label uppercase tracking-tight-14 text-bg">
        Map
      </span>
      <span className="rounded-chip border border-border-2 px-12 py-6 font-body text-label uppercase tracking-tight-14 text-mute">
        Table
      </span>
      <span className="rounded-chip border border-border-2 px-12 py-6 font-body text-label uppercase tracking-tight-14 text-mute">
        List
      </span>
    </div>
  );
}
