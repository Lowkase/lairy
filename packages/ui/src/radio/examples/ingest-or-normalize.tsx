import { Radio } from "../radio";

export function RadioIngestOrNormalizeExample() {
  return (
    <Radio
      name="ingest-or-normalize"
      defaultValue="ingest"
      options={[
        { value: "ingest", label: "Ingest" },
        { value: "normalize", label: "Normalize" },
      ]}
    />
  );
}
