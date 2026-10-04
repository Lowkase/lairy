// The real <Switch> never renders flanking ON/OFF text or a command-style
// label — this "never do this" example has no prop that would produce
// either, so it is a static, token-built mock, not a <Switch>, the same
// class of illustration checkbox.ts's and radio.ts's own entries already
// use for a prop-less violation (switch.ts's own extractionNotes).
export function SwitchBadCommandWithOnOffFlanksExample() {
  return (
    <span className="flex items-center gap-16">
      <span className="text-body text-fg">Turn on auto-retry</span>
      <span className="flex items-center gap-8">
        <span className="text-label uppercase tracking-tight-12 text-faint">OFF</span>
        <span
          aria-hidden="true"
          className="relative inline-flex h-22 w-44 shrink-0 items-center rounded-chip border border-border-2 bg-panel-2 px-4"
        >
          <span className="size-16 shrink-0 rounded-full bg-dim" />
        </span>
        <span className="text-label uppercase tracking-tight-12 text-faint">ON</span>
      </span>
    </span>
  );
}
