import { Select } from "../select";

export function SelectDemoExample() {
  return (
    <Select
      label="Stage"
      placeholder="Choose a stage"
      defaultValue="normalize"
      options={[
        { value: "ingest", label: "Ingest" },
        { value: "normalize", label: "Normalize" },
        { value: "summarize", label: "Summarize" },
      ]}
    />
  );
}
