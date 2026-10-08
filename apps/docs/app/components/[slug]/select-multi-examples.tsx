import {
  SelectMultiBadCountInsteadOfSetExample,
  SelectMultiBadGrowingFieldExample,
  SelectMultiBadRoundDialsExample,
  SelectMultiDemoExample,
  SelectMultiGoodFixedHeightExample,
} from "@lairy/ui/select-multi/examples";
import type { ComponentType } from "react";

export const SELECT_MULTI_EXAMPLES: Record<string, ComponentType> = {
  demo: SelectMultiDemoExample,
  "good-fixed-height": SelectMultiGoodFixedHeightExample,
  "bad-growing-field": SelectMultiBadGrowingFieldExample,
  "bad-round-dials": SelectMultiBadRoundDialsExample,
  "bad-count-instead-of-set": SelectMultiBadCountInsteadOfSetExample,
};
