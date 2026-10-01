import { FoundationEntrySchema } from "../../schema/foundation";

/**
 * Spacing, extracted from archive/v1/Workspace Shell.dc.html (template
 * 986–1248, logic `spacingDocs()` 15135, `spacingRelated()` 15128) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling in the boundary sentence and in the Usage rows is dropped
 * as markup, not content. See extractionNotes for every place structured
 * metadata was added or a value was restructured rather than lifted
 * directly.
 */
export const spacing = FoundationEntrySchema.parse({
  meta: {
    id: "spacing",
    name: "Spacing",
    section: "foundations",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-25",
  },
  description: {
    summary: "Space is how this system groups things, and it does that job before any line is drawn.",
    boundary:
      "Nine steps, comfortable density, no toggle. Two elements belong together because the gap between them is smaller than the gap around them — a border is only ever the second explanation. That is the line against Elevation: if a group still needs a hairline after the spacing is right, the hairline is doing structural work it should not have to do.",
  },
  scales: [
    {
      name: "Inset",
      tokens: ["space-16", "space-18", "space-22"],
      description:
        "Padding between a container and its contents, always a pair from the ramp — vertical first, horizontal one step wider. Every edge of a container gets the same pair; a short bottom inset reads as a bug.",
    },
    {
      name: "Stack",
      tokens: ["space-4", "space-6", "space-12", "space-16"],
      description:
        "Vertical gap between rows in a column. Two adjacent gaps must differ by at least one step, or the grouping they are meant to describe disappears.",
    },
    {
      name: "Row",
      tokens: ["space-6", "space-8", "space-12"],
      description:
        "Horizontal gap between siblings in a line: buttons, chips, icon and label. Always a flex or grid gap, never a margin on one of the children.",
    },
    {
      name: "Section",
      tokens: ["space-32", "space-44"],
      description:
        "Between whole regions — the numbered sections of a documentation page, the bands of a workspace. Large enough that no border is needed to say a new subject has started.",
    },
  ],
  scalesNote:
    "There is no density setting. Comfortable is the only mode, decided once in code, because a system that ships two densities has to be designed twice and is usually only tested once.",
  usage: {
    useWhen: [
      "Two groups are being read as one because their gaps are equal.",
      "A control is close enough to another that a mis-click is plausible.",
      "A block of copy runs long and needs a resting point before the next one.",
      "A panel's contents touch its edge — inset is the first thing to fix.",
    ],
    useInstead: [
      "Two groups must be adjacent and still distinct — that is a line.",
      "The gap is only there to make something look important — that is Typography.",
      "Lines inside a paragraph feel tight — that is leading, not spacing.",
      "You have run out of room. Cutting an element beats shaving a step.",
    ],
  },
  principles: [
    {
      text: "Space is set with flex or grid gap, never with margins on children. A gap survives a reorder, a delete and a duplicate; a margin on the third item does not.",
    },
    {
      text: "Two gaps that sit next to each other differ by at least one step. 12 against 16 is a hesitation; 12 against 32 is a group.",
    },
    {
      text: "Insets are pairs, and the pair is identical on all four edges of the container. Trimming one edge to fit content is how a layout starts lying about its structure.",
    },
    {
      text: "No negative margins and no magic offsets. If something has to overlap, it is positioned deliberately and documented on the component that does it.",
    },
    {
      text: "Anything not on the ramp is a bug, including a value one pixel away from a step. The ramp is the only source, and it is short enough to hold in your head.",
    },
  ],
  accessibilityNotes: [
    {
      title: "Hit targets",
      body: "Nothing clickable is smaller than 32×32 in dense chrome or 44×44 in a primary flow. Where the visual mark is smaller — an 18px checkbox, a 6px dot — the padded row supplies the target, which is why insets are not optional.",
    },
    {
      title: "Space between targets",
      body: "Adjacent controls keep at least 8px between them so a tremor or a trackpad slip does not land on the neighbour. Destructive actions get a step more, or a divider.",
    },
    {
      title: "Grouping without vision",
      body: "Space that groups things visually is backed by real structure in the markup, so the same grouping survives for a screen reader, a magnifier at 400%, and anyone who never sees the gap at all.",
    },
    {
      title: "Reflow",
      body: "The ramp is absolute rather than proportional, so a layout narrowing to one column keeps the same rhythm instead of collapsing gaps toward zero as the viewport shrinks.",
    },
  ],
  relationships: [
    {
      target: "elevation",
      kind: "contrasts-with",
      text: "Picks up where space runs out. A hairline separates things that must stay adjacent; space separates everything else, and it goes first.",
    },
    {
      target: "radius",
      kind: "contrasts-with",
      text: "The other geometric lock. Sharp corners mean an inset is read as an exact distance from the edge rather than an approximate one.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-25",
      text: "Roles named — inset, stack, row, section — so a value is chosen by the job it does rather than by how it looked on the last screen.",
    },
    {
      version: "1.0.1",
      date: "2026-08-11",
      text: "Known drift recorded: a few surfaces still use 26 and 34 from before the ramp was fixed. They fold back to 22 and 32 as those components are revisited.",
    },
    {
      version: "1.0.0",
      date: "2026-07-28",
      text: "Nine-step ramp locked at comfortable density, with no runtime density toggle.",
    },
  ],
  extractionNotes: [
    "The Roles table (`spacingRoles`) becomes `scales`, not the raw nine-step Scale table (`spacingSteps`, section 01): Roles names a job (Inset, Stack, Row, Section) the way Color's own Roles table named Ground/Surface/Line/etc. (LDS-014), and its loosely-formatted `tok` field (e.g. \"16 · 18 · 22\") becomes a structured `tokens` array of the real token names from packages/content/src/entries/tokens/spacing.ts (LDS-013). Each role's `u` usage sentence becomes the scale's `description`, verbatim.",
    "The raw Scale table (section 01, `spacingSteps`) is not separately duplicated: every one of its nine steps is already covered by a Role's `tokens`, and each step's own per-step usage sentence is already carried verbatim into the real token entries' `useFor` (LDS-012/013). Its own closing note (\"The steps crowd together at the bottom...\") is likewise not carried over, since it explains the table's shape rather than stating a rule; flagged as a minor loss, consistent with Color's own choice not to duplicate its raw token table (LDS-014).",
    "The Roles table's own closing note (\"There is no density setting...\") becomes `scalesNote`, the same role the field played for Color.",
    "`spacingRelated()`'s three cards target Elevation, Radius and Cards. Cards is a component with no entry yet and, per catalogue.ts's existing scope boundary (foundation `relationships` resolve only against the foundations catalogue, LDS-014), is dropped rather than left dangling; Elevation and Radius are kept.",
    "Section 05 \"Do and don't\" is not stored in this entry, the same as Color's and Typography's (docs/build-guide.md §4 step 6 — component examples, not Foundation content).",
    "Section 07 \"Tokens\" (`spacingTokens`) is not duplicated here: the docs page resolves each scale's `tokens` against the real token catalogue instead of this entry re-stating values that package already owns.",
  ],
});
