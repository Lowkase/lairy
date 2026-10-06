import {
  TooltipBadAlreadyLabelledExample,
  TooltipBadConstraintBehindTooltipExample,
  TooltipBadParagraphWithLinkExample,
  TooltipDemoExample,
  TooltipGoodConstraintInHintExample,
  TooltipGoodNameAndShortcutExample,
  TooltipGoodTruncatedValueExample,
} from "@lairy/ui/tooltip/examples";
import type { ComponentType } from "react";

export const TOOLTIP_EXAMPLES: Record<string, ComponentType> = {
  demo: TooltipDemoExample,
  "good-name-and-shortcut": TooltipGoodNameAndShortcutExample,
  "bad-paragraph-with-link": TooltipBadParagraphWithLinkExample,
  "good-constraint-in-hint": TooltipGoodConstraintInHintExample,
  "bad-constraint-behind-tooltip": TooltipBadConstraintBehindTooltipExample,
  "good-truncated-value": TooltipGoodTruncatedValueExample,
  "bad-already-labelled": TooltipBadAlreadyLabelledExample,
};
