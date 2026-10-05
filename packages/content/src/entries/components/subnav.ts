import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/subnav/examples";

/**
 * Navigation (Subnav), extracted from archive/v1/Workspace Shell.dc.html
 * (doc page 10593–10959; logic consts `subnavAnatomy` 15793, `subnavRules`
 * 15800, `subnavContent` 15806, `subnavA11y` 15813, `subnavTokens` 15819,
 * `subnavRelated` 15827, `subnavLog` 15832, per reference/INDEX.md) per
 * docs/build-guide.md §3. Replaces the draft stub created only so Tabs'
 * (LDS-033) `often-confused-with` relationship had somewhere real to point.
 * Prose is verbatim (ADR-0009). See extractionNotes for every place
 * structured metadata was added, a literal needed a token decision, or
 * prose didn't have a clean schema home.
 */
export const subnav = ComponentEntrySchema.parse({
  meta: {
    id: "subnav",
    name: "Navigation (Subnav)",
    section: "components",
    status: "stable",
    version: "1.0.0",
    updated: "2026-10-05",
  },
  purpose:
    "The column of pages inside one workspace, docked to the right of the main rail. The one navigation that changes with the route.",
  description: {
    summary: "The subnav is the column of pages inside one workspace, docked to the right of the main rail.",
    boundary:
      "It is the only navigation in the product that changes with the route: a different workspace means a different list, and the list is the workspace's own table of contents. The line against Navigation (Tabs) is what happens when you click. A subnav row loads a different page, with its own URL and its own header; a tab swaps the view of the page you are already on. If leaving the row would lose unsaved work in the panel beside it, it was a tab.",
  },
  anatomy: [
    {
      number: "1",
      name: "Column",
      description:
        "A 214px column docked against the main rail and sticky to the top of the scroll container, so a long page never scrolls its own navigation away. It sits inside the content area because it belongs to the workspace, not to the app.",
    },
    {
      number: "2",
      name: "Section row",
      description:
        "A group of pages, set as a Label at 12px and .14em uppercase, and clickable in its own right — it opens the section landing page and expands its children. Only one section is open at a time.",
    },
    {
      number: "3",
      name: "Count",
      description:
        "The number of pages the section owns, right-aligned in --faint. It is present only where it is true and absent where a section has no children, which is what keeps it readable as information rather than decoration.",
    },
    {
      number: "4",
      name: "Child list",
      description:
        "The expanded pages, indented 12px behind a single --border hairline and set in sentence case at 12.5px. That hairline is the only nesting device in the component, and it is never drawn twice.",
    },
    {
      number: "5",
      name: "Active page",
      description:
        "The current route, marked with an --accent label on a --panel-2 fill while its parent section keeps the 2px amber rail at the column edge. Two amber marks, one statement: this section, that page.",
    },
  ],
  variants: [
    {
      name: "Section",
      tokens: ["fg", "panel-2"],
      description:
        "A group of pages that belong together, and itself a destination — clicking it opens the section's own landing page and expands its children. Only one section is ever expanded, so the column's height stays predictable as the operator moves.",
    },
    {
      name: "Page",
      tokens: ["accent", "panel-2"],
      description:
        "One route inside the section, indented behind a hairline. The case change from uppercase to sentence case is what tells the two levels apart — not the indent, which disappears the moment the label wraps.",
    },
  ],
  variantsNote:
    "There is no third level. A page that needs children of its own has outgrown the subnav: give it tabs inside its own header, or promote the section to a workspace on the main rail.",
  states: [
    { name: "Default", description: "--mute label, no fill." },
    { name: "Hover", description: "--panel-2 fill, --fg label." },
    { name: "Active", description: "Amber label, amber rail." },
    { name: "Focus", description: "2px accent ring." },
  ],
  usage: {
    useWhen: [
      "A page inside this workspace with its own route and its own page header.",
      "Something the operator will want to reach without going through another page first.",
      "A section that owns two or more pages — one child alone is just the section.",
      "A destination that stays put: the subnav is per workspace, not per record.",
    ],
    useInstead: [
      { target: "main-rail", text: "Another workspace — that is Navigation (Main)." },
      { target: "tabs", text: "A view of the page already open — that is Navigation (Tabs)." },
      { target: "chip", text: "A filter over a list — those are Chips above the table." },
      { target: "button", text: "Anything that performs work — that is a Button in the page header." },
    ],
  },
  contentRules: [
    {
      text: "Sections are one or two words, uppercase, plural where they name a set: OPERATIONS, RESEARCH, ARCHIVE — never a verb and never a sentence.",
    },
    {
      text: 'Pages are sentence case and name the thing, not the act: "Live vessels", "Crew roster" — not "View vessels" and not "Vessel management".',
    },
    {
      text: "Keep a page label under about 22 characters so it holds one line at 214px; if it cannot, the page is really two pages or the name is a description.",
    },
    {
      text: 'Never repeat the workspace in a row — inside Fleet the page is "Maintenance", not "Fleet maintenance". The header already said where you are.',
    },
    {
      text: 'Counts are plain integers. No "12 new", no plus signs, no dots: the subnav says how much exists, never how much has changed.',
    },
  ],
  examples: [
    { id: "demo", kind: "demo", title: "Navigation (Subnav)", source: `${EXAMPLES_DIR}/demo.tsx` },
    {
      id: "good-one-section-open",
      kind: "good",
      title: "One section open",
      caption: "Only one section is ever expanded, so the column's height stays predictable.",
      source: `${EXAMPLES_DIR}/good-one-section-open.tsx`,
    },
    {
      id: "bad-third-level",
      kind: "bad",
      title: "A third level of nesting",
      caption: "There is no third level. A page that needs children has outgrown the subnav.",
      source: `${EXAMPLES_DIR}/bad-third-level.tsx`,
    },
    {
      id: "good-case-signals-level",
      kind: "good",
      title: "Case signals the level",
      caption: "Uppercase sections, sentence-case pages — the case change tells the two levels apart.",
      source: `${EXAMPLES_DIR}/good-case-signals-level.tsx`,
    },
    {
      id: "bad-indent-only",
      kind: "bad",
      title: "Indent as the only signal",
      caption: "Never rely on indent alone — it disappears the moment a label wraps.",
      source: `${EXAMPLES_DIR}/bad-indent-only.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Nav landmark, per workspace",
      body: "The column is a nav landmark labelled with the workspace name, so a screen-reader user meeting two nav landmarks can tell the rail from the pages without exploring either.",
    },
    {
      title: "Current page, spoken",
      body: 'The active page carries aria-current="page" and the open section aria-expanded. The amber rail and the amber label are the visual half of the same statement, never the whole of it.',
    },
    {
      title: "Colour is never alone",
      body: "Active state is signalled three ways at once: the rail, the --accent label and aria-current. Amber against --panel-2 measures 6.4:1, but the marker is what carries it for anyone who cannot see the hue.",
    },
    {
      title: "Reading order matches sight",
      body: "Sections and their children follow the DOM in the order they are drawn, and the hidden stub keeps its button in place — collapsing the column changes its width, never its position in the tab order.",
    },
  ],
  tokens: [
    { tokens: ["panel-2"], usage: "Row hover and active fill" },
    { tokens: ["accent"], usage: "Active rail and active page label" },
    { tokens: ["mute"], usage: "Resting pages and section labels" },
    { tokens: ["border"], usage: "Child-list hairline and stub edge" },
    { tokens: ["faint"], usage: "Section counts" },
  ],
  propGuidance: [
    {
      prop: "groups",
      note: 'Two levels, one open (Rules "Two levels, one open") — sections and their pages, and nothing below that. Expanding a section collapses the previous one.',
    },
    {
      prop: "hidden",
      note: 'Sticky, never fixed (Rules "Sticky, never fixed") — the column sticks to the top of the content scroll and ends where the content ends; hiding it reclaims the width for the content, it never overlays it.',
    },
  ],
  relationships: [
    {
      target: "main-rail",
      kind: "contrasts-with",
      text: "The rail chooses the workspace this column belongs to. It never nests, which is exactly the job it hands over here.",
    },
    {
      target: "tabs",
      kind: "often-confused-with",
      text: "Tabs swap the view of one page without a route change. If clicking would keep you on the same page, it was never a subnav row.",
    },
    {
      target: "header",
      kind: "composes-with",
      text: "The page header names the row you just clicked. The subnav marks where you are; the header confirms it.",
    },
  ],
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-05",
      text: "Navigation (Subnav) ported: two-level sections/pages, one section open at a time, sticky 214px column with a hide/show stub.",
    },
    {
      version: "0.1.0",
      date: "2026-10-04",
      text: "Draft stub created so Tabs' own relationship had somewhere real to point.",
    },
  ],
  extractionNotes: [
    "Replaces the draft stub (version 0.1.0) created for Tabs' (LDS-033) own `often-confused-with` relationship. `purpose` is rewritten from the stub's own paraphrase to this entry's real, extracted prose; the stub's citation of Tabs' own Related-card sentence is superseded by this ticket's own direct extraction.",
    'Section 02 ("Levels and states", archive/v1 lines ~10650–10736) folds a Variants table (Section/Page) and a States list into one page section, the same shape Navigation (Main)\'s own "Widths and states" section takes — split the same way here into `variants` and `states` (the latter sourced from the Live demo\'s own hardcoded "ROW STATES" markup, not a dedicated `subnav`-prefixed states const).',
    "Anatomy #1's 214px column width has no Spacing-ramp match and is shipped from the new `--shell-subnav-width` token added by this ticket (packages/tokens/tokens/shell.json) rather than an invented literal (AGENTS.md rule 1) — flagged there for the token decisions backlog, alongside Navigation (Main)'s own two rail-width tokens.",
    "Anatomy #2's \"12px and .14em uppercase\" section label and anatomy #4's \"indented 12px\" both snap cleanly to Space-12 (exact ramp step) — no decision needed. Anatomy #4's \"12.5px\" page-row body size has no documented type style (styles land at 12/Label or 13/Small) and is shipped at Label (12px) rather than inventing a between-step size, the same \"documented foundations win\" call ADR-0005 and callout.ts's own `--text-callout-title` exception both already establish as the available escape hatch — flagged here instead of minting a new type-style token for a one-component difference of half a pixel.",
    "The child-list row gap in the live markup (archive/v1 line ~155, `gap:1px`) is below the Spacing ramp's floor (4) and is shipped at Space-4 (the nearest step, docs/prd.md §8.3's own default-snap table has no explicit 1→4 row but the ramp's own floor makes 4 the only available step) rather than a 1px literal — the same nearest-step-and-flag precedent radio.ts's own 40px-track-width extractionNote already sets.",
    "Usage's \"Does not\" list (archive/v1 lines ~10749–10755) has four bullets, all four carrying the source markup's own inline-span reference to a named component (Navigation (Main), Navigation (Tabs), Chips, Button) and all four modelled as `useInstead` rows — unlike Navigation (Main)'s own fourth bullet, every row here resolves to a real catalogue entry.",
    "Relationship `kind`: Tabs is `often-confused-with`, kept symmetric with tabs.ts's own existing `{target: \"subnav\", kind: \"often-confused-with\"}` row — both sides of the same confusion, tagged the same way. Main rail is `contrasts-with` (nesting-level boundary, the same kind main-rail.ts's own entry gives this relationship from its own side). Header is `composes-with` (the header confirms what the subnav just marked, not a boundary or an alternative).",
    "`propGuidance`'s two notes annotate `groups` and `hidden` by paraphrasing subnavRules' own \"Two levels, one open\" and \"Sticky, never fixed\" — no prototype counterpart, the same kind of addition tabs.ts's own `propGuidance` already set precedent for.",
    "Anatomy #5's \"marked with an --accent label on a --panel-2 fill\" is kept verbatim (ADR-0009), but the shipped component keeps the active page's own label on `text-fg`, not `text-accent` — bare --accent (#9a6208 in the light theme) on --panel-2 measures 3.96:1 at Small size (13px), caught by this ticket's own axe run in the light theme, short of the 4.5:1 AA floor. The same call tabs.ts's own extractionNotes already made for its own selected-tab label: the active page still carries colour, just on a 2px accent rail at the row's left edge (added here, mirroring the main rail's and the section row's own rail mark) — a non-text indicator held to the lower 3:1 floor, which --accent on --panel-2 clears — rather than on body text, with activeness still signalled a second, non-colour way by `aria-current=\"page\"`. Flagged for the token decisions backlog alongside tabs.ts's own note.",
    "Anatomy #2's own \"and clickable in its own right — it opens the section's own landing page\" is not shipped: the live product's sections are themselves destinations with their own landing page, but this ticket's own `SubnavGroup` has no `href` of its own, only `pages`, because the docs app's own three sections (Foundations, Components, Patterns) have no single landing page distinct from their first entry (docs/build-guide.md's own `/foundations/[id]`, `/components/[id]`, `/patterns/[id]` routes are all per-entry, never per-section). The shipped `Subnav`'s own section row is a pure disclosure toggle. Flagged for Cory in case a later ticket gives a section its own route and needs this reinstated.",
  ],
});
