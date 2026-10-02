import { Textarea } from "../textarea";

export function TextareaGoodThreeLinesExample() {
  return (
    <Textarea
      label="Why it was skipped"
      hint="Plain text"
      defaultValue="Source was still writing at 02:14."
      limit={512}
    />
  );
}
