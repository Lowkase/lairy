import {
  ToastBadFilledBackgroundExample,
  ToastBadQuestionExample,
  ToastBadStackedRepeatsExample,
  ToastDemoExample,
  ToastGoodCollapsedRepeatExample,
  ToastGoodFailureLinkExample,
  ToastGoodOutcomeAndRailExample,
  ToastVariantsExample,
} from "@lairy/ui/toast/examples";
import type { ComponentType } from "react";

export const TOAST_EXAMPLES: Record<string, ComponentType> = {
  demo: ToastDemoExample,
  variants: ToastVariantsExample,
  "good-outcome-and-rail": ToastGoodOutcomeAndRailExample,
  "bad-filled-background": ToastBadFilledBackgroundExample,
  "good-failure-link": ToastGoodFailureLinkExample,
  "bad-question": ToastBadQuestionExample,
  "good-collapsed-repeat": ToastGoodCollapsedRepeatExample,
  "bad-stacked-repeats": ToastBadStackedRepeatsExample,
};
