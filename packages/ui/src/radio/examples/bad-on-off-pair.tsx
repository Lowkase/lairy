import { Radio } from "../radio";

export function RadioBadOnOffPairExample() {
  return (
    <Radio
      name="auto-retry"
      defaultValue="on"
      options={[
        { value: "on", label: "Auto-retry on" },
        { value: "off", label: "Auto-retry off" },
      ]}
    />
  );
}
