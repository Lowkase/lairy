import { Radio } from "../radio";

export function RadioGoodDefaultSelectedExample() {
  return (
    <Radio
      name="retry-policy"
      defaultValue="every-run"
      options={[
        { value: "every-run", label: "Every run" },
        { value: "failures-only", label: "Failures only" },
        { value: "never", label: "Never" },
      ]}
    />
  );
}
