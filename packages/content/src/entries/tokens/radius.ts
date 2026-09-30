import { radius, radiusChip } from "@lairy/tokens";
import { TokenEntrySchema } from "../../schema/token";

/**
 * Radius is locked (AGENTS.md rule 5): `--radius` covers every surface,
 * `--radius-chip` is a shape exception for chips. `useFor` is
 * `radiusTokens()`'s own text, verbatim (archive/v1/Workspace
 * Shell.dc.html:15116); `neverFor` is `radiusContent`'s own rules.
 */
const NO_THEME_AXIS =
  "A radius value, not a colour — it holds one value for both themes by design; there is no dark/light axis to vary (docs/prd.md §8.4).";

const raw = [
  {
    name: "--radius",
    group: "Radius",
    value: radius,
    themeable: false,
    useFor: ["Every surface — the .ds lock."],
    neverFor: [
      "Nesting inside another rounded container — radii do not nest, so rows, dividers and headers inside a rounded panel stay square and run edge to edge (radiusContent).",
      "Scaling with the size of the box — a 900px modal and a 20px badge share the same corner (radiusContent).",
    ],
    rationale: `${NO_THEME_AXIS} Enforced in code via .ds's border-radius 2px !important, not by convention.`,
  },
  {
    name: "--radius-chip",
    group: "Radius",
    value: radiusChip,
    themeable: false,
    useFor: ["Chips only."],
    neverFor: [
      "A size — it is a shape token, not part of the radius scale, and stays 20px at every chip height so the ends always read as fully round (radiusContent).",
    ],
    rationale: NO_THEME_AXIS,
  },
] as const;

export const radiusTokens = raw.map((entry) => TokenEntrySchema.parse(entry));
