import {
  TabsGoodCountInFaintExample,
  TabsPageTabsExample,
  TabsPanelTabsExample,
} from "@lairy/ui/tabs/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function TabsDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <TabsPageTabsExample />
        <TabsPanelTabsExample />
        <TabsGoodCountInFaintExample />
      </div>
    </ThemeToggle>
  );
}
