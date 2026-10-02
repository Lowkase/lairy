import { Progress } from "../progress";

export function ProgressBarExample() {
  return (
    <Progress
      variant="bar"
      label="Exporting runs"
      value={132}
      max={214}
      caption="writing shard 4 · ~3m left"
    />
  );
}
