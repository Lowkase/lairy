import { shadow, zIndex } from "@lairy/tokens";
import { TokenEntrySchema } from "../../schema/token";

/**
 * Elevation: 8 shadows and the 5-stop z-index ladder (docs/prd.md §8.7).
 * `useFor` is the Elevation page's own text, verbatim (`elevTokens`/`elevZ`,
 * archive/v1/Workspace Shell.dc.html:15028, 15029–15033 inline in
 * `elevDocs()`).
 */
const NO_THEME_AXIS =
  "An elevation value, not a colour — it holds one value for both themes by design; there is no dark/light axis to vary (docs/prd.md §8.7).";

const raw = [
  {
    name: "--shadow-bubble",
    group: "Elevation — shadow",
    value: shadow.bubble,
    themeable: false,
    useFor: ["Tooltip only."],
    neverFor: ["Any other overlay — Bubble is reserved for Tooltip (elevTokens)."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--shadow-menu",
    group: "Elevation — shadow",
    value: shadow.menu,
    themeable: false,
    useFor: ["Select, popover, overflow menu."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--shadow-overlay",
    group: "Elevation — shadow",
    value: shadow.overlay,
    themeable: false,
    useFor: ["Modal, command bar."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--shadow-overlay-horizontal",
    group: "Elevation — shadow",
    value: shadow.overlayHorizontal,
    themeable: false,
    useFor: ["Drawer, entering from the edge it lives on."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--shadow-hover-lift",
    group: "Elevation — shadow",
    value: shadow.hoverLift,
    themeable: false,
    useFor: ["Hover lift for secondary and ghost controls."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--shadow-hover-lift-accent",
    group: "Elevation — shadow",
    value: shadow.hoverLiftAccent,
    themeable: false,
    useFor: ["Hover lift for the primary button — the amber-tinted variant."],
    rationale: `${NO_THEME_AXIS} References the themed --accent token via color-mix so the tint follows theme, even though the shadow token itself is not per-theme.`,
  },
  {
    name: "--shadow-press",
    group: "Elevation — shadow",
    value: shadow.press,
    themeable: false,
    useFor: ["Press state for secondary and ghost controls."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--shadow-press-primary",
    group: "Elevation — shadow",
    value: shadow.pressPrimary,
    themeable: false,
    useFor: ["Press state for the primary button — a deeper press than the neutral pair."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--z-chrome",
    group: "Elevation — z-index",
    value: String(zIndex.chrome),
    themeable: false,
    useFor: ["The dock, the subnav rail and the top status bar — flat, and first."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--z-rail-stub",
    group: "Elevation — z-index",
    value: String(zIndex.railStub),
    themeable: false,
    useFor: [
      "The collapsed-rail handle — above chrome only because it sits on the seam between two pieces of it.",
    ],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--z-command-bar",
    group: "Elevation — z-index",
    value: String(zIndex.commandBar),
    themeable: false,
    useFor: ["Above the page and its chrome, below anything that could interrupt it."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--z-overlay",
    group: "Elevation — z-index",
    value: String(zIndex.overlay),
    themeable: false,
    useFor: [
      "Modal and drawer — the blocking layer. Both live at the same stop because two are never open at once.",
    ],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--z-toast",
    group: "Elevation — z-index",
    value: String(zIndex.toast),
    themeable: false,
    useFor: ["The top of the ladder, so a confirmation is legible over a modal that caused it."],
    neverFor: [
      "A scrim — Toast is the one stop that never takes one, because a toast interrupts nothing (elevZ).",
    ],
    rationale: NO_THEME_AXIS,
  },
] as const;

export const elevationTokens = raw.map((entry) => TokenEntrySchema.parse(entry));
