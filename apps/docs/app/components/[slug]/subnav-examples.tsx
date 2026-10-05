import {
  SubnavBadIndentOnlyExample,
  SubnavBadThirdLevelExample,
  SubnavDemoExample,
  SubnavGoodCaseSignalsLevelExample,
  SubnavGoodOneSectionOpenExample,
} from "@lairy/ui/subnav/examples";
import type { ComponentType } from "react";

export const SUBNAV_EXAMPLES: Record<string, ComponentType> = {
  demo: SubnavDemoExample,
  "good-one-section-open": SubnavGoodOneSectionOpenExample,
  "bad-third-level": SubnavBadThirdLevelExample,
  "good-case-signals-level": SubnavGoodCaseSignalsLevelExample,
  "bad-indent-only": SubnavBadIndentOnlyExample,
};
