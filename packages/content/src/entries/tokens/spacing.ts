import { space } from "@lairy/tokens";
import { TokenEntrySchema } from "../../schema/token";

/**
 * The nine-step spacing ramp (docs/prd.md §8.3). `useFor` is
 * `spacingDocs()`'s own per-step `uses` text, verbatim
 * (archive/v1/Workspace Shell.dc.html:15153) — including its 44px entry,
 * which the prototype's own ramp already documents even though
 * docs/prd.md §8.3's prose names only the first eight steps.
 */
const NO_THEME_AXIS =
  "A spacing value, not a colour — it holds one value for both themes by design; there is no dark/light axis to vary (docs/prd.md §8.3).";

const raw = [
  {
    name: "--space-4",
    group: "Spacing",
    value: space["4"],
    themeable: false,
    useFor: [
      "A label and the value it names. The smallest distance in the system, and the only one that still reads as one thing.",
    ],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--space-6",
    group: "Spacing",
    value: space["6"],
    themeable: false,
    useFor: ["Icon to its text inside a control, and the gap between stacked lines of a caption."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--space-8",
    group: "Spacing",
    value: space["8"],
    themeable: false,
    useFor: ["Sibling controls in a row — buttons, chips, a field and its adornment."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--space-12",
    group: "Spacing",
    value: space["12"],
    themeable: false,
    useFor: ["Rows inside a group, grid gaps in a legend or a small card set."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--space-16",
    group: "Spacing",
    value: space["16"],
    themeable: false,
    useFor: ["Vertical inset of a panel, and the gap between unrelated blocks inside one card."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--space-18",
    group: "Spacing",
    value: space["18"],
    themeable: false,
    useFor: [
      "Horizontal inset of a panel. Paired with 16 vertical so text clears the corner without looking centred.",
    ],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--space-22",
    group: "Spacing",
    value: space["22"],
    themeable: false,
    useFor: ["Inset of a large tile, where the content is a heading rather than a row."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--space-32",
    group: "Spacing",
    value: space["32"],
    themeable: false,
    useFor: ["Between numbered sections of a page, and between major regions of a workspace."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--space-44",
    group: "Spacing",
    value: space["44"],
    themeable: false,
    useFor: ["Page-level breathing room: under a page header, around a hero, at the outer gutter."],
    rationale:
      `${NO_THEME_AXIS} docs/prd.md §8.3's prose names eight steps (4–32); the prototype's own spacingDocs() ramp and reference/harvest-tokens.mjs's SPACING_RAMP already treat 44 as a ninth step, with real padding/margin occurrences mapped onto it, so it is included here rather than left as an off-ramp value (LDS-012).`,
  },
] as const;

export const spacingTokens = raw.map((entry) => TokenEntrySchema.parse(entry));
