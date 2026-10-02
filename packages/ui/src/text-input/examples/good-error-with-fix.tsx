import { TextInput } from "../text-input";

export function TextInputGoodErrorWithFixExample() {
  return (
    <TextInput
      label="Pipeline name"
      defaultValue="nightly ingest"
      error="Spaces are not allowed — try nightly-ingest"
    />
  );
}
