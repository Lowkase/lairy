import { Radio } from "../radio";

export function RadioBadEmptyGroupExample() {
  return (
    <Radio
      name="retry-policy-empty"
      options={[
        { value: "every-run", label: "Every run" },
        { value: "failures-only", label: "Failures only" },
      ]}
    />
  );
}
