import { Select } from "../select";

export function SelectGoodErrorInWordsExample() {
  return (
    <Select
      label="Stage"
      placeholder="Choose a stage"
      error="Stage is required"
      required
      options={[
        { value: "ingest", label: "Ingest" },
        { value: "normalize", label: "Normalize" },
        { value: "summarize", label: "Summarize" },
      ]}
    />
  );
}
