import { TextInput } from "../text-input";

export function TextInputBadStretchedFieldExample() {
  return (
    <div className="flex flex-col gap-16">
      <TextInput label="Retries" defaultValue="2" />
      <TextInput label="Name" defaultValue="nightly-ingest" />
    </div>
  );
}
