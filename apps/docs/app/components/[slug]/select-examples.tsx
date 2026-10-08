import {
  SelectBadLabelAsPlaceholderExample,
  SelectBadTwoOptionSelectsExample,
  SelectDemoExample,
  SelectGoodErrorInWordsExample,
  SelectGoodLabelAboveExample,
} from "@lairy/ui/select/examples";
import type { ComponentType } from "react";

export const SELECT_EXAMPLES: Record<string, ComponentType> = {
  demo: SelectDemoExample,
  "good-label-above": SelectGoodLabelAboveExample,
  "bad-label-as-placeholder": SelectBadLabelAsPlaceholderExample,
  "good-error-in-words": SelectGoodErrorInWordsExample,
  "bad-two-option-selects": SelectBadTwoOptionSelectsExample,
};
