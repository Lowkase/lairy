import { Progress } from "../progress";

export function ProgressGoodFailureholdsExample() {
  return (
    <Progress
      variant="bar"
      label="Exporting runs"
      value={88}
      max={214}
      status="failed"
      caption="stopped at 88 of 214"
    />
  );
}
