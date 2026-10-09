import { FoundationEntrySchema } from "../../schema/foundation";

/**
 * Color, extracted from archive/v1/Workspace Shell.dc.html (template
 * 453–721, logic `colorDocs()` 14600, `colorRelated()` 14532) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling in the opening boundary sentence and in the Usage rows is
 * dropped as markup, not content. See extractionNotes for every place
 * structured metadata was added or a value was restructured rather than
 * lifted directly.
 */
export const color = FoundationEntrySchema.parse({
  meta: {
    id: "color",
    name: "Color",
    section: "foundations",
    status: "stable",
    version: "1.2.0",
    updated: "2026-08-25",
  },
  description: {
    summary: "Colour in this system is a rank, not a palette.",
    boundary:
      "Every value here answers one question — how far forward does this sit, and is it asking for a decision. That is the line against Typography and Elevation: type carries structure, colour carries rank, and depth is drawn with a hairline rather than a shadow. When a screen looks flat and still reads in order, colour did the work.",
  },
  scales: [
    {
      name: "Ground",
      tokens: ["bg"],
      description:
        "The page. Nothing else in the system is opaque, which is what lets one set of components serve both themes without a light-mode fork.",
    },
    {
      name: "Surface",
      tokens: ["panel", "panel-2"],
      description:
        "Cards, rails, menus and rows. --panel-2 is reserved for the state a pointer or a selection put there — it is a response, not a second card style.",
    },
    {
      name: "Line",
      tokens: ["border", "border-2", "bracket"],
      description:
        "Every separation in the system. --border divides, --border-2 emphasises an edge that has to be found, --bracket is the HUD corner mark only.",
    },
    {
      name: "Text",
      tokens: ["fg", "dim", "mute", "faint"],
      description:
        "Body, secondary copy, labels, captions — in that order and never out of it. Skipping a rank is how a screen ends up with two competing headings.",
    },
    {
      name: "Amber",
      tokens: ["accent", "accent-soft", "accent-line"],
      description:
        "Act. Primary buttons, focus rings, live status, the current row or step. One amber focus per view, so it never has to compete with itself.",
    },
    {
      name: "Ice",
      tokens: ["accent-2", "accent-2-soft", "accent-2-line"],
      description:
        "Refer. A second data series, an informational badge or toast, a bulk selection, a link inside prose. Ice never appears on something clickable that amber is not already leading.",
    },
    {
      name: "Alarm",
      tokens: ["alarm"],
      description:
        "Failure, and only failure. It is written literally rather than tokenised on purpose: a theme should never be able to redefine what broken looks like, and nothing should be able to borrow the colour by accident.",
    },
  ],
  scalesNote:
    "There is no success colour. Work that finished says so in a word and then gets out of the way — if every good outcome were green, the one bad one would have to shout louder than this interface allows.",
  usage: {
    useWhen: [
      "The view has one action the operator is there to take.",
      "Something is live right now and the operator has to know.",
      "Focus has landed somewhere and the ring has to be unmistakable.",
      "A row, tab or step is the current one among several.",
    ],
    useInstead: [
      "It informs rather than asks — that is Ice.",
      "It failed and needs naming — that is the alarm colour, plus the word.",
      "It is one of several series in a chart — hue there means identity, not urgency.",
      "You only want it noticed sooner — that is Typography, not another accent.",
    ],
  },
  principles: [
    {
      text: "Surfaces are alpha over the ground, never a second opaque hex. A panel that hard-codes its own grey works in one theme and looks pasted on in the other.",
      enforceable: { kind: "lint", id: "no-hardcoded-color" },
    },
    {
      text: "One amber focus per view. If two elements are amber, neither reads as the answer — demote the weaker one to a bordered secondary and the hierarchy returns.",
    },
    {
      text: "Colour never carries meaning on its own. A status gets a word, a series gets a legend, a selection gets a mark; the colour is the second signal, never the first.",
    },
    {
      text: "Every pairing is graded on the worse of its two themes. A value that clears AA in the dark and fails in the light has not passed, it has only passed half the time.",
    },
    {
      text: "Nothing enters the palette without a job no existing role can do. New states borrow a role — they do not arrive with a hue.",
    },
  ],
  accessibilityNotes: [
    {
      title: "Measured, not eyeballed",
      body: "Contrast ratios are computed from the live token values every render, so the documented grade cannot drift after somebody nudges a hex. If a change drops a pairing below AA the table says so on this page first.",
    },
    {
      title: "Two accents, two axes",
      body: "Amber and ice differ in hue and in lightness, so they stay apart under deuteranopia and protanopia. That separation is a safety margin, not a licence to let colour speak alone.",
    },
    {
      title: "Faint is a caption colour",
      body: "--faint is the only rank that does not clear AA for body text in both themes. It is legal on counters, timestamps and single-word meta, and nowhere else — a sentence set in it is a bug.",
    },
    {
      title: "Amber on ground, not the reverse",
      body: "Amber text sits on the ground or on --accent-soft. When amber becomes the fill, the label flips to --bg so the button keeps its ratio instead of putting light text on a light chip.",
    },
  ],
  relationships: [
    {
      target: "typography",
      kind: "contrasts-with",
      text: "Carries structure where colour carries rank. If a thing needs to be found sooner, that is usually a size or a weight, not another hue.",
    },
    {
      target: "elevation",
      kind: "contrasts-with",
      text: "Draws depth with a hairline and a translucent fill rather than a shadow, which is why the surface roles here do the lifting.",
    },
    {
      target: "accessibility",
      kind: "composes-with",
      text: "Holds the rules colour has to satisfy — focus rings, text floors, and the standing ban on colour as the only signal.",
    },
  ],
  changelog: [
    {
      version: "1.2.0",
      date: "2026-08-25",
      text: "Alarm documented as a deliberate literal rather than a token, so no theme can redefine failure and no component can borrow the colour by accident.",
    },
    {
      version: "1.1.0",
      date: "2026-08-12",
      text: "Ice added as the second accent and the act / refer split written down. Informational badges and the second chart series moved off amber.",
    },
    {
      version: "1.0.0",
      date: "2026-07-28",
      text: "Two-theme palette locked: one opaque ground per theme, every surface above it expressed as alpha, four text ranks.",
    },
  ],
  extractionNotes: [
    'The Roles table (colorRoles) becomes `scales`: each role’s `u` usage sentence becomes the scale’s `description`, verbatim, and its loosely-formatted token list (e.g. "--accent-2 · --accent-2-soft · --accent-2-line") becomes a structured `tokens` array of the real token names. Amber’s and Ice’s descriptions open with "Act." and "Refer." in the prototype itself — the ticket’s "Amber (act) and Ice (refer) rules verbatim" is this text, unchanged.',
    'Alarm’s row reads "literal #ff8f6b" in the prototype (colorDocs()’s own `tok` field) rather than naming a token, since at the time that page was written alarm was not yet tokenised. docs/prd.md §8.1 / ADR-0007 since made it the `--alarm` token; this entry’s Alarm scale maps to `tokens: ["alarm"]` to match the content package’s own alarm token entry (packages/content/src/entries/tokens/alarm.ts) rather than keep the now-stale "literal" framing. Flagged for review.',
    "The closing sentence under the Roles table (\"There is no success colour...\") has no dedicated const in the prototype — it is hardcoded template prose after the `colorRoles` sc-for loop. Carried over as the new `scalesNote` field (mirrored from ComponentEntrySchema's `variantsNote`), added to FoundationEntrySchema in this ticket since no foundation entry existed to need it before.",
    "Section 02 (\"Reach for amber when\" / \"Use something else when\") has no schema field to hold it as written in the prototype's current schema, so `usage: { useWhen, useInstead }` (FoundationUsageSchema) is new in this ticket — mirroring CONTEXT.md's generic \"Usage\" glossary entry rather than the component-only UsageSchema, since a foundation's \"use instead\" row does not always name one resolvable target id the way a component's does (three of these four do name another foundation in prose; the fourth does not).",
    '`accessibilityNotes` moves from a plain string array to the shared `{ title, body }` shape (AccessibilityNoteSchema, now also shared with ComponentEntrySchema) so `colorA11y`’s own title+body pairs don’t have to be flattened into one string each.',
    "Relationship `kind` (contrasts-with / contrasts-with / composes-with) is new structured metadata — colorRelated()'s three cards carry no such tag. Typography and Elevation are `contrasts-with` since Color's own opening boundary sentence draws the same two contrasts by name; Accessibility is `composes-with` since its rules apply alongside Color's rather than standing in opposition to them. Flagged for review.",
    "Typography, Elevation and Accessibility exist here only as draft stubs (docs/build-guide.md §3) so Color's relationships have somewhere real to point — each stub's `description` is that foundation's own prototype opening two-sentence block, verbatim, and nothing else.",
    "The prototype's \"Do and don't\" section (04, three pairs of live specimens) and its measured contrast table (05, `a11yContrast()`) are not stored in this entry. The contrast table is explicitly generated at render time from live token values (docs/prd.md §8.1) rather than authored prose, so the docs page computes it directly from `@lairy/tokens` instead of duplicating numbers here; \"Do and don't\" is the component port procedure's example mechanism (docs/build-guide.md §4 step 6), which this foundation ticket does not build out. Flagged as a possible follow-up, not done here to stay in scope (AGENTS.md rule 9).",
    "The prototype's Tokens section (06, `dsTokens()`) is not duplicated here either — the ticket's \"token tables by reference\" is satisfied by the docs page resolving each scale's `tokens` against the real token catalogue (packages/content/src/entries/tokens/color.ts, LDS-013) rather than this entry re-stating values that package already owns.",
  ],
});
