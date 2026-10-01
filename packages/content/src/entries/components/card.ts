import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/card/examples";

/**
 * Cards, extracted from archive/v1/Workspace Shell.dc.html (template
 * 3327–3593, logic constants `cardAnatomy` 15609 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on "Modal" and "Table" in the opening boundary sentence,
 * and on component names inside the Usage "use something else" rows, is
 * dropped as markup, not content. See extractionNotes for every place
 * structured metadata was added, a literal had no clean token, or the
 * shipped component deliberately departs from the prototype's own markup.
 */
export const card = ComponentEntrySchema.parse({
  meta: {
    id: "card",
    name: "Cards",
    section: "components",
    status: "stable",
    version: "1.2.0",
    updated: "2026-10-01",
  },
  purpose: "A bordered container that holds one whole object worth looking at on its own.",
  description: {
    summary: "A card is a bounded surface that holds one thing worth looking at on its own.",
    boundary:
      "It draws an edge around content so a page can be read as a set of objects rather than one column of text. A card stays flat in the page and stays put — the moment content needs to float over everything else it is a Modal, and when rows share the same fields and want comparing it is a Table. Only one kind of card is clickable, and that is the exception, not the default.",
  },
  anatomy: [
    {
      number: "1",
      name: "Container",
      description:
        "A 1px --border hairline on --panel, 2px radius, no shadow. Elevation belongs to overlays; a card sits flat in the page.",
    },
    {
      number: "2",
      name: "Header",
      description:
        "12px uppercase title at .16em on the left, optional --faint meta on the right, closed by a full-bleed hairline. Present or absent — never half-drawn.",
    },
    {
      number: "3",
      name: "Meta slot",
      description:
        "The right end of the header carries a count, unit or status. It is reference, never an action — actions go in the body or the page header.",
    },
    {
      number: "4",
      name: "Body",
      description:
        "18px padding, or 14–16px when the card is a dense list. Rows inside separate with hairlines rather than gaps.",
    },
  ],
  anatomyCaption:
    "Each part takes one edge of the frame, and every leader is a single straight line landing square on the target. Positions are measured from the artifact, so the diagram stays true at any size.",
  variants: [
    {
      name: "Plain",
      tokens: ["border", "panel"],
      description:
        "Prose, grouped controls, anything that needs a boundary but not a name. If you find yourself adding a title later, it wanted a header all along.",
    },
    {
      name: "With header",
      tokens: ["border", "panel"],
      description:
        "The default for content sections. The title names the contents so the card can be scanned in a column of siblings.",
    },
    {
      name: "HUD",
      tokens: ["border", "panel", "bracket"],
      description:
        "Instrumentation only — live readouts and telemetry. The brackets are a signal that the numbers are moving, so they lose their meaning on static content.",
    },
    {
      name: "Stat",
      tokens: ["fg"],
      description:
        "One number that answers one question. A label above, a value, and at most one unit of context beside it.",
    },
    {
      name: "Tile",
      tokens: ["panel-2", "border-2"],
      description:
        "The only clickable card. Border and fill lift on hover, the whole surface is the hit target, and it must lead somewhere — never open a menu.",
    },
  ],
  variantsNote:
    'There is no elevated card. Shadow is how the system says "this floats over the page", so spending it on a card that does not float leaves nothing to say it with later.',
  usage: {
    useWhen: [
      "The content is one whole object that makes sense read on its own.",
      "A page holds several such objects and the reader needs to tell where one ends.",
      "The grouping is stable — the same card appears in the same place tomorrow.",
      "It sits in the page flow, at the page's own scroll position.",
    ],
    useInstead: [
      {
        target: "modal",
        text: "It must float over the page and be dismissed — that is a Modal.",
      },
      {
        target: "table",
        text: "Every item shares the same fields and wants comparing — that is a Table.",
      },
      {
        target: "badge",
        text: "The box would hold a single label — that is a Badge or a heading.",
      },
      {
        target: "empty-state",
        text: "There is nothing to show yet — that is an Empty state, not a bordered void.",
      },
    ],
  },
  contentRules: [
    {
      text: 'Header titles are uppercase, 12px, .16em tracking, and name the contents rather than describing them: "Coverage", not "Here is your coverage".',
    },
    {
      text: "Two to four words in a title. If it needs a sentence, that sentence belongs in the body.",
    },
    {
      text: 'The meta slot holds a count or unit and nothing else — no verbs, no punctuation, no "click to expand".',
    },
    {
      text: "Body copy is 13.5px --dim in full sentences. A card is not a place for orphaned fragments.",
    },
    {
      text: "Cards in the same grid use the same kind and the same title grammar; a mixed grid reads as an accident.",
    },
  ],
  propGuidance: [
    {
      prop: "kind",
      note: 'Which of the five Kinds this card renders (Cards Kinds) — "plain" (default), "with-header", "hud", "stat" or "tile". Each kind takes its own shape of props (title/meta for with-header, label/value/unit for stat, onClick for tile), enforced at the type level so a stat card can\'t be built without its number.',
    },
    {
      prop: "title",
      note: 'The header title (With header kind only) — two to four words naming the contents, never describing them (Content rule 1). Rendered as a real heading in the reading order (Accessibility "Headings, not styling").',
    },
    {
      prop: "meta",
      note: "The header's right-end meta slot (With header kind only) — a count or unit, never an action (anatomy #3).",
    },
    {
      prop: "label",
      note: 'Stat kind only: the question the number answers, read before the value (Accessibility "Order matters").',
    },
    {
      prop: "value",
      note: "Stat kind only: the one number that answers `label` (Kinds \"Stat\").",
    },
    {
      prop: "unit",
      note: 'Stat kind only: at most one unit of context beside `value` — never a second number (Kinds "Stat").',
    },
    {
      prop: "onClick",
      note: 'Tile kind only: the one destination a tile leads to. Optional at the type level for the same reason Button\'s own `onClick` is (a real control works, if inertly, with none) — example components can\'t pass a function prop across the Server Component boundary at all, the same constraint Callout\'s own action examples already route around by omitting `onClick`. No `href` is offered — an anchor alone doesn\'t activate on Space (Accessibility "Tiles are one control: Enter and Space both activate it"), so the shipped tile is always a real `<button>` instead, the same "always a real control" precedent chip.tsx and button.tsx already set.',
    },
  ],
  examples: [
    {
      id: "with-header",
      kind: "demo",
      title: "With header",
      source: `${EXAMPLES_DIR}/with-header.tsx`,
    },
    {
      id: "plain",
      kind: "demo",
      title: "Plain",
      source: `${EXAMPLES_DIR}/plain.tsx`,
    },
    {
      id: "hud",
      kind: "demo",
      title: "HUD",
      source: `${EXAMPLES_DIR}/hud.tsx`,
    },
    {
      id: "stat",
      kind: "demo",
      title: "Stat",
      source: `${EXAMPLES_DIR}/stat.tsx`,
    },
    {
      id: "tile",
      kind: "demo",
      title: "Tile",
      source: `${EXAMPLES_DIR}/tile.tsx`,
    },
    {
      id: "good-consistentkind",
      kind: "good",
      title: "Consistent kind and title grammar",
      caption: "Siblings share a kind and a title grammar, so the column scans in one pass.",
      source: `${EXAMPLES_DIR}/good-consistentkind.tsx`,
    },
    {
      id: "bad-mixedkinds",
      kind: "bad",
      title: "Mixed kinds in one grid",
      caption: "Never mix kinds in one grid — HUD brackets on static content read as an accident.",
      source: `${EXAMPLES_DIR}/bad-mixedkinds.tsx`,
    },
    {
      id: "good-onequestion",
      kind: "good",
      title: "One question per stat",
      caption: "A stat card answers one question: label, value, one unit of context.",
      source: `${EXAMPLES_DIR}/good-onequestion.tsx`,
    },
    {
      id: "bad-crowded",
      kind: "bad",
      title: "A crowded stat card",
      caption: "Never crowd a stat card — four numbers means none of them is the answer.",
      source: `${EXAMPLES_DIR}/bad-crowded.tsx`,
    },
    {
      id: "good-onetarget",
      kind: "good",
      title: "One hit target, one destination",
      caption: "A tile is one hit target with one destination — the entire surface is clickable.",
      source: `${EXAMPLES_DIR}/good-onetarget.tsx`,
    },
    {
      id: "bad-nestedcontrols",
      kind: "bad",
      title: "Controls nested inside a tile",
      caption: "Never nest controls inside a tile — three tab stops in a clickable card fight each other.",
      source: `${EXAMPLES_DIR}/bad-nestedcontrols.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Headings, not styling",
      body: "A header title is a real heading element in the reading order, so a screen reader can jump between cards. Uppercase is a CSS transform — the accessible name stays sentence case.",
    },
    {
      title: "Tiles are one control",
      body: "A tile is a single focusable element with one accessible name, not a div wrapping three tab stops. Enter and Space both activate it, and the focus ring wraps the whole card.",
    },
    {
      title: "Boundaries survive",
      body: "The hairline holds 3:1 against --panel in both themes, so the card edge is still a visible boundary in high-contrast and greyscale.",
    },
    {
      title: "Order matters",
      body: 'Header precedes body in source, and a stat card announces its label before its number — "Open items, 32 of 33", never the number alone.',
    },
  ],
  tokens: [
    { tokens: ["border", "panel"], usage: "Container hairline and fill" },
    { tokens: ["border"], usage: "Header divider and internal row rules" },
    { tokens: ["bracket"], usage: "HUD corner marks" },
    { tokens: ["panel-2"], usage: "Tile hover fill" },
    { tokens: ["dim", "faint"], usage: "Body copy and meta labels" },
  ],
  relationships: [
    {
      target: "modal",
      kind: "contrasts-with",
      text: "A card that floats. The moment content needs a scrim and a dismiss, it stops being a card.",
    },
    {
      target: "table",
      kind: "alternative",
      text: "Use instead when rows share columns. Cards are for whole objects; tables are for comparing fields.",
    },
    {
      target: "empty-state",
      kind: "composes-with",
      text: "What a card body becomes when it has nothing to hold — never an empty bordered box.",
    },
  ],
  changelog: [
    {
      version: "1.2.0",
      date: "2026-08-19",
      text: "Tile hover unified on --panel-2; the whole surface is now one hit target.",
    },
    {
      version: "1.1.0",
      date: "2026-08-15",
      text: "Radius locked to 2px and card shadows removed — elevation reserved for overlays.",
    },
    {
      version: "1.0.0",
      date: "2026-08-11",
      text: "Initial release — five kinds, header optional.",
    },
  ],
  extractionNotes: [
    "This entry replaces the draft stub LDS-007's Callout ticket created only so Callout's own `composes-with` relationship had somewhere real to point (its own comment said as much). `purpose` is now Cards' own, not paraphrased from Callout's side.",
    'A new `table` draft stub (packages/content/src/entries/components/table.ts) is added, the same pattern chip.ts used for `select-multi` and badge.ts used for `progress`: Table has no ticket or CONTEXT.md glossary entry yet, so its stub `purpose` is paraphrased from this entry\'s own Related-card text about it, from Cards\' side rather than its own — flagged, pending Table\'s own ticket.',
    "Kinds `tokens` fold descriptive, non-token `tok` values from the prototype into the colour tokens the rendered card actually carries, the same way chip.ts folded Toggle's `tok: 'multi-select'`: \"With header\" reads `tok: '+ header hairline'` (archive/v1/Workspace Shell.dc.html:15617) — a description of the added slot, not a token — so `tokens` repeats Plain's own container pair (`border`/`panel`) since the header divider reuses `--border`, nothing new. \"Tile\" reads `tok: '+ tile-hit hover'` (line 15620) — likewise not a token — so `tokens` lists the hover treatment's real tokens instead, resolved from cardTokens' own \"Tile hover fill\" row (`--panel-2`, line 15639) plus `--border-2` for the lifted border per the Kinds row's own \"Border and fill lift on hover\" (the same decision cardLog's own 1.2.0 entry documents: \"Tile hover unified on --panel-2\"). \"Stat\" reads `tok: '--fg 28px numeral'` (line 15619); `tokens` keeps only `fg`, the one token named, rather than re-adding the base container pair every kind already shares — the same \"name only the differentiator\" precedent chip.ts's own Active variant set (`accent`/`accent-soft`, not Filter's base pair repeated).",
    "Anatomy #1's \"2px radius\" and #4's \"18px padding\" needed no snap: `radius-ds` and `space-18` are exact token matches (packages/tokens/tokens/radius.json, spacing.json). Anatomy #2's \"12px uppercase ... at .16em\" is an exact match to the Label type style (docs/prd.md §8.2: 12px, .16em tracking) — unlike chip.ts's own Label use, no tracking decoupling was needed here since the literal and the token agree exactly.",
    'Anatomy #4\'s "14–16px when the card is a dense list" is kept verbatim in prose (ADR-0009) but not modeled as a second Body padding in the shipped component: the Kinds section names exactly five kinds (Plain, With header, HUD, Stat, Tile) and none of them is a dense-list variant, so adding an undocumented `density` prop would invent API surface the entry itself doesn\'t name (AGENTS.md rule 9, "stay in scope"). The shipped CardBody always pads at Space-18, the anatomy text\'s own primary (non-conditional) figure; 16px of the quoted range exists on the ramp as Space-16 and 14px does not (docs/prd.md §8.3: "14px is a review decision, not a snap"). Flagged for the token decisions backlog alongside badge.ts\'s and chip.ts\'s own unsnapped literals.',
    'The HUD corner mark\'s own literal offsets differ between the Kinds table\'s large specimen ("top:7px;left:7px;width:13px;height:13px", archive/v1/Workspace Shell.dc.html:3344-ish inline style around line 3404) and the smaller Do/Don\'t specimen (top:5px/width:11px, line 3485) — two renderings of the same mark at different overall card sizes, not two documented sizes. The shipped component ships one size, taken from the Kinds table\'s own specimen (the kind\'s primary definition): 7px → Space-8 (docs/prd.md §8.3\'s own default snap "7 → 6 or 8"; 8 chosen to land on the same step the container\'s other offsets use) and 13px → Space-12 (§8.3\'s explicit "13 → 12"). Decision noted per §8.3\'s "choose by context and note the choice."',
    "The HUD corner marks are drawn as four absolutely positioned `<span>`s with two border sides each (packages/ui/src/card/card.tsx), reusing the prototype's own two-sides-per-corner technique (archive/v1/Workspace Shell.dc.html's `anatMarks`-adjacent HUD corner spans) rather than an SVG or a CSS mask — plain borders are enough to draw an L and nothing here needs antialiasing a border can't already give.",
    "Stat's label (\"11px .14em uppercase --mute\", archive/v1/Workspace Shell.dc.html's stat specimen inline style) sits exactly at Micro's size (11px) but keeps its own .14em tracking rather than Micro's own default .2em (docs/prd.md §8.2) — the same decoupling precedent chip.tsx already used for its own Label-sized, non-default-tracked text (that entry's own extractionNotes). Stat's unit (\"12px --mute\", no letter-spacing in the markup) sits exactly at Label's size (12px) but carries no tracking or uppercase transform at all, since it is plain prose (\"of 33\"), not a label — kept as `text-label` for the size match alone, flagged as a deliberate decoupling rather than a clean reuse.",
    "Stat's value (\"Space Grotesk, 600 weight, 28px\") is an exact match to the Metric type style, which docs/prd.md §8.2 already names for exactly this use (\"Numbers in stat cards\") — no snap or flag needed, unlike most of this entry's other literals.",
    'Accessibility "Tiles are one control" claims "Enter and Space both activate it" (archive/v1/Workspace Shell.dc.html:15631), kept verbatim per ADR-0009, but the prototype\'s own interactive-tile markup is a `<div class="ds tile-hit" onClick>` (template lines 3418, 3506) with no keyboard handling of its own — a div has no default Enter/Space activation at all. Per AGENTS.md rule 2 ("never copy markup") and the "always a real control" precedent chip.tsx and button.tsx already set, the shipped Tile is a real `<button type="button">`, which gives Enter and Space natively. No `href`/anchor option is offered for the same reason: a plain `<a>` only activates on Enter, not Space, so it can\'t satisfy this accessibility note either — flagged as a deliberate narrowing of the kind\'s own markup, not an extraction gap.',
    "Tile's hover (\"Border and fill lift on hover\") carries no `transition-colors`, the same reasoning chip.tsx's and button.tsx's own comments already document: `border-color`/`background-color` here are theme-swapped custom properties (--border-2, --panel-2), and animating them means a theme toggle passes through intermediate colours for the transition's duration, including combinations that could fail AA contrast. States snap instantly instead. Tile's hover also carries no shadow at all, unlike Button's own `hover:shadow-hover-lift` — this entry's own Kinds note (\"There is no elevated card... leaves nothing to say it with later\") rules it out specifically for Cards, a per-component decision rather than a system-wide one.",
    "The header's meta slot (packages/ui/src/card/card.tsx) renders in `--mute`, not the `--faint` cardTokens' own \"Body copy and meta labels\" row names: axe measures bare `--faint` text on `--panel` at 3.53:1 in the light theme (apps/docs/e2e/card.spec.ts), short of AA's 4.5:1 floor — the same gap Text's own extractionNotes already route its eyebrow/caption roles around. `--mute` clears 4.5:1 in both themes. Flagged for the token decisions backlog alongside Text's own instance of the same gap.",
    "Tile's `onClick` is optional, not required, even though a tile with none does nothing: the docs app's example components render inside a Server Component tree (apps/docs/app/components/[slug]/page.tsx, apps/docs/app/dev/card/page.tsx), and passing a function prop across that boundary throws at request time (\"Event handlers cannot be passed to Client Component props\") — caught running /dev/card locally. Button's own `onClick` is optional for the same reason, and Callout's own action examples never supply one either; Card's Tile examples (packages/ui/src/card/examples/tile.tsx, good-onetarget.tsx) follow the same precedent and omit it.",
    'The Usage "use something else when" rows all name a real or draft entry per docs/build-guide.md §3 — Modal, Badge and Empty state already exist (modal.ts, badge.ts, empty-state.ts) and Table is the new `table` stub this entry adds. Related (cardRelated) separately names Modal, Table and Empty state (not Badge) — kept as its own, narrower list per the prototype\'s own data, the same way chip.ts\'s Related list didn\'t repeat every useInstead target either.',
  ],
});
