import {
  HeaderBadAccentClockExample,
  HeaderBadFourthZoneExample,
  HeaderDemoExample,
  HeaderGoodAmbientGreyExample,
  HeaderGoodChromeOnlyExample,
} from "@lairy/ui/header/examples";
import type { ComponentType } from "react";

export const HEADER_EXAMPLES: Record<string, ComponentType> = {
  demo: HeaderDemoExample,
  "good-chrome-only": HeaderGoodChromeOnlyExample,
  "bad-fourth-zone": HeaderBadFourthZoneExample,
  "good-ambient-grey": HeaderGoodAmbientGreyExample,
  "bad-accent-clock": HeaderBadAccentClockExample,
};
