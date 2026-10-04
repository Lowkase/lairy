// Illustration only, not a Tabs implementation — the real component never
// grows an overflow affordance (Rules "Two to five": the row never scrolls
// to accommodate a sixth), so the "…" truncation shown here is drawn
// directly from tokens, the same precedent bad-pill-tabs.tsx already set
// for a shape the real component can't produce.
export function TabsBadOverflowSettingsExample() {
  return (
    <div className="flex items-end gap-8 border-b border-border">
      <span className="border-b-2 border-accent px-12 py-6 font-body text-label uppercase tracking-tight-14 text-accent">
        Logs
      </span>
      <span className="border-b-2 border-transparent px-12 py-6 font-body text-label uppercase tracking-tight-14 text-mute">
        Diff
      </span>
      <span className="border-b-2 border-transparent px-12 py-6 font-body text-label uppercase tracking-tight-14 text-mute">
        Settings
      </span>
      <span className="px-6 py-6 text-small text-dim">…</span>
    </div>
  );
}
