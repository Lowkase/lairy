import { FoundationEntrySchema } from "../../schema/foundation";

/**
 * Visualization, extracted from archive/v1/Workspace Shell.dc.html
 * (template 2449–2617, logic `vizDocs()` 14485) per docs/build-guide.md §3.
 * Prose is verbatim (ADR-0009); inline `<span>` colour styling in the
 * boundary sentence and the engine prose is dropped as markup, not content.
 * `vzRelated` is an inline const rather than a separate `vizRelated()`
 * method — reference/INDEX.md notes this as the one exception to the
 * foundations' usual two-method convention. See extractionNotes for every
 * place structured metadata was added or a value was restructured rather
 * than lifted directly.
 */
export const visualization = FoundationEntrySchema.parse({
  meta: {
    id: "visualization",
    name: "Visualization",
    section: "foundations",
    status: "stable",
    version: "1.0.0",
    updated: "2026-08-27",
  },
  description: {
    summary: "A chart in this system is a drawn object with a name, not a configuration of a charting library.",
    boundary:
      "Eight forms exist, each one answering a different question about shape of data, and asking for one by name is how a chart gets specified. This page owns what they share — the projection they are drawn on, the colour rule, how a reader is meant to decode them, and the accessibility floor they currently fall short of. What any single form encodes, and where it breaks, belongs to that form's own page. The boundary against Progress is worth stating once: a chart plots a set of values in a coordinate space, and Progress plots one fraction against a known total.",
  },
  scales: [
    {
      name: "--accent",
      tokens: ["accent"],
      description: "The single element the chart is about — peak, paused node, drained cell, focused ring.",
    },
    {
      name: "--fg",
      tokens: ["fg"],
      description:
        "Every other solid, at 0.07–0.22 fill against a 0.75–1.0 stroke. The fill ladder is what separates faces.",
    },
    {
      name: "--accent-2-line / --accent-2-soft",
      tokens: ["accent-2-line", "accent-2-soft"],
      description: "The reference series in Comparison bars, and nowhere else in a chart.",
    },
    {
      name: "--bg",
      tokens: ["bg"],
      description: "Painted behind each Ridge layer at 0.96 so a front curve occludes the one behind it.",
    },
    {
      name: "--dim / --faint",
      tokens: ["dim", "faint"],
      description: "The caption line and the axis-free label rail.",
    },
    {
      name: "--border",
      tokens: ["border"],
      description: "The hairline of the panel a chart sits in — charts have no border of their own.",
    },
  ],
  principles: [
    {
      text: "There is no WebGL and no 3D library. Every solid is plain SVG on a faked isometric projection, and one function maps (x, y, z) to the plane. A solid is three polygons — top, left and right face — at descending fill opacity, which is what reads as light without a light source. Lines draw themselves once through pathLength=1 and an animated stroke-dashoffset. The viewBox is computed from the projected bounds of the geometry, so an object always centres in its panel no matter how the data changes shape. Depth s and the projection origin are the only per-form parameters. A new isometric form is written against this function rather than beside it — a second projection would mean two visual languages sharing one page.",
    },
    {
      text: "Amber carries the value being judged and Ice carries whatever it is judged against — prior period, baseline, forecast. Two is the ceiling, and it is a ceiling rather than a default: the seven isometric forms are all single-series, and only Comparison bars spends the second colour. A third series is not a colour problem, it is a sign the chart has been asked more than one question. Series also separate by lightness and position, never by hue alone.",
    },
    {
      text: "Height is the quantity: one axis carries the value and the reader is told which. Depth is drawn to make the form legible as a solid — it is never a second measure, and no chart in this system encodes anything in the z axis.",
    },
    {
      text: "Amber marks one thing: the peak, the paused node, the drained cell, the thread in focus. Exactly one element per chart is amber; everything else is the foreground grey at a descending fill ladder. Two amber elements means the chart has not decided what it is about.",
    },
    {
      text: "Detail lives in the callout: the artwork carries a name and a number, and nothing more. Every other fact — the rate, the average, the state — appears on hover, so the still frame stays readable from across a room.",
    },
    {
      text: "Labels sit on a rail: names run along one edge in 12.5–14px mono, uppercase, and arrive after the geometry they belong to. A label never overlaps a solid and never leaders into one.",
    },
    {
      text: "No axis furniture: there are no gridlines behind the object, no tick marks and no y-axis. A single caption line beneath states what is being counted and over what window; the ground plane under a Node map or City grid is structural, not a scale.",
    },
    {
      text: "One chart per screen, in the primary panel, for a quantity worth contemplating — load, coverage, throughput, backlog. Where a number or a bar answers the question, the number wins, and a chart never appears as decoration on a form or a list.",
    },
  ],
  accessibilityNotes: [
    {
      title: "Detail is pointer-only",
      body: "Every callout in every form is bound to hover. There is no keyboard path to a data point and no focus order inside a chart, which is the system's largest open accessibility gap. Logged in the changelog; the fix is a tabular equivalent beside each chart.",
    },
    {
      title: "Nothing is named",
      body: "The SVG roots carry no title, desc or role, so a screen reader reaches a chart and finds nothing to announce. Until that lands, every chart must sit under a real panel heading and beside a metrics row that states the same numbers in text.",
    },
    {
      title: "Colour is never the only channel",
      body: "Amber marks the element the chart is about, but that element is also the tallest, the frontmost, or the one carrying a written state in its callout. Removing colour must never remove the finding.",
    },
    {
      title: "It draws once and stops",
      body: "No chart loops, so nothing in a chart competes with the two things that are allowed to — a live indicator and a waiting sweep. Under reduced-motion the draw-in should resolve to the finished frame rather than replay.",
    },
  ],
  relationships: [
    {
      target: "color",
      kind: "composes-with",
      text: "Owns what amber is allowed to mean. A chart borrows the accent for one element and may not invent a palette to tell series apart.",
    },
    {
      target: "motion",
      kind: "composes-with",
      text: "Owns the draw-in and the two-loop limit. The per-element delay steps a chart uses are specified there, not here.",
    },
    {
      target: "accessibility",
      kind: "composes-with",
      text: "Owns the floor this page currently fails. Read it before adding a ninth form.",
    },
  ],
  changelog: [
    {
      version: "OPEN",
      date: "2026-08-27",
      text: "Known gap — chart detail is pointer-only and no SVG root carries a title, desc or role, so all eight forms are unreadable to keyboard and screen-reader operators. Recorded against the Accessibility floor rather than quietly fixed; the remedy is a tabular equivalent per chart plus named roots, and it is scheduled ahead of any new form.",
    },
    {
      version: "1.0.0",
      date: "2026-08-27",
      text: "First specification. The seven isometric forms and the flat comparison chart were given published names, the projection engine was written down, and the two-series colour rule moved here out of the old Visualization section.",
    },
  ],
  extractionNotes: [
    "Section 06 \"Tokens\" (`vzTokens`, six rows) becomes `scales`, one row per entry: its `t` field (already a real token name, or a `/`-joined pair of them) becomes the scale's `name` and `tokens`, and its `u` field becomes the `description`, verbatim. Unlike Color's or Spacing's Roles tables, `vzTokens` doesn't give each row a semantic role name of its own, so the scale's `name` is the token name itself rather than an invented label (e.g. \"Chart accent\") — staying with what the source actually says (AGENTS.md rule 1: never invent).",
    "Section 01 \"The forms\" (`vzForms`, the eight named chart types — Block field, Column series, City grid, Plate stack, Ridge, Node map, Ring coverage, Comparison bars) is not stored in this entry. The page's own prose says why: \"What any single form encodes, and where it breaks, belongs to that form's own page\" — each form gets its own Component entry once ported, not a restatement here. This is a deliberate omission the source text itself instructs, not a gap.",
    "Section 02 \"The engine\" (the isometric projection formula and its prose) and Section 03 \"Series colour\" have no dedicated list const — they are hardcoded template prose (the engine's explanatory paragraph, and the series-colour table's closing note) — folded into `principles` as the first two entries, each combining the section's several paragraphs into one `Rule.text` (ADR-0009 permits restructuring prose into fields).",
    "Section 04 \"Reading rules\" (`vzReading`, 5 rows with `n`/`b` title+body shape) is folded into `principles` as \"{n}: {b}\" sentences, the same restructuring Typography's `typoScaleNotes` used (this ticket) — `principles` has no title field, so the title is prefixed into the sentence rather than dropped.",
    "`vzRelated` (an inline const inside `vizDocs()`, not a separate `vizRelated()` method — reference/INDEX.md flags this as the one exception to the foundations' usual two-method convention) has four cards: Color, Motion, Accessibility and Progress. Progress is a component with no entry yet and, per catalogue.ts's existing scope boundary (foundation `relationships` resolve only against the foundations catalogue, LDS-014), is dropped rather than left dangling; the other three are kept.",
    "`vzLog`'s first entry uses `OPEN` where every other foundation's changelog uses a semver string — carried over verbatim rather than inventing a version number for an unreleased, still-open fix, since ChangelogEntrySchema's `version` is a non-empty string rather than a strict semver pattern.",
    "This page has no Usage section (no \"reach for it when / use something else when\" cards exist in the template), unlike every other foundation extracted so far — `usage` is left at its schema default rather than fabricated.",
  ],
});
