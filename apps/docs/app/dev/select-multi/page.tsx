import { SelectMulti } from "@lairy/ui";
import { SelectMultiDemoExample, SelectMultiGoodFixedHeightExample } from "@lairy/ui/select-multi/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

const OPTIONS = [
  { value: "ingest", label: "Ingest", meta: "12 src" },
  { value: "normalize", label: "Normalize", meta: "4 rules" },
  { value: "summarize", label: "Summarize", meta: "Agent" },
  { value: "export", label: "Export", meta: "3 dest" },
  { value: "archive", label: "Archive", meta: "Cold" },
];

export default function SelectMultiDevPage() {
  return (
    <ThemeToggle>
      <div className="grid grid-cols-2 items-start gap-16">
        <SelectMultiDemoExample />
        <SelectMulti label="Empty" placeholder="Select stages" options={OPTIONS} />
        <SelectMultiGoodFixedHeightExample />
        <SelectMulti label="Errored" placeholder="Select stages" options={OPTIONS} error="Pick at least one stage" required />
        <SelectMulti label="Disabled" defaultValue={["ingest"]} options={OPTIONS} disabled />
      </div>
    </ThemeToggle>
  );
}
