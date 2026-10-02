import {
  ProgressBadFakeprecisionExample,
  ProgressBadPartialfillExample,
  ProgressBadResetzeroExample,
  ProgressBarExample,
  ProgressGoodFailureholdsExample,
  ProgressGoodRealcountExample,
  ProgressGoodWholesegmentsExample,
  ProgressMeterExample,
  ProgressStepsExample,
} from "@lairy/ui/progress/examples";
import type { ComponentType } from "react";

/**
 * Content entries reference examples by id (docs/prd.md §7.1); content
 * itself never imports `ui` at runtime (docs/prd.md §6.1), so the docs app
 * is what resolves an id to the real example component. One map like this
 * per component, keyed by the component's own example ids.
 */
export const PROGRESS_EXAMPLES: Record<string, ComponentType> = {
  bar: ProgressBarExample,
  steps: ProgressStepsExample,
  meter: ProgressMeterExample,
  "good-realcount": ProgressGoodRealcountExample,
  "bad-fakeprecision": ProgressBadFakeprecisionExample,
  "good-wholesegments": ProgressGoodWholesegmentsExample,
  "bad-partialfill": ProgressBadPartialfillExample,
  "good-failureholds": ProgressGoodFailureholdsExample,
  "bad-resetzero": ProgressBadResetzeroExample,
};
