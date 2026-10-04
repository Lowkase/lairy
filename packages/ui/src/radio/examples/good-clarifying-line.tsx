import { Radio } from "../radio";

export function RadioGoodClarifyingLineExample() {
  return (
    <Radio
      name="validation-speed"
      defaultValue="fastest"
      options={[
        { value: "fastest", label: "Fastest", description: "Skips validation" },
        { value: "safest", label: "Safest", description: "Validates every row" },
      ]}
    />
  );
}
