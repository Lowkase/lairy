import { Progress } from "../progress";

export function ProgressStepsExample() {
  return <Progress variant="steps" label="ingest → export" steps={4} current={3} stageLabel="summarize" />;
}
