import { FoundationEntrySchema } from "../../schema/foundation";

/**
 * Typography, extracted from archive/v1/Workspace Shell.dc.html (template
 * 722–985, logic `typoDocs()` 14973, `typoRelated()` 14896) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling (e.g. "made of", "Text" in the boundary sentence) is
 * dropped as markup, not content. See extractionNotes for every place
 * structured metadata was added or a value was restructured rather than
 * lifted directly.
 */
export const typography = FoundationEntrySchema.parse({
  meta: {
    id: "typography",
    name: "Typography",
    section: "foundations",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-25",
  },
  description: {
    summary: "Two typefaces, six steps, and no decision left to make at the point of use.",
    boundary:
      "Space Grotesk is structure — headings, numerals, anything the eye should land on first. IBM Plex Mono is everything else, which is why the shell reads like an instrument rather than a website. This page owns the metrics: which sizes exist, how they are tracked and led, and when each one is legal. What a block of copy is made of — eyebrow, heading, body, caption — belongs to the Text component.",
  },
  scales: [
    {
      name: "Display",
      tokens: ["font-heading", "weight-semibold", "text-display", "leading-display", "tracking-tight-neg-2"],
      description: "Page hero only",
    },
    {
      name: "Title",
      tokens: ["font-heading", "weight-semibold", "text-title", "leading-title", "tracking-tight-neg-2"],
      description: "Workspace name",
    },
    {
      name: "Metric",
      tokens: ["font-heading", "weight-semibold", "text-metric", "leading-metric", "tracking-tight-neg-1"],
      description: "Numbers in stat cards",
    },
    {
      name: "Body",
      tokens: ["font-body", "weight-regular", "text-body", "leading-body"],
      description: "List rows, paragraphs",
    },
    {
      name: "Label",
      tokens: ["font-body", "weight-regular", "text-label", "leading-label", "tracking-tight-16"],
      description: "Panel headers — uppercase",
    },
    {
      name: "Micro",
      tokens: ["font-body", "weight-regular", "text-micro", "leading-micro", "tracking-tight-20"],
      description: "Codes, captions — uppercase",
    },
  ],
  scalesNote:
    "Six steps and no half sizes. The gaps are wide enough that two adjacent ranks are never mistaken for each other, which is what lets the system get away with so little colour.",
  usage: {
    useWhen: [
      "It names the thing the screen is about — a page, a workspace, a section.",
      "It is a number the operator is meant to read as a result, not as data in a cell.",
      "It is the first thing that should be found when the eye lands.",
      "It is one line. Grotesk is never used for a paragraph.",
    ],
    useInstead: [
      "It is read rather than scanned — any sentence, any description.",
      "It sits in a column with other values and has to align.",
      "It is a code, an ID, a path or a timestamp the operator may copy.",
      "It is a label above a panel, which is Label at .16em and uppercase.",
    ],
  },
  principles: [
    {
      text: "No half steps: A size that is not on the scale is a mistake, not a nuance. If a heading feels wrong at 28px the answer is 34 or 19, never 24.",
      enforceable: { kind: "lint", id: "no-off-scale-size" },
    },
    {
      text: "Weight is fixed: Grotesk is 600 and mono is 400 everywhere. The scale changes size and tracking; it never reaches for a weight to make a point.",
    },
    {
      text: "Tracking follows size: Large Grotesk is tightened to -.02em; small uppercase mono opens to .16em and .2em. Tracking is a function of the step, not a per-screen choice.",
    },
    {
      text: "Line-height is set by rank, not by taste: 1.08 to 1.15 for Grotesk lines, 1.6 for mono body, 1.4 for labels. A paragraph set tighter than 1.6 in a monospace face is unreadable at a glance.",
    },
    {
      text: "Uppercase is always tracked — .16em at Label, .2em at Micro — and never runs longer than three or four words. Sentence case handles anything longer.",
    },
    {
      text: "Body copy is capped near 70 characters. Panels get max-width rather than letting a wide window stretch a line past the point where the eye can find the next one.",
    },
    {
      text: "Numerals an operator compares are Grotesk 600 and right-aligned. Numerals inside prose stay in the mono, where they already align by construction.",
    },
    {
      text: "Sentence case for everything that is read: headings, buttons, empty states, toasts. Title Case is not used anywhere in the system.",
    },
  ],
  accessibilityNotes: [
    {
      title: "Text floors",
      body: "Body never below 12px and captions never below 10.5px, including inside SVG once the viewBox has scaled. The scale has no step below Micro precisely so nothing can drift under the floor.",
    },
    {
      title: "Zoom and reflow",
      body: "Sizes are absolute but layouts are fluid: at 200% zoom every panel reflows to a single column and no line is clipped. Nothing in the shell relies on a fixed line count.",
    },
    {
      title: "Rank without colour",
      body: "Size and family carry hierarchy on their own, so a heading is still a heading in high-contrast mode or when the grey ramp collapses. Colour refines the order; it never creates it.",
    },
    {
      title: "Uppercase and readers",
      body: "Uppercase runs are decorative casing on ordinary text, never typed in caps as content, so a screen reader announces the words rather than spelling them out.",
    },
  ],
  relationships: [
    {
      target: "color",
      kind: "contrasts-with",
      text: "The other half of hierarchy. Grey rank and type rank are set together — a heading that also needs colour to be found is set too small.",
    },
    {
      target: "spacing",
      kind: "contrasts-with",
      text: "Owns the space between the lines this page sizes. Leading belongs to type; the gap between two blocks does not.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-25",
      text: "Line-height and tracking published as part of each step, so a size can no longer be borrowed without its leading.",
    },
    {
      version: "1.0.1",
      date: "2026-08-09",
      text: "Metric split from Title. Same size, looser tracking, and an explicit rule that compared numerals are right-aligned.",
    },
    {
      version: "1.0.0",
      date: "2026-07-28",
      text: "Two families and six steps locked: Grotesk 600 for structure, IBM Plex Mono 400 for everything else. No italic, no third family.",
    },
  ],
  extractionNotes: [
    "The Scale table (`typeScale`, built from `dsType()`) becomes `scales`: each row's single-word `use` field becomes the scale's `description` verbatim, and its family/weight/size/leading/tracking values become a structured `tokens` array of the real token names from packages/content/src/entries/tokens/typography.ts (LDS-013), rather than the inline CSS the prototype renders each row with. Body's tracking (`ls: '0'`) has no token — 0 tracking is the untracked default, not one of the harvested `--tracking-*` steps — so Body's `tokens` omits a tracking entry; flagged for review.",
    "The closing sentence under the Scale table (\"Six steps and no half sizes...\") has no dedicated const in the prototype — it is hardcoded template prose after the `typeScale` sc-for loop. Carried over as `scalesNote`, mirroring Color's own use of the field (LDS-014).",
    "`typoScaleNotes` (three title+body cards: \"No half steps\", \"Weight is fixed\", \"Tracking follows size\") is folded into `principles` as \"{title}: {body}\" sentences, ahead of `typoContent`'s five plain-string rules. FoundationEntrySchema's `principles` is a flat `Rule[]` with no title field, so the title is prefixed into the sentence rather than dropped — a light restructuring of presentation (ADR-0009 permits restructuring prose into fields), not a rewording; the words themselves are unchanged.",
    "`typoRelated()`'s three cards target Text (a component), Color and Spacing. Text has no entry yet and, per the existing `validateFoundationCatalogue` comment in catalogue.ts (LDS-014), foundation `relationships` resolve only against the foundations catalogue, not components — creating a component stub is out of scope for this foundations ticket (AGENTS.md rule 9). The Text relationship is dropped rather than left dangling; Color and Spacing are kept.",
    "Section 03 \"Usage\" (\"Set it in Grotesk when\" / \"Use the mono when\") maps onto `usage.useWhen` / `usage.useInstead` the same way Color's own Usage card did (LDS-014) — Grotesk is the thing reached for, mono is \"something else\".",
    "Section 05 \"Do and don't\" (three live-specimen pairs) is not stored in this entry, for the same reason Color's wasn't (LDS-014): it is the component port procedure's example mechanism (docs/build-guide.md §4 step 6), not Foundation content.",
    "Section 07 \"Tokens\" (`typoTokens`) is not duplicated here either: the docs page resolves each scale's `tokens` against the real token catalogue (packages/content/src/entries/tokens/typography.ts, LDS-013) instead of this entry re-stating values that package already owns, the same pattern Color established.",
  ],
});
