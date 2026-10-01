import { icon } from "@lairy/tokens";
import { TokenEntrySchema } from "../../schema/token";

/**
 * Icon tokens: Callout's own component-specific dimension, plus the Icons
 * foundation size scale added by LDS-017 (packages/ui/src/icons/glyph.tsx,
 * inline-icon.tsx) — the gap `--icon-callout` used to flag as "pending that
 * ticket" is now resolved by the five scale tokens below.
 */
const raw = [
  {
    name: "--icon-callout",
    group: "Icon",
    value: icon.callout,
    themeable: false,
    useFor: ["Callout's icon width and height (17×17), harvested from the prototype's calloutIcon()."],
    rationale:
      "A dimension, not a colour — it holds one value for both themes by design; there is no dark/light axis to vary. It predates the Icons foundation size scale below and stays a standalone exception rather than being folded into it: 17px is Callout's own harvested value, not an instance of the Inline icon scale's 16px box.",
  },
  {
    name: "--icon-glyph-rail",
    group: "Icon",
    value: icon.glyphRail,
    themeable: false,
    useFor: ["The Glyph box in the dock rail and other collapsed-nav contexts (Icons foundation, Glyph scale)."],
    rationale:
      "A dimension, not a colour — one value for both themes by design. The lower end of the Glyph scale's documented 22–34px range (icoDocs); packages/content/src/entries/foundations/icons.ts's own extractionNotes flagged this range as tokenless pending this ticket (LDS-017).",
  },
  {
    name: "--icon-glyph-tile",
    group: "Icon",
    value: icon.glyphTile,
    themeable: false,
    useFor: ["The Glyph box for section tiles and empty states (Icons foundation, Glyph scale)."],
    rationale:
      "A dimension, not a colour — one value for both themes by design. The upper end of the Glyph scale's range and the prototype glyph()'s own default size; the Glyph React component (packages/ui/src/icons/glyph.tsx) defaults to this size.",
  },
  {
    name: "--icon-inline",
    group: "Icon",
    value: icon.inline,
    themeable: false,
    useFor: ["The Inline icon box (Icons foundation, Inline icon scale)."],
    rationale:
      "A dimension, not a colour — one value for both themes by design. Fixed rather than a range: the prototype's icon() hardcodes 16×16 with no size parameter, because the Inline icon scale is sized to match 14px body text rather than a rail/tile pair like Glyph.",
  },
  {
    name: "--icon-stroke-glyph",
    group: "Icon",
    value: String(icon.strokeGlyph),
    themeable: false,
    useFor: ["Stroke width for every Glyph path (Icons foundation Construction rule 2)."],
    rationale:
      "A number, not a colour — one value for both themes by design; a stroke weight has no dark/light axis. Heavier than the inline stroke on purpose, per the Icons foundation: at 22px in a column of its own, a glyph has no adjacent type to borrow weight from.",
  },
  {
    name: "--icon-stroke-inline",
    group: "Icon",
    value: String(icon.strokeInline),
    themeable: false,
    useFor: ["Stroke width for every Inline icon path (Icons foundation Construction rule 2)."],
    rationale:
      "A number, not a colour — one value for both themes by design. Sized and weighted to match 14px body text, which is why it looks thin if scaled up into Glyph territory.",
  },
] as const;

export const iconTokens = raw.map((entry) => TokenEntrySchema.parse(entry));
