import { FoundationEntrySchema } from "../../schema/foundation";

/**
 * Radius, extracted from archive/v1/Workspace Shell.dc.html (template
 * 1249–1496, logic `radiusDocs()` 15103, `radiusRelated()` 14904) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling in the boundary and Usage rows is dropped as markup, not
 * content. See extractionNotes for every place structured metadata was
 * added or a value was restructured rather than lifted directly.
 */
export const radius = FoundationEntrySchema.parse({
  meta: {
    id: "radius",
    name: "Radius",
    section: "foundations",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-25",
  },
  description: {
    summary: "Every surface in this system is 2px, and that is not a default — it is the lock.",
    boundary:
      "There is no radius scale, so a corner never carries meaning: two elements with different corners are different kinds of thing, not different levels of importance. That is why only two shapes are allowed off 2px, and both of them are read as objects rather than surfaces — the fully rounded Chip, and the circle used for dots and avatars.",
  },
  scales: [
    {
      name: "2px",
      tokens: ["radius"],
      description:
        "Cards, panels, buttons, inputs, menus, modals, badges, table cells, swatches — anything that behaves as a surface. Enough to take the raw edge off a hairline at 1× and invisible at a glance, which is the point: the corner should never be the thing you notice.",
    },
    {
      name: "20px",
      tokens: ["radius-chip"],
      description:
        "Chips, and nothing else. The full round is the tell that a thing can be picked up, toggled or thrown away — it is the one place where shape carries a behaviour, which is exactly why no other component may borrow it.",
    },
    {
      name: "50%",
      tokens: [],
      description:
        "Status dots, avatars and the numbered markers in a diagram. These are marks rather than containers — they hold no layout and take no padding, so a circle costs nothing and reads instantly at 8px.",
    },
  ],
  scalesNote:
    "There is no 4px, no 6px, and no large radius for large surfaces. A modal has the same corner as a badge because both are surfaces, and scaling the radius with the box is how a system ends up with eleven of them.",
  usage: {
    useWhen: [
      "It contains something — padding, rows, a layout of any kind.",
      "It has a border, a fill, or both.",
      "It sits flush against another surface and has to align with it.",
      "You are unsure. 2px is the answer to every corner question by default.",
    ],
    useInstead: [
      "It is a Chip — pickable, dismissible, or a filter. Then 20px.",
      "It is a status dot or an avatar. Then 50%, and it stays square in aspect.",
      "It is a diagram marker or a numbered legend bullet. Then 50%.",
      "Nothing else qualifies. A badge is not a chip, and it stays at 2px.",
    ],
  },
  principles: [
    {
      text: "The lock is enforced in code, not by convention: .ds sets border-radius 2px with !important, so a stray value in a component is overridden rather than merged.",
    },
    {
      text: "Radii do not nest. A panel is rounded; the rows, dividers and headers inside it are square and run edge to edge, which is what keeps a table looking like a table.",
    },
    {
      text: "Radius never scales with the box. A 900px modal and a 20px badge share the same 2px corner, because the corner describes what a thing is rather than how big it is.",
    },
    {
      text: "The 20px chip value is a shape, not a size — it stays 20px at every chip height so the ends always read as fully round rather than as a rectangle with generous corners.",
    },
    {
      text: "Circles are only for marks that hold no layout. The moment a round thing needs padding and content, it is a surface and it goes back to 2px.",
    },
  ],
  accessibilityNotes: [
    {
      title: "Shape is never alone",
      body: "The round chip and the square badge differ in behaviour, and that difference is also carried by a dismiss control, a role and an accessible name. Shape is a shortcut for people who can see it, never the only signal.",
    },
    {
      title: "Focus follows the corner",
      body: "The focus ring inherits the element's own radius, so a chip is ringed round and a button is ringed square. A ring that disagrees with its element reads as a rendering fault and hides where focus actually is.",
    },
    {
      title: "Edges and low vision",
      body: "A 2px corner keeps a straight, high-contrast edge along nearly the whole side of a box, which is easier to locate under magnification than a long curve that fades into the background.",
    },
    {
      title: "Nothing is clipped",
      body: "Because the radius is small and never nested, no label, focus ring or checkmark is ever cut off by an overflow-hidden corner — a common failure when a large radius meets a full-bleed row.",
    },
  ],
  relationships: [
    {
      target: "elevation",
      kind: "contrasts-with",
      text: "The other half of the flat look. Sharp corners and a hairline do together what a soft shadow does elsewhere, at a fraction of the visual cost.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-25",
      text: "Circle documented as a third allowed value rather than an unwritten exception, and tied to marks that hold no layout.",
    },
    {
      version: "1.0.1",
      date: "2026-08-05",
      text: "Lock moved into .ds with !important after two components drifted to 4px. Radius is now enforced rather than agreed.",
    },
    {
      version: "1.0.0",
      date: "2026-07-28",
      text: "Sharp locked at 2px system-wide, with chips as the single named exception. No radius scale was ever published.",
    },
  ],
  extractionNotes: [
    "Section 01 \"Values\" (the three-row 2px / 20px / 50% table) becomes `scales`. Each row's long `b` field becomes the scale's `description`, verbatim. 2px maps to the real `--radius` token and 20px to `--radius-chip` (packages/content/src/entries/tokens/radius.ts, LDS-013); 50% has no token of its own — it is a literal `border-radius: 50%` with no documented CSS custom property — so its `tokens` is empty rather than inventing one (AGENTS.md rule 1: \"if a needed value has no token, flag it — never invent one\"). Flagged for the token decisions backlog.",
    "The Values table's own closing note (\"There is no 4px, no 6px...\") becomes `scalesNote`, the same role the field played for Color, Typography and Spacing.",
    "`radiusRelated()`'s three cards target Chips, Badges (both components, no entry yet) and Elevation. Per catalogue.ts's existing scope boundary (foundation `relationships` resolve only against the foundations catalogue, LDS-014), Chips and Badges are dropped rather than left dangling; only Elevation is kept, leaving this entry with a single relationship.",
    "Section 04 \"Do and don't\" is not stored in this entry, the same as the other foundations extracted so far (docs/build-guide.md §4 step 6 — component examples, not Foundation content).",
    "Section 06 \"Tokens\" (`radiusTokens`, which also lists the literal `0` used by dividers inside a rounded container and the `50%` value already covered above) is not duplicated here: the docs page resolves each scale's `tokens` against the real token catalogue instead of this entry re-stating values that package already owns.",
  ],
});
