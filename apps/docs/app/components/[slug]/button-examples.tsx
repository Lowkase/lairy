import {
  ButtonBadDangerLabelExample,
  ButtonBadResizedExample,
  ButtonBadThreePrimaryExample,
  ButtonDangerExample,
  ButtonGhostExample,
  ButtonGoodDangerLabelExample,
  ButtonGoodMixedHeightExample,
  ButtonGoodOnePrimaryExample,
  ButtonPrimaryExample,
  ButtonSecondaryExample,
} from "@lairy/ui/button/examples";
import type { ComponentType } from "react";

export const BUTTON_EXAMPLES: Record<string, ComponentType> = {
  secondary: ButtonSecondaryExample,
  primary: ButtonPrimaryExample,
  ghost: ButtonGhostExample,
  danger: ButtonDangerExample,
  "good-one-primary": ButtonGoodOnePrimaryExample,
  "bad-three-primary": ButtonBadThreePrimaryExample,
  "good-danger-label": ButtonGoodDangerLabelExample,
  "bad-danger-label": ButtonBadDangerLabelExample,
  "good-mixed-height": ButtonGoodMixedHeightExample,
  "bad-resized": ButtonBadResizedExample,
};
