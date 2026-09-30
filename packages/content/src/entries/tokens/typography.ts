import { font, fontWeight, leading, text, tracking } from "@lairy/tokens";
import { TokenEntrySchema } from "../../schema/token";

/**
 * Typography tokens: family, weight, size, leading and tracking. None of
 * these carry a dark/light distinction (docs/prd.md §8.2's scale is one set
 * of values for both themes), so every entry here is `themeable: false` and
 * a plain-string value read from `@lairy/tokens` — not the {dark, light}
 * shape colour tokens use (see ./color.ts).
 *
 * `useFor` for the six documented type styles (Display, Title, Metric,
 * Body, Label, Micro) is the PRD §8.2 table's own "Use" column, itself
 * carried over from the prototype's `dsType()`/`typoTokens()`
 * (archive/v1/Workspace Shell.dc.html:14887, 15195). Doc title, Section and
 * Small are the table's other three rows. Callout title has no row — it is
 * a harvested, component-specific size (see its own rationale).
 */
const NO_THEME_AXIS =
  "A typographic value, not a colour — it holds one value for both themes by design; there is no dark/light axis to vary (docs/prd.md §8.2).";

const raw = [
  // Family
  {
    name: "--font-heading",
    group: "Typography — family",
    value: font.heading,
    themeable: false,
    useFor: ["Headings and titles.", "Display, Title and Metric — weight 600 only (typoTokens)."],
    neverFor: ["Body copy, labels or anything set at Section size or smaller."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--font-body",
    group: "Typography — family",
    value: font.body,
    themeable: false,
    useFor: [
      "Body copy, the system default.",
      "Body, Small, Label, Micro and the document default (typoTokens).",
    ],
    rationale: NO_THEME_AXIS,
  },
  // Weight
  {
    name: "--weight-regular",
    group: "Typography — weight",
    value: String(fontWeight.regular),
    themeable: false,
    useFor: ["Every IBM Plex Mono style — Body, Small, Label, Micro."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--weight-semibold",
    group: "Typography — weight",
    value: String(fontWeight.semibold),
    themeable: false,
    useFor: ["Every Space Grotesk style — Display, Title, Metric, Section — and nothing else."],
    neverFor: [
      "A one-off emphasis inside body copy — \"weight is fixed\": the scale changes size and tracking to make a point, it never reaches for a weight (typoScaleNotes).",
    ],
    rationale: NO_THEME_AXIS,
  },
  // Sizes
  {
    name: "--text-display",
    group: "Typography — size",
    value: text.display,
    themeable: false,
    useFor: ["Page hero only (docs/prd.md §8.2)."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--text-doc-title",
    group: "Typography — size",
    value: text.docTitle,
    themeable: false,
    useFor: ["Docs page title (docs/prd.md §8.2)."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--text-title",
    group: "Typography — size",
    value: text.title,
    themeable: false,
    useFor: ["Workspace name (docs/prd.md §8.2)."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--text-metric",
    group: "Typography — size",
    value: text.metric,
    themeable: false,
    useFor: ["Numbers in stat cards (docs/prd.md §8.2)."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--text-section",
    group: "Typography — size",
    value: text.section,
    themeable: false,
    useFor: ["Section titles (docs/prd.md §8.2)."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--text-body",
    group: "Typography — size",
    value: text.body,
    themeable: false,
    useFor: ["Rows, paragraphs (docs/prd.md §8.2)."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--text-small",
    group: "Typography — size",
    value: text.small,
    themeable: false,
    useFor: ["Module titles, hints, buttons, card body (docs/prd.md §8.2)."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--text-label",
    group: "Typography — size",
    value: text.label,
    themeable: false,
    useFor: ["Uppercase panel headers, chips (docs/prd.md §8.2)."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--text-micro",
    group: "Typography — size",
    value: text.micro,
    themeable: false,
    useFor: ["Uppercase codes, badges, table headers (docs/prd.md §8.2)."],
    neverFor: [
      "Anything smaller — this is the hard floor. Nothing in Lairy is set below Micro (AGENTS.md rule 6, docs/prd.md §8.2).",
    ],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--text-callout-title",
    group: "Typography — size",
    value: text.calloutTitle,
    themeable: false,
    useFor: ["Callout's title text."],
    rationale:
      `${NO_THEME_AXIS} Harvested from the prototype's own renderCallout() rather than the documented six-step scale — it lands between Small (13) and Section (17), where the scale has no step. Reviewed and kept as a component-specific size in the LDS-012 token decisions pass.`,
  },
  // Leading (paired 1:1 with the size it sits under)
  {
    name: "--leading-display",
    group: "Typography — leading",
    value: String(leading.display),
    themeable: false,
    useFor: ["Paired with --text-display for the page hero style."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--leading-doc-title",
    group: "Typography — leading",
    value: String(leading.docTitle),
    themeable: false,
    useFor: ["Paired with --text-doc-title for the docs page title."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--leading-title",
    group: "Typography — leading",
    value: String(leading.title),
    themeable: false,
    useFor: ["Paired with --text-title for the workspace name."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--leading-metric",
    group: "Typography — leading",
    value: String(leading.metric),
    themeable: false,
    useFor: ["Paired with --text-metric for stat-card numerals."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--leading-section",
    group: "Typography — leading",
    value: String(leading.section),
    themeable: false,
    useFor: ["Paired with --text-section for section titles."],
    rationale:
      `${NO_THEME_AXIS} docs/prd.md §8.2 leaves Section's leading as "per prototype" with no fixed figure: the prototype's section-title spans set no line-height at all (browser default), while its one wrapped use — the docs page's opening sentence — used 1.55. 1.3 is a harvested middle value serving both, flagged in the LDS-012 token decisions pass.`,
  },
  {
    name: "--leading-body",
    group: "Typography — leading",
    value: String(leading.body),
    themeable: false,
    useFor: ["Paired with --text-body for rows and paragraphs."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--leading-small",
    group: "Typography — leading",
    value: String(leading.small),
    themeable: false,
    useFor: ["Paired with --text-small for module titles, hints, buttons and card body."],
    rationale:
      `${NO_THEME_AXIS} The Typography foundation's own documented value. The prototype's Callout body used 1.55; documented foundations win over prototype markup where they disagree (ADR-0005), so 1.5 is used here and the difference is flagged rather than silently reconciled.`,
  },
  {
    name: "--leading-label",
    group: "Typography — leading",
    value: String(leading.label),
    themeable: false,
    useFor: ["Paired with --text-label for uppercase panel headers and chips."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--leading-micro",
    group: "Typography — leading",
    value: String(leading.micro),
    themeable: false,
    useFor: ["Paired with --text-micro for uppercase codes, badges and table headers."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--leading-callout-title",
    group: "Typography — leading",
    value: String(leading.calloutTitle),
    themeable: false,
    useFor: ["Paired with --text-callout-title for Callout's title."],
    rationale:
      `${NO_THEME_AXIS} Not specified in the prototype's inline style for renderCallout() — a browser's normal line-height for a single-line 600-weight label is roughly 1.2. Harvested as a proposed value in the LDS-012 token decisions pass rather than left unset.`,
  },
  // Tracking
  {
    name: "--tracking-tight-6",
    group: "Typography — tracking",
    value: tracking.tight6,
    themeable: false,
    useFor: ["Callout's action-button label."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--tracking-tight-8",
    group: "Typography — tracking",
    value: tracking.tight8,
    themeable: false,
    useFor: [
      "One of the harvested tracking steps consolidated across components (reference/token-harvest.md §2) — not tied to one of the six documented type styles.",
    ],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--tracking-tight-10",
    group: "Typography — tracking",
    value: tracking.tight10,
    themeable: false,
    useFor: [
      "One of the harvested tracking steps consolidated across components (reference/token-harvest.md §2) — not tied to one of the six documented type styles.",
    ],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--tracking-tight-12",
    group: "Typography — tracking",
    value: tracking.tight12,
    themeable: false,
    useFor: [
      "One of the harvested tracking steps consolidated across components (reference/token-harvest.md §2) — not tied to one of the six documented type styles.",
    ],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--tracking-tight-14",
    group: "Typography — tracking",
    value: tracking.tight14,
    themeable: false,
    useFor: [
      "One of the harvested tracking steps consolidated across components (reference/token-harvest.md §2) — not tied to one of the six documented type styles.",
    ],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--tracking-tight-16",
    group: "Typography — tracking",
    value: tracking.tight16,
    themeable: false,
    useFor: ["Label's uppercase panel-header tracking (docs/prd.md §8.2 type table)."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--tracking-tight-20",
    group: "Typography — tracking",
    value: tracking.tight20,
    themeable: false,
    useFor: ["Micro's uppercase tracking (docs/prd.md §8.2 type table)."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--tracking-tight-neg-1",
    group: "Typography — tracking",
    value: tracking.tightNeg1,
    themeable: false,
    useFor: ["Metric's tracking (docs/prd.md §8.2 type table)."],
    rationale: NO_THEME_AXIS,
  },
  {
    name: "--tracking-tight-neg-2",
    group: "Typography — tracking",
    value: tracking.tightNeg2,
    themeable: false,
    useFor: ["Negative display tracking, shared by Display, Doc title and Title (docs/prd.md §8.2)."],
    rationale: NO_THEME_AXIS,
  },
] as const;

export const typographyTokens = raw.map((entry) => TokenEntrySchema.parse(entry));
