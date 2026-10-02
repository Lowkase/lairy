import {
  TextInputBadPlaceholderAsLabelExample,
  TextInputBadStretchedFieldExample,
  TextInputBadVagueErrorExample,
  TextInputGoodErrorWithFixExample,
  TextInputGoodLabelAboveExample,
  TextInputGoodWidthTracksAnswerExample,
  TextInputPipelineNameExample,
} from "@lairy/ui/text-input/examples";
import type { ComponentType } from "react";

export const TEXT_INPUT_EXAMPLES: Record<string, ComponentType> = {
  "pipeline-name": TextInputPipelineNameExample,
  "good-label-above": TextInputGoodLabelAboveExample,
  "bad-placeholder-as-label": TextInputBadPlaceholderAsLabelExample,
  "good-error-with-fix": TextInputGoodErrorWithFixExample,
  "bad-vague-error": TextInputBadVagueErrorExample,
  "good-width-tracks-answer": TextInputGoodWidthTracksAnswerExample,
  "bad-stretched-field": TextInputBadStretchedFieldExample,
};
