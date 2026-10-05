import {
  MainRailBadHoverAsActiveExample,
  MainRailBadOverflowMenuExample,
  MainRailDemoExample,
  MainRailGoodCollapsedKeepsItemsExample,
  MainRailGoodHoverNoRailExample,
} from "@lairy/ui/main-rail/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function MainRailDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <MainRailDemoExample />
        <MainRailGoodHoverNoRailExample />
        <MainRailBadHoverAsActiveExample />
        <MainRailGoodCollapsedKeepsItemsExample />
        <MainRailBadOverflowMenuExample />
      </div>
    </ThemeToggle>
  );
}
