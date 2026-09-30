import { color } from "@lairy/tokens";
import { TokenEntrySchema } from "../../schema/token";

/**
 * The 17 themeable colour tokens, grouped exactly as the prototype's own
 * catalogue table groups them (`dsTokens()`, archive/v1/Workspace
 * Shell.dc.html:14796 — "Surface" / "Line" / "Text" / "Accent" /
 * "Accent — secondary (Ice)"; see reference/INDEX.md §5, Color row).
 * `useFor` is that table's `u` field, verbatim. Values are read from
 * `@lairy/tokens` (docs/prd.md §7.2's "not duplicated"), never re-typed
 * here. Alarm is a separate, non-themeable group — see ./alarm.ts
 * (AGENTS.md rule 4, ADR-0007).
 *
 * `--glow` has no row in `dsTokens()` — it was added after the catalogue
 * table was written, for the workspace header's ambient tint. It carries
 * a `rationale` as the one token in this file that's an exception to "every
 * Color entry maps to a dsTokens() row" (docs/prd.md §7.2).
 */
const raw = [
  {
    name: "--bg",
    group: "Surface",
    value: { dark: color.dark.bg, light: color.light.bg },
    themeable: true,
    useFor: ["Page background."],
  },
  {
    name: "--panel",
    group: "Surface",
    value: { dark: color.dark.panel, light: color.light.panel },
    themeable: true,
    useFor: ["Card fill."],
  },
  {
    name: "--panel-2",
    group: "Surface",
    value: { dark: color.dark.panel2, light: color.light.panel2 },
    themeable: true,
    useFor: ["Hover / active fill."],
    neverFor: [
      "A second, alternate card style — it is reserved for the state a pointer or a selection put there, a response rather than a style choice (colorDocs \"Surface\" role).",
    ],
  },
  {
    name: "--border",
    group: "Line",
    value: { dark: color.dark.border, light: color.light.border },
    themeable: true,
    useFor: ["Hairline, dividers."],
  },
  {
    name: "--border-2",
    group: "Line",
    value: { dark: color.dark.border2, light: color.light.border2 },
    themeable: true,
    useFor: ["Emphasis border."],
  },
  {
    name: "--bracket",
    group: "Line",
    value: { dark: color.dark.bracket, light: color.light.bracket },
    themeable: true,
    useFor: ["HUD corner brackets."],
    neverFor: [
      "An ordinary divider or emphasis edge — it is the HUD corner mark only (colorDocs \"Line\" role); use --border or --border-2 instead.",
    ],
  },
  {
    name: "--fg",
    group: "Text",
    value: { dark: color.dark.fg, light: color.light.fg },
    themeable: true,
    useFor: ["Primary text, icons."],
  },
  {
    name: "--dim",
    group: "Text",
    value: { dark: color.dark.dim, light: color.light.dim },
    themeable: true,
    useFor: ["Secondary text."],
  },
  {
    name: "--mute",
    group: "Text",
    value: { dark: color.dark.mute, light: color.light.mute },
    themeable: true,
    useFor: ["Labels, timestamps."],
  },
  {
    name: "--faint",
    group: "Text",
    value: { dark: color.dark.faint, light: color.light.faint },
    themeable: true,
    useFor: ["Tertiary only — never body."],
    neverFor: [
      "Body text or a sentence — it is the only text rank that does not clear AA for body copy in either theme, legal only on counters, timestamps and single-word meta (colorA11y \"Faint is a caption colour\"). A sentence set in it is a bug.",
    ],
  },
  {
    name: "--accent",
    group: "Accent",
    value: { dark: color.dark.accent, light: color.light.accent },
    themeable: true,
    useFor: ["Live, alert, primary action."],
    neverFor: [
      "A second, simultaneous focus in the same view — if two elements are amber, neither reads as the answer; demote the weaker one instead (colorContent).",
    ],
  },
  {
    name: "--accent-soft",
    group: "Accent",
    value: { dark: color.dark.accentSoft, light: color.light.accentSoft },
    themeable: true,
    useFor: ["Accent fill."],
  },
  {
    name: "--accent-line",
    group: "Accent",
    value: { dark: color.dark.accentLine, light: color.light.accentLine },
    themeable: true,
    useFor: ["Accent border."],
  },
  {
    name: "--accent-2",
    group: "Accent — secondary (Ice)",
    value: { dark: color.dark.accent2, light: color.light.accent2 },
    themeable: true,
    useFor: ["Secondary signal — data, links in charts, informational state."],
    neverFor: [
      "Something clickable that amber is not already leading — Ice refers, it never leads an action on its own (colorDocs \"Ice\" role).",
    ],
  },
  {
    name: "--accent-2-soft",
    group: "Accent — secondary (Ice)",
    value: { dark: color.dark.accent2Soft, light: color.light.accent2Soft },
    themeable: true,
    useFor: ["Secondary fill."],
  },
  {
    name: "--accent-2-line",
    group: "Accent — secondary (Ice)",
    value: { dark: color.dark.accent2Line, light: color.light.accent2Line },
    themeable: true,
    useFor: ["Secondary border."],
  },
  {
    name: "--glow",
    group: "Surface",
    value: { dark: color.dark.glow, light: color.light.glow },
    themeable: true,
    useFor: ["The ambient radial-gradient tint behind the workspace header."],
    rationale:
      "Not part of the prototype's own dsTokens() catalogue table — added for the workspace header's ambient background effect, which the documented Color foundation page predates. Themeable because, like every other Surface tint, it is expressed as a low-opacity value over the ground and must invert with it (colorContent's alpha-over-ground rule).",
  },
] as const;

export const colorTokens = raw.map((entry) => TokenEntrySchema.parse(entry));
