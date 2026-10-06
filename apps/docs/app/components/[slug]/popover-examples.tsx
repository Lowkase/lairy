import {
  PopoverBadDestructiveFirstExample,
  PopoverBadDetailFormExample,
  PopoverBadScrollingMenuExample,
  PopoverDemoExample,
  PopoverGoodAnchoredMenuExample,
  PopoverGoodDestructiveBelowDividerExample,
  PopoverGoodDetailOneLinkExample,
} from "@lairy/ui/popover/examples";
import type { ComponentType } from "react";

export const POPOVER_EXAMPLES: Record<string, ComponentType> = {
  demo: PopoverDemoExample,
  "good-destructive-below-divider": PopoverGoodDestructiveBelowDividerExample,
  "bad-destructive-first": PopoverBadDestructiveFirstExample,
  "good-anchored-menu": PopoverGoodAnchoredMenuExample,
  "bad-scrolling-menu": PopoverBadScrollingMenuExample,
  "good-detail-one-link": PopoverGoodDetailOneLinkExample,
  "bad-detail-form": PopoverBadDetailFormExample,
};
