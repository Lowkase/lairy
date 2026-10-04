import { Switch } from "../switch";

// Two switches standing in for one choice is a layout/usage mistake, not a
// prop the real component refuses to expose, so this "never do this"
// example is built with two real <Switch> instances (switch.ts's own
// extractionNotes) — unlike the ON/OFF-flanked example, which needed a
// static mock.
export function SwitchBadTwoSwitchesAsAlternativesExample() {
  return (
    <div className="flex flex-col">
      <Switch label="Fastest" defaultChecked />
      <Switch label="Safest" />
    </div>
  );
}
