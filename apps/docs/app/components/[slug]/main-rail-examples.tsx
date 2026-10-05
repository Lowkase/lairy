import {
  MainRailBadHoverAsActiveExample,
  MainRailBadOverflowMenuExample,
  MainRailDemoExample,
  MainRailGoodCollapsedKeepsItemsExample,
  MainRailGoodHoverNoRailExample,
} from "@lairy/ui/main-rail/examples";
import type { ComponentType } from "react";

export const MAIN_RAIL_EXAMPLES: Record<string, ComponentType> = {
  demo: MainRailDemoExample,
  "good-hover-no-rail": MainRailGoodHoverNoRailExample,
  "bad-hover-as-active": MainRailBadHoverAsActiveExample,
  "good-collapsed-keeps-items": MainRailGoodCollapsedKeepsItemsExample,
  "bad-overflow-menu": MainRailBadOverflowMenuExample,
};
