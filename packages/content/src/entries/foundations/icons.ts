import { FoundationEntrySchema } from "../../schema/foundation";

/**
 * Icons, extracted from archive/v1/Workspace Shell.dc.html (template
 * 1497–1768, logic `icoDocs()` 15052, `icoRelated()` 15096) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling in the boundary and Usage rows, and the live glyph/icon
 * specimens rendered inline in the Families and Set tables, are dropped as
 * markup, not content. See extractionNotes for every place structured
 * metadata was added or a value was restructured rather than lifted
 * directly.
 */
export const icons = FoundationEntrySchema.parse({
  meta: {
    id: "icons",
    name: "Icons",
    section: "foundations",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-26",
  },
  description: {
    summary:
      "An icon here is a line drawing in a single colour, and it exists to make a destination findable at a glance — never to decorate a label that already reads.",
    boundary:
      "There are two families and they do not mix: the glyph, drawn on a 40 grid for navigation and section identity, and the inline icon, drawn on a 24 grid to sit beside a line of running text. Which one you want is a question of where the mark sits, not how large you want it — a glyph shrunk to 16px and an inline icon blown up to 22px are both wrong, because the stroke stops matching the type it stands next to.",
  },
  scales: [
    {
      name: "Glyph",
      tokens: ["icon-glyph-rail", "icon-glyph-tile", "icon-stroke-glyph"],
      description:
        "Navigation and identity: the dock rail at 22px, section tiles and empty states at 30–34px. A glyph stands for a place, so it is drawn to survive being the only thing in the row when the rail collapses. The 2.2 stroke is heavier than the inline family on purpose — at 22px in a column of its own it has no adjacent type to borrow weight from.",
    },
    {
      name: "Inline icon",
      tokens: ["icon-inline", "icon-stroke-inline"],
      description:
        "Anything that sits on a text baseline: menu rows, command palette results, a leading mark inside a Button. It is sized and weighted to match 14px body text, which is why it looks thin the moment you scale it up into rail territory.",
    },
  ],
  scalesNote:
    "There is no third family and no filled family. A solid shape in this system means a state — a status dot, the centre mark of a glyph — so an entirely filled icon would read as something switched on.",
  usage: {
    useWhen: [
      "The thing is a place you return to, and you will scan for it rather than read for it.",
      "The rail can collapse, so the mark has to carry the row on its own.",
      "A row of siblings needs to be told apart at speed — dock, palette, menu.",
      "The label is a verb you use constantly and the mark is already a convention.",
    ],
    useInstead: [
      "The item is a page name — Subnav is deliberately iconless.",
      "The action is destructive or irreversible. Then the word leads and the mark follows.",
      "The concept is abstract enough that two designers would draw it differently.",
      "You are filling space. An icon added for rhythm is noise with a stroke width.",
    ],
  },
  principles: [
    {
      text: "Both families are drawn on a square grid with a 5-unit margin: 30 of 40 for a glyph, 18 of 24 for an inline icon. The margin is what lets a glyph sit in a 22px box beside a 40px tile and still look the same size.",
    },
    {
      text: "Stroke is 2.2 on the 40 grid and 2 on the 24 grid, and it never goes below 1.6 at any render size. Caps and joins are round on every path, with no exceptions — a square cap reads as a different toolkit.",
    },
    {
      text: "Colour comes from currentColor and nothing else, so a mark inherits the row it lives in and changes with the theme for free. No gradients, no second pass at lower opacity.",
    },
    {
      text: "Fill is reserved for the centre mark — the small solid dot at the middle of rings, nodes and scan. It is the one place a glyph carries a filled shape, and it marks the focus of the drawing rather than a state.",
    },
    {
      text: "A glyph is drawn once at 40 and scaled; it is never redrawn for a smaller size. If a mark only works when redrawn, it is too detailed to be in the set.",
    },
  ],
  accessibilityNotes: [
    {
      title: "Never the only label",
      body: "Every icon in the product has a text label beside it or, when the rail is collapsed, a title and an accessible name that says the same words. The dock keeps its labels in the DOM at zero opacity rather than removing them, so the reading order never changes as the rail animates.",
    },
    {
      title: "Decorative marks are hidden",
      body: "A mark that repeats the adjacent label carries aria-hidden, because a screen reader announcing “graphic, wave, Signals” is worse than announcing “Signals”. If the icon is the only content, it takes the label instead of hiding.",
    },
    {
      title: "Size and target",
      body: "Icons are the smallest thing on screen, so the hit area is not: an icon-only control gets a 32px box at the dense floor even when the drawing is 14px. The mark may shrink; the target may not.",
    },
    {
      title: "Contrast of a line",
      body: "A 2px line is thinner than a letterform, so icons take --fg or --dim and never --faint. --mute is the floor for a resting mark, and anything meant to be read at a glance sits at --fg.",
    },
  ],
  relationships: [
    {
      target: "typography",
      kind: "composes-with",
      text: "Sets the weight an inline icon has to match. Icon size follows the type it stands beside, not the space available.",
    },
    {
      target: "color",
      kind: "composes-with",
      text: "Owns what currentColor resolves to. A mark has no palette of its own — it inherits the row, which is why amber means active here too.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-26",
      text: "Published the two families as a boundary rule, with the 5-unit margin, the 1.6 stroke floor and the centre-mark exception written down. Added the inline drain mark so destructive verbs stop borrowing a drawing from outside the set.",
    },
    {
      version: "1.0.1",
      date: "2026-08-19",
      text: "Retired the two-tone treatment on hex and nodes. Every mark now draws in a single currentColor pass.",
    },
    {
      version: "1.0.0",
      date: "2026-08-11",
      text: "Twelve glyphs on the 40 grid and four inline icons on the 24 grid, replacing the mixed set inherited from the prototype.",
    },
  ],
  extractionNotes: [
    "Section 01 \"Families\" (`icoFamilies`, two rows: Glyph and Inline icon) becomes `scales`. Each row's long `b` field becomes the scale's `description`, verbatim. Unlike Color, Typography, Spacing and Radius, neither row originally named a CSS custom property — the family table documents a grid, a stroke weight and a render-size range, none of which had a token (packages/content/src/entries/tokens/icon.ts's own comment: \"No Icons foundation size scale exists yet (LDS-017)\"). `tokens` was left empty for both rather than inventing one (AGENTS.md rule 1); LDS-017 (this ticket, porting the glyph and inline icon React components) adds `--icon-glyph-rail`, `--icon-glyph-tile` and `--icon-stroke-glyph` for Glyph, and `--icon-inline`/`--icon-stroke-inline` for Inline icon, taken directly from the values already stated in this scale's own `description` text rather than new design decisions.",
    "Section 02 \"The set\" (`icoGlyphSet`, 12 named glyphs; `icoInlineSet`, 5 named inline icons) is not stored in this entry: it is a literal icon inventory — which SVG exists under which name — belonging to the icon components themselves once they are ported (docs/build-guide.md §2's \"Icons are ported as SVG React components\"), not Foundation prose. The set's own closing note (\"Seventeen marks total...\") is likewise not carried over, since it explains the table rather than stating a rule.",
    "Section 07 \"Tokens\" (`icoTokens`) lists five colour tokens (--fg, --dim, --mute, --accent, currentColor) plus the same sizes and stroke widths the Families table states (now tokenised, see the first note above). The colour tokens are not duplicated as a `scales` entry: unlike Elevation's or Visualization's token tables (which name one role per row), `icoTokens` doesn't say which family each colour belongs to, so mapping it onto the two Families rows would be inventing a split the source doesn't state. Flagged rather than guessed.",
    "`icoRelated()`'s three cards target MainNav (a component, no entry yet), Typography and Color. Per catalogue.ts's existing scope boundary (foundation `relationships` resolve only against the foundations catalogue, LDS-014), MainNav is dropped rather than left dangling; Typography and Color are kept.",
    "Section 05 \"Do and don't\" is not stored in this entry, the same as the other foundations extracted so far (docs/build-guide.md §4 step 6 — component examples, not Foundation content).",
  ],
});
