import { Switch } from "../switch";

// The prototype's own sketch renders the SAVE affordance as a small
// amber-outlined label, not a full button — this stays a plain token-styled
// span rather than importing the real Button component, so this entry's
// examples don't couple to Button's own prop shape for one illustrative
// glyph (switch.ts's own extractionNotes).
export function SwitchBadBehindSaveExample() {
  return (
    <div className="flex flex-col gap-12">
      <Switch label="Auto-retry failed runs" defaultChecked />
      <span className="flex justify-end">
        <span className="border border-accent-line bg-accent-soft px-12 py-6 text-label uppercase tracking-tight-12 text-accent">
          Save
        </span>
      </span>
    </div>
  );
}
