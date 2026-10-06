import {
  DrawerBadNoTitleNoCloseExample,
  DrawerBadScatteredCommitsExample,
  DrawerBadStackedDrawersExample,
  DrawerDemoExample,
  DrawerGoodNamedHeaderExample,
  DrawerGoodOnePanelExample,
  DrawerGoodPinnedFooterExample,
  DrawerLgExample,
  DrawerMdExample,
  DrawerSmExample,
} from "@lairy/ui/drawer/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function DrawerDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-wrap items-start gap-32 p-32">
        <DrawerDemoExample />
        <DrawerSmExample />
        <DrawerMdExample />
        <DrawerLgExample />
        <DrawerGoodPinnedFooterExample />
        <DrawerBadScatteredCommitsExample />
        <DrawerGoodOnePanelExample />
        <DrawerBadStackedDrawersExample />
        <DrawerGoodNamedHeaderExample />
        <DrawerBadNoTitleNoCloseExample />
      </div>
    </ThemeToggle>
  );
}
