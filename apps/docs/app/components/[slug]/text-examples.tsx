import {
  TextBadEmphasisExample,
  TextBadHierarchyExample,
  TextBadNumeralExample,
  TextBodyExample,
  TextCaptionExample,
  TextEyebrowExample,
  TextGoodEmphasisExample,
  TextGoodHierarchyExample,
  TextGoodNumeralExample,
  TextHeadingExample,
  TextStackExample,
} from "@lairy/ui/text/examples";
import type { ComponentType } from "react";

export const TEXT_EXAMPLES: Record<string, ComponentType> = {
  stack: TextStackExample,
  eyebrow: TextEyebrowExample,
  heading: TextHeadingExample,
  body: TextBodyExample,
  caption: TextCaptionExample,
  "good-hierarchy": TextGoodHierarchyExample,
  "bad-hierarchy": TextBadHierarchyExample,
  "good-emphasis": TextGoodEmphasisExample,
  "bad-emphasis": TextBadEmphasisExample,
  "good-numeral": TextGoodNumeralExample,
  "bad-numeral": TextBadNumeralExample,
};
