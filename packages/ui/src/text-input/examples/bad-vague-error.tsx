import { TextInput } from "../text-input";

export function TextInputBadVagueErrorExample() {
  return <TextInput label="Pipeline name" defaultValue="nightly ingest" error="Invalid input" />;
}
