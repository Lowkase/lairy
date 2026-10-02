import { Progress } from "../progress";

// Never reset the bar to zero on failure (Progress Do and don't) — unlike
// the other "bad" examples here, this one is buildable with the real
// component (nothing stops a caller passing `value={0}`); it's wrong
// because the caller threw away the count the system actually had, not
// because the component allows something it shouldn't.
export function ProgressBadResetzeroExample() {
  return <Progress variant="bar" label="Exporting runs" value={0} max={214} status="failed" />;
}
