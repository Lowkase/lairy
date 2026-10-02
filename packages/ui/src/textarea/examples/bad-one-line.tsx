import { Textarea } from "../textarea";

export function TextareaBadOneLineExample() {
  return (
    <Textarea
      label="Why it was skipped"
      defaultValue="Source was still writing at 02:14, so the…"
      rows={1}
    />
  );
}
