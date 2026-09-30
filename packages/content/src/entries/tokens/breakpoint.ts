import { breakpoint } from "@lairy/tokens";
import { TokenEntrySchema } from "../../schema/token";

/**
 * Breakpoint tokens (docs/prd.md §8.6). Phone is the unprefixed default
 * below `--breakpoint-tablet` and has no token of its own.
 */
const NO_THEME_AXIS =
  "A layout value, not a colour — it holds one value for both themes by design; there is no dark/light axis to vary (docs/prd.md §8.6).";

const raw = [
  {
    name: "--breakpoint-tablet",
    group: "Breakpoint",
    value: breakpoint.tablet,
    themeable: false,
    useFor: ["The tablet range starts here (640–1023px); below it is phone, the unprefixed default."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--breakpoint-desktop",
    group: "Breakpoint",
    value: breakpoint.desktop,
    themeable: false,
    useFor: ["The desktop range starts here (1024–1439px) — the prototype's own minimum width."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--breakpoint-wide",
    group: "Breakpoint",
    value: breakpoint.wide,
    themeable: false,
    useFor: ["The wide range starts here (≥1440px)."],
    rationale: NO_THEME_AXIS,
  },
] as const;

export const breakpointTokens = raw.map((entry) => TokenEntrySchema.parse(entry));
