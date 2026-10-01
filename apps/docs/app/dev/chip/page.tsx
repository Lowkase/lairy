import {
  ChipActiveExample,
  ChipFilterExample,
  ChipRemovableExample,
  ChipToggleExample,
} from "@lairy/ui/chip/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function ChipDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-wrap items-center gap-16">
        <ChipFilterExample />
        <ChipToggleExample />
        <ChipRemovableExample />
        <ChipActiveExample />
      </div>
    </ThemeToggle>
  );
}
