import {
  ScrollbarBadWidenedExample,
  ScrollbarGoodQuietExample,
  ScrollbarPanelExample,
} from "@lairy/ui/scrollbar/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function ScrollbarDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <ScrollbarPanelExample />
        <ScrollbarGoodQuietExample />
        <ScrollbarBadWidenedExample />
      </div>
    </ThemeToggle>
  );
}
