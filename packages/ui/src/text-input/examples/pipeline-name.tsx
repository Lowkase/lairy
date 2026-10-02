import { TextInput } from "../text-input";

export function TextInputPipelineNameExample() {
  return (
    <TextInput
      label="Pipeline name"
      hint="Lowercase, no spaces"
      defaultValue="Nightly ingest"
      maxLength={60}
      showCounter
    />
  );
}
