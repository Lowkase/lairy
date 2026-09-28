import {
  CalloutErrorExample,
  CalloutInfoExample,
  CalloutSuccessExample,
  CalloutWarningExample,
} from "@lairy/ui/callout/examples";
import { ThemeToggle } from "./theme-toggle";

export default function CalloutDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <CalloutInfoExample />
        <CalloutSuccessExample />
        <CalloutWarningExample />
        <CalloutErrorExample />
      </div>
    </ThemeToggle>
  );
}
