import {
  CheckboxBadIndeterminateAsAnswerExample,
  CheckboxBadLabelAsSentenceExample,
  CheckboxBadNegatedLabelExample,
  CheckboxGoodDetailBeneathExample,
  CheckboxGoodIndeterminateFromChildrenExample,
  CheckboxGoodPositiveLabelExample,
  CheckboxRetryFailedStepsExample,
} from "@lairy/ui/checkbox/examples";
import type { ComponentType } from "react";

export const CHECKBOX_EXAMPLES: Record<string, ComponentType> = {
  "retry-failed-steps": CheckboxRetryFailedStepsExample,
  "good-positive-label": CheckboxGoodPositiveLabelExample,
  "bad-negated-label": CheckboxBadNegatedLabelExample,
  "good-detail-beneath": CheckboxGoodDetailBeneathExample,
  "bad-label-as-sentence": CheckboxBadLabelAsSentenceExample,
  "good-indeterminate-from-children": CheckboxGoodIndeterminateFromChildrenExample,
  "bad-indeterminate-as-answer": CheckboxBadIndeterminateAsAnswerExample,
};
