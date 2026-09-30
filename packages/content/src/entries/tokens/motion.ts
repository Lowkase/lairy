import { duration, easing } from "@lairy/tokens";
import { TokenEntrySchema } from "../../schema/token";

/**
 * Motion tokens: the three easing curves and four named durations
 * (docs/prd.md §8.5). `useFor` is the Motion page's own text, verbatim
 * (`motTokens`/`motDurations`, archive/v1/Workspace
 * Shell.dc.html:14983, 14963).
 */
const NO_THEME_AXIS =
  "A motion value, not a colour — it holds one value for both themes by design; there is no dark/light axis to vary (docs/prd.md §8.5).";

const raw = [
  {
    name: "--easing-standard",
    group: "Motion — easing",
    value: easing.standard,
    themeable: false,
    useFor: ["Panel and Reveal's curve — anything that changes shape or enters the page."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--easing-symmetric",
    group: "Motion — easing",
    value: easing.symmetric,
    themeable: false,
    useFor: ["The sweepline loop's curve."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--easing-draw",
    group: "Motion — easing",
    value: easing.draw,
    themeable: false,
    useFor: ["The blueprint line-draw curve, used only there."],
    neverFor: ["Anything other than the blueprint line-draw."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--duration-instant",
    group: "Motion — duration",
    value: duration.instant,
    themeable: false,
    useFor: [
      "Hover fills, chip toggles, row highlights, the fade on a revealed action — short enough to feel like a property of the pointer rather than an animation.",
    ],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--duration-control",
    group: "Motion — duration",
    value: duration.control,
    themeable: false,
    useFor: [
      "Buttons and inputs, where several properties change together: fill, border, transform and shadow.",
    ],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--duration-panel",
    group: "Motion — duration",
    value: duration.panel,
    themeable: false,
    useFor: [
      "Anything that changes the shape of the page: the dock collapsing, the drawer taking width, the header sliding to follow.",
    ],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--duration-reveal",
    group: "Motion — duration",
    value: duration.reveal,
    themeable: false,
    useFor: ["Cards and panels arriving on first paint, spread 360–600ms with no delay on anything."],
    rationale:
      `${NO_THEME_AXIS} The prototype varies this 450–600ms per group weight; 500ms is the documented base step (Motion page motDocs).`,
  },
] as const;

export const motionTokens = raw.map((entry) => TokenEntrySchema.parse(entry));
