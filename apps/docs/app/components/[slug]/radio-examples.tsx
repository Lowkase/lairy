import {
  RadioBadEmptyGroupExample,
  RadioBadOnOffPairExample,
  RadioBadWrappedGridExample,
  RadioGoodClarifyingLineExample,
  RadioGoodDefaultSelectedExample,
  RadioGoodSwitchInsteadExample,
  RadioIngestOrNormalizeExample,
} from "@lairy/ui/radio/examples";
import type { ComponentType } from "react";

export const RADIO_EXAMPLES: Record<string, ComponentType> = {
  "ingest-or-normalize": RadioIngestOrNormalizeExample,
  "good-default-selected": RadioGoodDefaultSelectedExample,
  "bad-empty-group": RadioBadEmptyGroupExample,
  "good-switch-instead": RadioGoodSwitchInsteadExample,
  "bad-on-off-pair": RadioBadOnOffPairExample,
  "good-clarifying-line": RadioGoodClarifyingLineExample,
  "bad-wrapped-grid": RadioBadWrappedGridExample,
};
