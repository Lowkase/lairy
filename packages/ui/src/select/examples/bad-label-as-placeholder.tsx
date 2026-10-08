import { Select } from "../select";

/** Anti-pattern: the label does duty as the placeholder, so once a value is
 * picked the question is gone. Kept as a bad example only. */
export function SelectBadLabelAsPlaceholderExample() {
  return (
    <Select
      label="Pipeline"
      placeholder="Stage"
      options={[
        { value: "ingest", label: "Ingest" },
        { value: "normalize", label: "Normalize" },
        { value: "summarize", label: "Summarize" },
      ]}
    />
  );
}
