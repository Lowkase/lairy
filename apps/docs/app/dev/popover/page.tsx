import {
  PopoverBadDestructiveFirstExample,
  PopoverBadDetailFormExample,
  PopoverBadScrollingMenuExample,
  PopoverDemoExample,
  PopoverGoodAnchoredMenuExample,
  PopoverGoodDestructiveBelowDividerExample,
  PopoverGoodDetailOneLinkExample,
} from "@lairy/ui/popover/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function PopoverDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-32 p-32">
        <PopoverDemoExample />
        <PopoverGoodDestructiveBelowDividerExample />
        <PopoverBadDestructiveFirstExample />
        <PopoverGoodAnchoredMenuExample />
        <PopoverBadScrollingMenuExample />
        <PopoverGoodDetailOneLinkExample />
        <PopoverBadDetailFormExample />
      </div>
    </ThemeToggle>
  );
}
