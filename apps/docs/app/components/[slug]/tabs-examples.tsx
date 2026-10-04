import {
  TabsBadColouredBadgeExample,
  TabsBadOverflowSettingsExample,
  TabsBadPillTabsExample,
  TabsGoodCountInFaintExample,
  TabsGoodTitleStaysPutExample,
  TabsGoodUnderlineOnlyExample,
  TabsPageTabsExample,
  TabsPanelTabsExample,
} from "@lairy/ui/tabs/examples";
import type { ComponentType } from "react";

export const TABS_EXAMPLES: Record<string, ComponentType> = {
  "page-tabs": TabsPageTabsExample,
  "panel-tabs": TabsPanelTabsExample,
  "good-underline-only": TabsGoodUnderlineOnlyExample,
  "bad-pill-tabs": TabsBadPillTabsExample,
  "good-title-stays-put": TabsGoodTitleStaysPutExample,
  "bad-overflow-settings": TabsBadOverflowSettingsExample,
  "good-count-in-faint": TabsGoodCountInFaintExample,
  "bad-coloured-badge": TabsBadColouredBadgeExample,
};
