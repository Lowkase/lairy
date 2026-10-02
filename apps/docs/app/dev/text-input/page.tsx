import { TextInput } from "@lairy/ui";
import {
  TextInputGoodErrorWithFixExample,
  TextInputPipelineNameExample,
} from "@lairy/ui/text-input/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function TextInputDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-wrap items-start gap-16">
        <TextInputPipelineNameExample />
        <TextInput label="Empty" hint="Lowercase, no spaces" placeholder="nightly-ingest" />
        <TextInput label="Focused" defaultValue="nightly-ingest" autoFocus />
        <TextInputGoodErrorWithFixExample />
        <TextInput label="Disabled" placeholder="Locked" disabled />
      </div>
    </ThemeToggle>
  );
}
