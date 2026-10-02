import { Textarea } from "@lairy/ui";
import {
  TextareaGoodCounterOverLimitExample,
  TextareaWhyItWasSkippedExample,
} from "@lairy/ui/textarea/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function TextareaDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-wrap items-start gap-16">
        <TextareaWhyItWasSkippedExample />
        <Textarea label="Empty" hint="Plain text, no formatting" placeholder="Write a capture note…" />
        <Textarea label="Focused" defaultValue="Source was still writing at 02:14." autoFocus />
        <TextareaGoodCounterOverLimitExample />
        <Textarea label="Disabled" placeholder="Locked" disabled />
      </div>
    </ThemeToggle>
  );
}
