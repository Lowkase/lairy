import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/usage-card/examples";

/**
 * Usage card, extracted from archive/v1/Workspace Shell.dc.html (template
 * 9310–9470, logic usageCardDocs() 17023) per docs/build-guide.md §3. Prose
 * is verbatim (ADR-0009); inline `<span>` colour styling on "Callout" in the
 * opening boundary sentence is dropped as markup, not content. See
 * extractionNotes for every place structured metadata was added or a row
 * didn't fit the schema cleanly.
 */
export const usageCard = ComponentEntrySchema.parse({
  meta: {
    id: "usage-card",
    name: "Usage card",
    section: "components",
    status: "stable",
    version: "1.0.0",
    updated: "2026-10-01",
  },
  // CONTEXT.md's own glossary sentence, verbatim — the same treatment
  // callout.ts gave Toast, Modal and Badge's stub `purpose` fields.
  purpose:
    'The paired "use when / use something else when" card on a docs page. Not an operator-facing component outside documentation.',
  description: {
    summary:
      "A Usage Card states a rule in two halves — where a component belongs, and where it doesn't.",
    boundary:
      "It exists so a doc page can draw its own boundary in one glance, instead of burying it in a paragraph. That is the line against Callout: a callout reports one live fact with an icon, this card states a standing rule with none. It is documentation furniture, not a product surface — no screen outside this reference site renders one, at least for now.",
  },
  anatomy: [
    {
      number: "1",
      name: "Pair",
      description:
        "Always two, side by side, never one alone — the belongs-here card only means something next to its opposite.",
    },
    {
      number: "2",
      name: "Title",
      description:
        '11px uppercase at .2em: "Use when" / "Reach for X when" on the left, "Use something else when" on the right, always in that order.',
    },
    {
      number: "3",
      name: "Rows",
      description:
        "A plain list of full sentences, 13.5px --dim, 9px gap, no bullets or numbers — each row is one condition, not a fragment.",
    },
    {
      number: "4",
      name: "Frame",
      description:
        "Left card gets --accent-line border and --accent-soft fill; right card gets a plain --border-2 border and no fill. Colour marks which side is the recommendation.",
    },
  ],
  anatomyCaption:
    "Always a pair, never a single card. Each part takes one edge and every position is measured from the artifact.",
  usage: {
    useWhen: [
      "A doc page needs to draw a hard boundary against its nearest neighbour.",
      "The rule has a real opposite worth naming, not just a definition to restate.",
    ],
    useInstead: [
      {
        target: "callout",
        text: "The fact is live and momentary, not a standing rule — that is a Callout.",
      },
    ],
  },
  contentRules: [
    {
      text: 'The left title always names the affirmative case in the page’s own words ("Use when", "Reach for amber when") — never a generic "Do".',
    },
    {
      text: 'The right title is always the fixed phrase "Use something else when" and always names the correct component inline, in --fg, inside the sentence.',
    },
    {
      text: "Each row is a complete condition an operator could actually be facing, not a restated definition of the component itself.",
    },
    {
      text: "Row count does not have to match between the two sides — the right side is often shorter, because ruling something out takes fewer words than justifying it.",
    },
    {
      text: "Never a single card. If there is nothing to rule out, the usage rule belongs in prose in the opening description instead.",
    },
  ],
  propGuidance: [
    {
      prop: "useWhenTitle",
      note: 'Names the affirmative case in the page’s own words — never a generic "Do" (Content rule 1).',
    },
  ],
  examples: [
    {
      id: "pair",
      kind: "demo",
      title: "Pair",
      source: `${EXAMPLES_DIR}/pair.tsx`,
    },
    {
      id: "good-pair",
      kind: "good",
      title: "Custom recommendation title",
      caption:
        'The left title narrows to the page’s own words ("Reach for amber when") instead of the generic default — Content rule 1.',
      source: `${EXAMPLES_DIR}/good-pair.tsx`,
    },
    {
      id: "bad-single",
      kind: "bad",
      title: "A single card alone",
      caption:
        "One card with nothing to rule out reads as unfinished — a standalone rule like this belongs in prose in the opening description instead (Content rule 5).",
      source: `${EXAMPLES_DIR}/bad-single.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Not interactive",
      body: "Neither card is a control — no focus ring, no onClick, no tabIndex. It is read, not operated.",
    },
    {
      title: "Colour never alone",
      body: "The recommended side carries the amber border and fill together; a colour-blind reader still gets the left/right position and the title text.",
    },
    {
      title: "Reading order matches DOM order",
      body: "The recommended card is always first in markup as well as on screen, so a screen reader hears the affirmative case before the exclusions.",
    },
    {
      title: "Component names are real links",
      body: "Where the right card names another component inline, that word should be reachable, not just coloured — treat it the way Related treats its cards.",
    },
  ],
  tokens: [
    {
      tokens: ["accent-line", "accent-soft"],
      usage: "Recommended card: border and fill.",
    },
    { tokens: ["border-2"], usage: "Alternative card: border, no fill." },
    { tokens: ["accent", "mute"], usage: "Title colour, left vs. right." },
    { tokens: ["dim"], usage: "Row text." },
    { tokens: ["fg"], usage: "A named component inline in a row." },
  ],
  relationships: [
    {
      target: "callout",
      kind: "often-confused-with",
      text: "The nearest neighbour by look, not by job. A callout has an icon and reports one live fact; this card has no icon and states a standing rule.",
    },
    {
      target: "card",
      kind: "composes-with",
      text: "The plain bordered box this pattern is built from. Usage Card is a fixed, paired arrangement of that box — never a variant registered on Cards itself.",
    },
  ],
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-01",
      text: "Documented as its own component — this pattern already appeared, identically, on every Foundations and Components doc page.",
    },
  ],
  extractionNotes: [
    'The prototype’s Usage section ("use something else when") carries a second row with no component name to target: "There is only one side to state — that belongs in the opening description instead." It doesn’t fit `UseInsteadSchema`, which requires a `target` entry id naming an alternative component — there isn’t one here, only structural advice about where content should live. That guidance is already captured verbatim in Content rule 5 ("Never a single card. If there is nothing to rule out, the usage rule belongs in prose in the opening description instead."), so only the Callout-naming row is represented as a `useInstead` item. Flagged for review.',
    "Relationship `kind` follows callout.ts's precedent: Callout is `often-confused-with` per its own Related-card text (\"The nearest neighbour by look, not by job\"); Cards is `composes-with` per its own Related-card text (\"The plain bordered box this pattern is built from\"), the same kind Cards' own entry (card.ts) already uses for Empty state.",
    "`propGuidance` (LDS-009) has no prototype counterpart — the prototype never documented a JS API. Its one note on `useWhenTitle` paraphrases this entry's own Content rule 1 rather than being extracted verbatim from anywhere; `useWhen` and `useInstead` are left unannotated since their extracted JSDoc descriptions (in packages/ui/src/usage-card/usage-card.tsx) already say what's needed.",
    "No variants or states exist for this entry — the shipped component has exactly one shape (a fixed pair), unlike every other ported component so far. Its own docs page therefore skips the Variants and States sections entirely, the same way any entry with empty arrays there does (docs/build-guide.md's generic component page template, apps/docs/app/components/[slug]/page.tsx).",
    "The bad example (bad-single.tsx) is built from raw elements rather than the real `UsageCard` component: `useWhen` and `useInstead` are both required props, so the shipped component has no way to render a single card, by design — the same treatment Cards' own bad-nestedcontrols.tsx gives a misuse its real component forbids.",
    "The shipped component renders the left title in --fg, not --accent, unlike this entry's own Tokens row (\"--accent / --mute: Title colour, left vs. right\", kept verbatim) and the prototype's own docs-page specimen: --accent on --accent-soft measures 4.06:1 in the light theme (axe, apps/docs/e2e/usage-card.spec.ts), short of AA's 4.5:1 for normal text. Border and fill alone carry the recommendation signal (this entry's own Accessibility note \"Colour never alone\", which only promises the border and fill together — not the title text), the same resolution callout.ts's own extractionNotes already documented for Callout's title. Flagged for review.",
  ],
});
