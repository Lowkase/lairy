import {
  CalloutBadActionsExample,
  CalloutBadTitleExample,
  CalloutBadToneExample,
  CalloutErrorExample,
  CalloutGoodActionsExample,
  CalloutGoodTitleExample,
  CalloutGoodToneExample,
  CalloutInfoExample,
  CalloutSuccessExample,
  CalloutWarningExample,
} from "@lairy/ui/callout/examples";
import type { ComponentType } from "react";

/**
 * Content entries reference examples by id (docs/prd.md §7.1); content
 * itself never imports `ui` at runtime (docs/prd.md §6.1), so the docs app
 * is what resolves an id to the real example component. One map like this
 * per component, keyed by the component's own example ids.
 */
export const CALLOUT_EXAMPLES: Record<string, ComponentType> = {
  info: CalloutInfoExample,
  success: CalloutSuccessExample,
  warning: CalloutWarningExample,
  error: CalloutErrorExample,
  "good-title": CalloutGoodTitleExample,
  "bad-title": CalloutBadTitleExample,
  "good-actions": CalloutGoodActionsExample,
  "bad-actions": CalloutBadActionsExample,
  "good-tone": CalloutGoodToneExample,
  "bad-tone": CalloutBadToneExample,
};
