import { Textarea } from "../textarea";

export function TextareaWhyItWasSkippedExample() {
  return (
    <Textarea
      label="Why it was skipped"
      hint="Plain text, no formatting"
      defaultValue="Upstream source was still writing at 02:14, so the stage was skipped rather than run on a partial file."
      limit={512}
    />
  );
}
