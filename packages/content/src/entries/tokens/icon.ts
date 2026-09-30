import { icon } from "@lairy/tokens";
import { TokenEntrySchema } from "../../schema/token";

/**
 * `--icon-callout`, Callout's icon dimension — the only icon-size token so
 * far. No Icons foundation size scale exists yet (LDS-017); this is a
 * component-specific harvest, flagged as such rather than treated as part
 * of a scale that doesn't exist.
 */
const raw = [
  {
    name: "--icon-callout",
    group: "Icon",
    value: icon.callout,
    themeable: false,
    useFor: ["Callout's icon width and height (17×17), harvested from the prototype's calloutIcon()."],
    rationale:
      "A dimension, not a colour — it holds one value for both themes by design; there is no dark/light axis to vary. It is also a component-specific value rather than a documented scale step: no Icons foundation size scale exists yet (LDS-017), so this token is an exception pending that ticket rather than the first entry of one.",
  },
] as const;

export const iconTokens = raw.map((entry) => TokenEntrySchema.parse(entry));
