import {
  TextareaBadHorizontalResizeExample,
  TextareaBadOneLineExample,
  TextareaBadSwallowedKeystrokesExample,
  TextareaGoodCounterOverLimitExample,
  TextareaGoodThreeLinesExample,
  TextareaGoodVerticalHandleExample,
  TextareaWhyItWasSkippedExample,
} from "@lairy/ui/textarea/examples";
import type { ComponentType } from "react";

export const TEXTAREA_EXAMPLES: Record<string, ComponentType> = {
  "why-it-was-skipped": TextareaWhyItWasSkippedExample,
  "good-three-lines": TextareaGoodThreeLinesExample,
  "bad-one-line": TextareaBadOneLineExample,
  "good-vertical-handle": TextareaGoodVerticalHandleExample,
  "bad-horizontal-resize": TextareaBadHorizontalResizeExample,
  "good-counter-over-limit": TextareaGoodCounterOverLimitExample,
  "bad-swallowed-keystrokes": TextareaBadSwallowedKeystrokesExample,
};
