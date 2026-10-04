import {
  SwitchAutoRetryFailedRunsExample,
  SwitchBadBehindSaveExample,
  SwitchBadCommandWithOnOffFlanksExample,
  SwitchBadTwoSwitchesAsAlternativesExample,
  SwitchGoodLockedExplainsExample,
  SwitchGoodStackedSettingsExample,
  SwitchGoodStativeLabelExample,
} from "@lairy/ui/switch/examples";
import type { ComponentType } from "react";

export const SWITCH_EXAMPLES: Record<string, ComponentType> = {
  "auto-retry-failed-runs": SwitchAutoRetryFailedRunsExample,
  "good-stative-label": SwitchGoodStativeLabelExample,
  "bad-command-with-on-off-flanks": SwitchBadCommandWithOnOffFlanksExample,
  "good-stacked-settings": SwitchGoodStackedSettingsExample,
  "bad-two-switches-as-alternatives": SwitchBadTwoSwitchesAsAlternativesExample,
  "good-locked-explains": SwitchGoodLockedExplainsExample,
  "bad-behind-save": SwitchBadBehindSaveExample,
};
