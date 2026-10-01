import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/text/examples";

/**
 * Text, extracted from archive/v1/Workspace Shell.dc.html (template
 * 2975–3326, logic `txAnatomy` 16206, `txContent` 16213, `txA11y` 16220,
 * `txTokens` 16226, `txRelatedGo` 16234, `txLog` 16428) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on token names inside prose (e.g. "--mute", "--faint",
 * component names inside Usage/Related rows) is dropped as markup, not
 * content. See extractionNotes for every place structured metadata was
 * added, a literal was replaced by a token, or a prototype value had no
 * token to map to.
 */
export const text = ComponentEntrySchema.parse({
  meta: {
    id: "text",
    name: "Text",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-10-01",
  },
  purpose: "Renders a block of copy in its role — eyebrow, heading, body or caption — with no typographic decision left to make at the point of use.",
  description: {
    summary: "Text is two typefaces and four weights of grey, and every other typographic decision is already made.",
    boundary:
      "Space Grotesk sets headings and numerals; IBM Plex Mono sets everything else, which is why this shell reads like an instrument rather than a document. There is no separate colour for emphasis: importance is carried by the grey ramp — --fg, --dim, --mute, --faint — and amber is reserved for things that act. Bold and italic are not part of the system.",
  },
  anatomy: [
    {
      number: "1",
      name: "Eyebrow",
      description:
        "An 11px --faint caps line at .2em tracking, above the heading. It carries the coordinates — which pipeline, which run — so the heading does not have to spend words locating itself.",
    },
    {
      number: "2",
      name: "Heading",
      description:
        "Space Grotesk 600 with -.02em tracking, the only place the sans appears in a text block. Sentence case, one line, no full stop: it is a name, not a sentence.",
    },
    {
      number: "3",
      name: "Body",
      description:
        "IBM Plex Mono at 14px on 1.6, set in --dim rather than --fg so the heading above it keeps its rank. Two or three lines at about a 70-character measure.",
    },
    {
      number: "4",
      name: "Emphasis",
      description:
        "One step up the ramp to --fg for the clause that matters. This is the system’s entire emphasis vocabulary — no bold, no italic, no colour — so it can never compete with amber.",
    },
    {
      number: "5",
      name: "Caption",
      description:
        "The smallest role, 11px --faint caps: timestamps, codes, counts. Its job is to be available rather than read, which is why it sits below everything and never above the heading.",
    },
  ],
  anatomyCaption:
    "One block using all five roles in the order they usually appear. Each part takes one edge and every position is measured from the artifact.",
  variants: [
    {
      name: "Eyebrow",
      tokens: ["mute"],
      description:
        "An 11px --faint caps line at .2em tracking, above the heading. It carries the coordinates — which pipeline, which run — so the heading does not have to spend words locating itself.",
    },
    {
      name: "Heading",
      tokens: ["fg"],
      description:
        "Space Grotesk 600 with -.02em tracking, the only place the sans appears in a text block. Sentence case, one line, no full stop: it is a name, not a sentence.",
    },
    {
      name: "Body",
      tokens: ["dim"],
      description:
        "IBM Plex Mono at 14px on 1.6, set in --dim rather than --fg so the heading above it keeps its rank. Two or three lines at about a 70-character measure.",
    },
    {
      name: "Caption",
      tokens: ["mute"],
      description:
        "The smallest role, 11px --faint caps: timestamps, codes, counts. Its job is to be available rather than read, which is why it sits below everything and never above the heading.",
    },
  ],
  usage: {
    useWhen: [
      "One thing in a block matters more than the rest — move it up, not bigger.",
      "A line is supporting detail — --mute says so without shrinking it.",
      "The text is a machine fact nobody has to read — that is --faint.",
      "Two lines sit side by side and one is the answer — the ramp ranks them.",
    ],
    useInstead: [
      {
        target: "badge",
        text: "The text is a system-assigned status — that is a Badge.",
      },
      {
        target: "button",
        text: "The text acts when pressed — that is a Button or a link.",
      },
      {
        target: "empty-state",
        text: "There is no content to describe — that is an Empty state.",
      },
    ],
  },
  contentRules: [
    {
      text: "Write headings in sentence case with no terminal punctuation, and keep them to one line — a wrapping heading is a body paragraph that has not admitted it yet.",
    },
    {
      text: "Keep body paragraphs to three lines at a measure of roughly 70 characters. This shell is read while something is running; long copy will not be read at all.",
    },
    {
      text: "Reserve tracked caps for two or three words. Labels and captions only — a sentence in caps costs the reader more than the emphasis is worth.",
    },
    {
      text: "Set numbers in Grotesk with tabular figures wherever they stack, so a column of values lines up on the digit rather than drifting.",
    },
    {
      text: "Use the // prefix voice for machine asides in captions, and never for anything the operator is expected to act on.",
    },
  ],
  propGuidance: [
    {
      prop: "variant",
      note: "Eyebrow sits above the heading and caption sits below everything — never above it (Anatomy #1, #5).",
    },
    {
      prop: "as",
      note: 'A heading is an h2 or h3 because of where it sits in the document, not because of its size — "the outline underneath them has to stand on its own" (Accessibility "Structure, not styling").',
    },
    {
      prop: "emphasis",
      note: "One step up the ramp to --fg for the clause that matters — the system's entire emphasis vocabulary; no bold, no italic, no colour (Anatomy #4).",
    },
    {
      prop: "numeric",
      note: "Set numbers in Grotesk with tabular figures wherever they stack (Content rule 4).",
    },
  ],
  examples: [
    {
      id: "stack",
      kind: "demo",
      title: "Stack",
      source: `${EXAMPLES_DIR}/stack.tsx`,
    },
    {
      id: "eyebrow",
      kind: "demo",
      title: "Eyebrow",
      source: `${EXAMPLES_DIR}/eyebrow.tsx`,
    },
    {
      id: "heading",
      kind: "demo",
      title: "Heading",
      source: `${EXAMPLES_DIR}/heading.tsx`,
    },
    {
      id: "body",
      kind: "demo",
      title: "Body",
      source: `${EXAMPLES_DIR}/body.tsx`,
    },
    {
      id: "caption",
      kind: "demo",
      title: "Caption",
      source: `${EXAMPLES_DIR}/caption.tsx`,
    },
    {
      id: "good-hierarchy",
      kind: "good",
      title: "Three steps down the ramp",
      caption:
        "Three steps down the ramp in one block: caption, heading, body. The hierarchy is colour, not size alone.",
      source: `${EXAMPLES_DIR}/good-hierarchy.tsx`,
    },
    {
      id: "bad-hierarchy",
      kind: "bad",
      title: "A whole block at --fg",
      caption: "Never set a whole block at --fg — when everything is loudest, the block has no shape at all.",
      source: `${EXAMPLES_DIR}/bad-hierarchy.tsx`,
    },
    {
      id: "good-emphasis",
      kind: "good",
      title: "One clause, one step up",
      caption: "Emphasis inside a sentence is one step up the ramp, applied to the clause that matters.",
      source: `${EXAMPLES_DIR}/good-emphasis.tsx`,
    },
    {
      id: "bad-emphasis",
      kind: "bad",
      title: "Amber or weight for emphasis",
      caption:
        "Never emphasise with amber or with weight — amber is for things that act, and there is no bold in this system.",
      source: `${EXAMPLES_DIR}/bad-emphasis.tsx`,
    },
    {
      id: "good-numeral",
      kind: "good",
      title: "Tracked label, Grotesk numeral",
      caption: "A label in tracked caps over a Grotesk numeral: the pattern every stat in the shell uses.",
      source: `${EXAMPLES_DIR}/good-numeral.tsx`,
    },
    {
      id: "bad-numeral",
      kind: "bad",
      title: "A sentence in tracked caps",
      caption:
        "Never run a sentence in tracked caps — the tracking that makes two words legible makes ten words a wall.",
      source: `${EXAMPLES_DIR}/bad-numeral.tsx`,
    },
  ],
  accessibility: [
    {
      title: "The ramp is measured",
      body: "--fg reads 15.8:1 on --bg, --dim 10.4:1 and --mute 5.7:1, all above the 4.5:1 body threshold. --faint measures 4.1:1, which is why it is restricted to 11px caps captions that repeat information available elsewhere.",
    },
    {
      title: "Size has a floor",
      body: "Nothing below 10.5px, and nothing below 12px that carries information found nowhere else. The mono face buys legibility at small sizes but it does not buy an exemption.",
    },
    {
      title: "Structure, not styling",
      body: "A heading is an h2 or h3 because of where it sits in the document, not because of its size. Type roles here are visual; the outline underneath them has to stand on its own.",
    },
    {
      title: "Colour is never alone",
      body: "Error copy is --alarm and also says what is wrong in words; a struck-through line is also labelled complete. The ramp ranks importance — it never carries the meaning by itself.",
    },
  ],
  tokens: [
    { tokens: ["fg"], usage: "Headings, emphasis, values." },
    { tokens: ["dim"], usage: "Body copy, panel labels." },
    { tokens: ["mute"], usage: "Secondary lines, supporting detail." },
    { tokens: ["faint"], usage: "Captions, codes, timestamps." },
  ],
  relationships: [
    {
      target: "badge",
      kind: "often-confused-with",
      text: "Differs in that a badge is a system-assigned status in a box. Coloured text is not a badge, and a badge is never a way to emphasise a word.",
    },
    {
      target: "button",
      kind: "contrasts-with",
      text: "Where amber lives. If a run of text is amber and not inside a button or a link, something has taken the accent that should not have.",
    },
    {
      target: "card",
      kind: "composes-with",
      text: "The container these roles are usually composed inside: eyebrow, heading, body, caption is the card’s stack in the order given here.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-25",
      text: "Numeral role documented as tabular Grotesk; bold and italic ruled out; body colour fixed at --dim.",
    },
    {
      version: "1.0.1",
      date: "2026-08-18",
      text: "--faint restricted to captions after contrast measurement; caption tracking raised to .2em.",
    },
    {
      version: "1.0.0",
      date: "2026-08-11",
      text: "Type system introduced — Space Grotesk for headings, IBM Plex Mono for everything else.",
    },
  ],
  extractionNotes: [
    "The fourth \"use something else\" row (\"the paragraph runs past four lines — it needs a document, not a panel\") names no component — there is no entry for a generic long-form document surface — so it isn't a structured `useInstead` row with a `target`, the same judgment button.ts made for its own untargetable fourth row (LDS-018). The other three rows (Badge, Button, Empty state) each point at a real or draft entry per docs/build-guide.md §3.",
    "`empty-state` has no ticket of its own yet and is created here as a draft stub (packages/content/src/entries/components/empty-state.ts) purely so this entry's third `useInstead` row resolves (catalogue.ts's dangling-target check). It has no CONTEXT.md glossary entry, so its stub `purpose` is paraphrased from this entry's own useInstead sentence about it, flagged pending its own ticket — the same thing card.ts's stub did for Cards (LDS-018).",
    "Relationship `kind` (often-confused-with for Badges, contrasts-with for Buttons, composes-with for Cards) is new structured metadata the prototype's Related cards carry no tag for, the same judgment call as callout.ts and button.ts: Badges is a boundary confusion (\"coloured text is not a badge\"); Buttons is a contrast (amber belongs there, never here); Cards is where these roles are composed. Flagged for review.",
    "The Variants section's four rows (Eyebrow/Heading/Body/Caption) reuse their matching Anatomy row's description verbatim rather than drawing on new prose: the prototype's own `txAnatomy` is the only place each role gets its own paragraph. The page's separate, hardcoded \"Roles\" table (template lines 3023–3084: Display/Heading/Body/Label/Caption/Numeral, not bound to any `const` — unlike every other section on this page) is treated as presentational duplication of content the Typography foundation already owns (its `scales`, LDS-015) and is not extracted a second time here, the same boundary typography.ts's own extractionNotes drew when it dropped its Tokens and Do/Don't sections as component-port territory. Where the two tables' role names overlap (Heading, Body, Caption) the Roles table's prose broadly agrees with `txAnatomy`'s; Display, Label and Numeral belong to Typography's scale, not to this component's four shipped variants (docs/prd.md §9.2's own boundary sentence: \"What a block of copy is made of — eyebrow, heading, body, caption — belongs to the Text component\").",
    "Anatomy #4 \"Emphasis\" is not one of the four shipped variants (the ticket's acceptance criteria name exactly eyebrow/heading/body/caption): its own prose describes an in-sentence modifier (\"one step up the ramp... for the clause that matters\"), not a standalone role chosen instead of the other four. The shipped component (packages/ui/src/text/text.tsx) implements it as an `emphasis` boolean prop usable alongside any variant instead, which is what the Anatomy diagram's own specimen shows: a `body`-variant line with Emphasis applied, not a block that is only Emphasis.",
    "Tabular numerals are mentioned only in Content rule 4, the prototype's own changelog (`txLog` 1.1.0, \"Numeral role documented as tabular Grotesk\") and the hardcoded Roles table — never in `txAnatomy`, so there is no sixth anatomy part for it either. Per the ticket's own acceptance criterion (\"with tabular numerals\"), this is shipped as a `numeric` boolean prop (Grotesk + `tabular-nums`) rather than a fifth variant.",
    "The `as` prop has no prototype counterpart — the prototype never documented a JS API (same gap callout.ts's and button.ts's own propGuidance notes flagged). It exists so this entry's own Accessibility note \"Structure, not styling\" is actually enforceable: the component's `variant` picks the visual role while `as` picks the semantic element, so a Heading-styled span can still be rendered as an `h2` where the document outline calls for one.",
    "Tokens section rows for \"Space Grotesk 600\" (`u: 'Display, headings, numerals'`) and \"IBM Plex Mono\" (`u: 'Body, labels, captions, everything else'`) are dropped from the structured `tokens` field: `TokenUsageSchema.tokens` is `ColorTokenNameSchema`-only (packages/content/src/schema/component.ts), the same constraint that keeps Button's own font/tracking tokens out of its Tokens section (see button.ts's own extractionNotes). The four colour rows (--fg/--dim/--mute/--faint) are kept verbatim; the font-family pairing is carried instead by the shipped component's per-variant `font-heading`/`font-body` classes.",
    "Accessibility note 4 (\"Colour is never alone\") reads `Error copy is #ff8f6b` in the prototype's own `txA11y`. Replaced here with the token name `--alarm`, the same literal-to-token correction color.ts's own extractionNotes made for Color's Alarm row — alarm was tokenised after this page's prose was written (ADR-0007). Flagged for review.",
    "Eyebrow and Caption's own anatomy/variant prose says `--faint`, verbatim from `txAnatomy` (ADR-0009 keeps it that way), but the shipped component (packages/ui/src/text/text.tsx) renders both in `--mute` instead: `--faint` only clears \"AA large\" (3.69:1 in the light theme, confirmed by axe against apps/docs/e2e/text.spec.ts's `/dev/text` route) — short of the 4.5:1 floor normal-size text needs — while `--mute` clears 4.5:1 in both themes. This is the exact gap apps/docs/components/docs-page/page-header.tsx and section.tsx already document and route around for the docs chrome itself (LDS-014's \"--faint fails the 4.5:1 AA floor for normal-size text in the light theme ... --mute clears it in both themes\"); this entry's own Accessibility note 1 (\"The ramp is measured\") already flags --faint's 4.1:1 dark-theme figure as sub-AA and names redundancy (\"restricted to captions that repeat information available elsewhere\") as the reason it was judged acceptable in the prototype — a judgment axe can't apply, so the shipped component doesn't rely on it. `variants[].tokens` for Eyebrow and Caption are `[\"mute\"]`, reflecting the shipped colour rather than the prototype's literal `--faint`, the same kind of deviation button.ts's own Danger variant documented for its label colour. The Tokens section's own `--faint` row (§08, verbatim from `txTokens`) is left as the prototype wrote it rather than rewritten to match.",
    "No value here needed off-scale size/spacing mapping (docs/prd.md §8.2–8.3) except Heading's own size, which the shipped component's extractionNotes-equivalent lives in packages/tokens/tokens/typography.json: the Text page's own Heading specimens (template lines 2994 and 3095) render at 24px/-.02em/1.15, a value not covered by §8.2's default off-scale mapping and not matching any of the Typography foundation's six documented scales (Display 48, Title 28, Metric 28, Section 17, Body 14, Micro 11 px) or the two additional docs-chrome steps Callout's own ticket added (Small 13, Label 12, Doc title 34, Section 17 already covered). Section (17px, \"Section titles\") was considered and rejected as a reuse target: packages/content/src/entries/foundations/typography.ts's own extractionNotes describe Section as a docs-page-chrome style added for LDS-005, not a product scale step, and typography.ts's `scales` field (the foundation's own documented six) doesn't include it — reusing docs chrome for a shipped product component would be the wrong kind of borrowing even though the pixel values happen to be close to what the Roles table's own \"17–28px\" range implies. A new `text-heading`/`leading-heading` pair was harvested and flagged instead (packages/tokens/tokens/typography.json), the same treatment given to Callout's own `callout-title` (LDS-005) — proposed as-is pending the token decisions ticket, flagged in the PR.",
  ],
});
