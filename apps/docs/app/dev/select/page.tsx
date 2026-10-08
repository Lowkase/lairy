import { Select } from "@lairy/ui";
import { SelectDemoExample, SelectGoodErrorInWordsExample } from "@lairy/ui/select/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

const OPTIONS = [
  { value: "ingest", label: "Ingest" },
  { value: "normalize", label: "Normalize" },
  { value: "summarize", label: "Summarize" },
];

export default function SelectDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-wrap items-start gap-16">
        <SelectDemoExample />
        <Select label="Empty" placeholder="Choose a stage" options={OPTIONS} />
        <Select label="Focused" defaultValue="normalize" options={OPTIONS} />
        <SelectGoodErrorInWordsExample />
        <Select label="Disabled" defaultValue="ingest" options={OPTIONS} disabled />
      </div>
    </ThemeToggle>
  );
}
