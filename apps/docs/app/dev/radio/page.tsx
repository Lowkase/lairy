import { Radio } from "@lairy/ui";
import { RadioIngestOrNormalizeExample } from "@lairy/ui/radio/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

const RETRY_OPTIONS = [
  { value: "every-run", label: "Every run" },
  { value: "failures-only", label: "Failures only" },
  { value: "never", label: "Never" },
];

export default function RadioDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <RadioIngestOrNormalizeExample />
        <Radio label="Off" name="off" options={RETRY_OPTIONS} />
        <Radio label="On" name="on" defaultValue="every-run" options={RETRY_OPTIONS} />
        <Radio label="Error" name="error" error options={RETRY_OPTIONS} />
        <Radio label="Disabled off" name="disabled-off" disabled options={RETRY_OPTIONS} />
        <Radio label="Disabled on" name="disabled-on" disabled defaultValue="every-run" options={RETRY_OPTIONS} />
        <Radio
          label="With description"
          name="with-description"
          defaultValue="fastest"
          options={[
            { value: "fastest", label: "Fastest", description: "Skips validation" },
            { value: "safest", label: "Safest", description: "Validates every row" },
          ]}
        />
        <Radio
          label="One locked option"
          name="locked-option"
          defaultValue="every-run"
          options={[
            { value: "every-run", label: "Every run" },
            { value: "never", label: "Never", disabled: true, description: "Not available on this plan" },
          ]}
        />
      </div>
    </ThemeToggle>
  );
}
