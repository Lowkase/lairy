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
import type { ComponentType } from "react";

export const DRAWER_EXAMPLES: Record<string, ComponentType> = {
  demo: DrawerDemoExample,
  sm: DrawerSmExample,
  md: DrawerMdExample,
  lg: DrawerLgExample,
  "good-pinned-footer": DrawerGoodPinnedFooterExample,
  "bad-scattered-commits": DrawerBadScatteredCommitsExample,
  "good-one-panel": DrawerGoodOnePanelExample,
  "bad-stacked-drawers": DrawerBadStackedDrawersExample,
  "good-named-header": DrawerGoodNamedHeaderExample,
  "bad-no-title-no-close": DrawerBadNoTitleNoCloseExample,
};
