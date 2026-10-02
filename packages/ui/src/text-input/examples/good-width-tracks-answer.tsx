import { TextInput } from "../text-input";

// The prototype's own Retries field is a literal 74px — outside the
// spacing ramp with nothing to snap to (packages/content/src/entries/
// components/text-input.ts's extractionNotes). `w-44` (the ramp's own
// ceiling) stands in as the closest token-backed width, illustrating the
// pattern rather than reproducing the exact figure.
export function TextInputGoodWidthTracksAnswerExample() {
  return (
    <div className="flex flex-wrap items-start gap-16">
      <div className="w-44">
        <TextInput label="Retries" defaultValue="2" />
      </div>
      <div className="flex-1">
        <TextInput label="Name" defaultValue="nightly-ingest" />
      </div>
    </div>
  );
}
