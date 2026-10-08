import { Select } from "../select";

export function SelectGoodLabelAboveExample() {
  return (
    <Select
      label="Stage"
      defaultValue="normalize"
      options={[
        { value: "ingest", label: "Ingest" },
        { value: "normalize", label: "Normalize" },
        { value: "summarize", label: "Summarize" },
      ]}
    />
  );
}
