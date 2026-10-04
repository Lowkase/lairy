import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/table/examples";

/**
 * Table, extracted from archive/v1/Workspace Shell.dc.html (template
 * 10960–11331; logic consts `tbAnatomy` 16157, `tbZones` 16164, `tbContent`
 * 16172, `tbA11y` 16179, `tbTokens` 16185, `tbRelatedGo` 16195, `tbLog`
 * 16201, plus demo data `tableData`/`tblIcon`/`tableVals` 14821–14887, per
 * reference/INDEX.md) per docs/build-guide.md §3. Prose is verbatim
 * (ADR-0009); the inline `<span>` colour styling on "Visualization" in the
 * opening boundary sentence is dropped as markup, not content, the same
 * call callout.ts's and tabs.ts's own entries already made for their own
 * opening sentences. This entry replaces the draft stub created only so
 * Cards' (LDS-022) `alternative` relationship had somewhere real to point
 * — `purpose` is now Table's own opening sentence rather than a paraphrase
 * from Cards' side. Creates a new Popover draft stub (popover.ts) so this
 * entry's own Related card and `composes-with` relationship have somewhere
 * real to point, the same precedent tabs.ts's own subnav.ts stub set. See
 * extractionNotes for every place structured metadata was added, a literal
 * needed a token decision, or the shipped component deliberately departs
 * from the prototype's own markup.
 */
export const table = ComponentEntrySchema.parse({
  meta: {
    id: "table",
    name: "Table",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-25",
  },
  purpose: "A list of records the operator works on, not a grid of numbers they read.",
  description: {
    summary: "A table is a list of records the operator works on, not a grid of numbers they read.",
    boundary:
      "Every decision here follows from that: rows are selectable, actions live on the row and in a toolbar that changes when a selection exists, and the columns are the few facts needed to decide which row to act on. It is the densest component in the system, so it is the one place where hover reveals rather than decorates. If the content is a matrix of measurements to be compared rather than records to be acted on, that is a Visualization problem, not this component.",
  },
  anatomy: [
    {
      number: "1",
      name: "Header row",
      description:
        "Column names in 10.5px --faint at .16em, sitting above a single hairline. They are labels rather than buttons: nothing in the header is amber, because the header describes the table and never acts on it.",
    },
    {
      number: "2",
      name: "Select column",
      description:
        "A fixed 26px column holding the 18px square box, header included. It is first because selection precedes every bulk action, and its width is reserved whether or not the table is selectable, so rows never shift when selection is turned on.",
    },
    {
      number: "3",
      name: "Cell",
      description:
        "One fact, one alignment rule: text left, numbers and times right, the record's name at 14px --fg and everything secondary at 12px --mute. Truncation with an ellipsis is allowed on the name only — every other column must fit.",
    },
    {
      number: "4",
      name: "Row",
      description:
        "The unit of work: a 54px-tall band — 11px of padding around a 32px action box, content-driven rather than fixed — that takes --panel-2 on hover and, when selected, an --accent-2 tint with a 2px ice rail down its left edge. The rail is what makes a selection legible while scrolling a long body.",
    },
    {
      number: "5",
      name: "Row actions",
      description:
        "A right-aligned cluster in a reserved column: the two or three frequent verbs as icons, then an overflow ⋯ for the rest. It fades in on hover and on keyboard focus, and the column is always there so the grid never reflows.",
    },
  ],
  anatomyCaption:
    "The body zone only. The toolbar above it is a zone of its own and is documented in 02 rather than crowded into this figure — a dense component gets one measured stage per region, never one figure with ten leaders.",
  states: [
    {
      name: "Toolbar — idle",
      description:
        "With nothing selected: the row count on the left in --faint, then EXPORT and the one amber CREATE on the right. It is the table's title bar, so it never scrolls away from the body it counts.",
    },
    {
      name: "Toolbar — selection",
      description:
        "The moment a row is checked, the same 56px band swaps to an ice count chip, the bulk verbs, and CLEAR. Swapping in place rather than stacking a second bar keeps the body from jumping under the operator's cursor.",
    },
    {
      name: "Row — default",
      description:
        "Resting. Only the hairline under the header separates rows; there are no zebra stripes, because 44px of height and one hover fill already do the work without adding a second rhythm.",
    },
    {
      name: "Row — hover",
      description:
        "The whole band fills and the action icons fade in. This is the one component where hover reveals rather than decorates, which is why every revealed action also has a keyboard path.",
    },
    {
      name: "Row — selected",
      description:
        "Ice tint plus the 2px rail, held whether or not the pointer is on the row. Selection outranks hover: a selected row under the cursor keeps the ice rather than the grey.",
    },
    {
      name: "Row — menu open",
      description:
        "The row raises above its siblings so the overflow panel is not clipped, and the ⋯ trigger stays filled for as long as the menu is up, so the operator can see which row they are aimed at.",
    },
  ],
  usage: {
    useWhen: [
      "Rows are records with a stable identity the operator acts on.",
      "The same action is often wanted on several rows at once.",
      "Four to seven facts per row decide what to do next.",
      "Scanning down one column is a real task — status, owner, last run.",
    ],
    useInstead: [
      {
        target: "card",
        text: "Each item needs an image, a summary, or free-form text — those are Cards.",
      },
      {
        target: "empty-state",
        text: "There are no rows yet — that is an Empty state, in place of the body.",
      },
    ],
  },
  contentRules: [
    {
      text: "Head columns with a noun in 10.5px caps — NAME, STATUS, OWNER — and never a sentence; the header is an index, not an explanation.",
    },
    {
      text: "Put the record's name in the second column and make it the widest: it is what the operator looks for before they read anything else.",
    },
    {
      text: 'Write times as relative until they stop being useful — "2m ago", "6d ago" — and right-align them so the column scans as one measurement.',
    },
    {
      text: "Show status as a word in colour rather than a badge on every row: a column of badges is louder than the data and the rows stop being scannable.",
    },
    {
      text: "Keep the bulk toolbar's verbs to the three that are actually used often, and name them in caps as verbs — RUN, DUPLICATE, DELETE.",
    },
  ],
  examples: [
    {
      id: "automations-demo",
      kind: "demo",
      title: "Automations",
      source: `${EXAMPLES_DIR}/automations-demo.tsx`,
    },
    {
      id: "good-few-columns",
      kind: "good",
      title: "Few columns, each one a fact",
      caption: "Few columns, each one a fact used to decide; times right-aligned and relative.",
      source: `${EXAMPLES_DIR}/good-few-columns.tsx`,
    },
    {
      id: "bad-overflowing-columns",
      kind: "bad",
      title: "A column the operator can't read",
      caption:
        "Never keep a column the operator cannot read — if everything truncates, the extra columns belong in the row's detail.",
      source: `${EXAMPLES_DIR}/bad-overflowing-columns.tsx`,
    },
    {
      id: "good-selection-swap",
      kind: "good",
      title: "Selection replaces the toolbar in place",
      caption:
        "A selection replaces the idle toolbar in place, counts what is selected, and keeps DELETE destructive.",
      source: `${EXAMPLES_DIR}/good-selection-swap.tsx`,
    },
    {
      id: "bad-stacked-toolbar",
      kind: "bad",
      title: "A second bar stacked for the selection",
      caption:
        "Never stack a second bar for the selection, and never let a destructive action pass as an ordinary one.",
      source: `${EXAMPLES_DIR}/bad-stacked-toolbar.tsx`,
    },
    {
      id: "good-reserved-actions-column",
      kind: "good",
      title: "Actions reveal in a reserved column",
      caption:
        "Row actions appear on hover and focus in a reserved column, so the width never shifts.",
      source: `${EXAMPLES_DIR}/good-reserved-actions-column.tsx`,
    },
    {
      id: "bad-every-action-spelled-out",
      kind: "bad",
      title: "Every action spelled out on every row",
      caption:
        "Never spell every action out on every row — the rare ones belong in the row's overflow menu.",
      source: `${EXAMPLES_DIR}/bad-every-action-spelled-out.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Real grid semantics",
      body: 'The body is a role="grid" with row and gridcell descendants and the header row marked columnheader, so a screen reader announces "row 4 of 214, Nightly ingest, Running" rather than reading a wall of unlabelled text.',
    },
    {
      title: "Nothing hover-only",
      body: "Every action revealed on hover is reachable by tabbing into the row, and the actions column keeps its space at all times. An action that only exists under a pointer does not exist for half the operators.",
    },
    {
      title: "Selection is announced",
      body: 'Each box carries aria-checked and the count chip is a live region, so checking rows speaks "3 selected". The header box is a tri-state: none, some, all — and "some" is announced as mixed rather than as checked.',
    },
    {
      title: "Colour is never alone",
      body: "Selection is the rail and the checked box as well as the ice tint, and status is a word rather than a colour. Ice on --panel measures 5.9:1; the tint alone is well under that and is never asked to carry meaning by itself.",
    },
  ],
  tokens: [
    { tokens: ["panel-2"], usage: "Toolbar band, row hover fill" },
    { tokens: ["accent-2"], usage: "Selection rail, checked box, count chip" },
    { tokens: ["accent-2-line"], usage: "Count chip border" },
    { tokens: ["accent"], usage: "CREATE, running status, row triggers" },
    { tokens: ["border"], usage: "Header hairline, card edge" },
    { tokens: ["border-2"], usage: "Unchecked box, toolbar button borders" },
    { tokens: ["mute"], usage: "Column names, row count" },
    {
      tokens: ["alarm-line", "alarm-soft"],
      usage: "Destructive verbs' border and hover fill in the toolbar and row menu",
    },
  ],
  propGuidance: [
    {
      prop: "rowActions",
      note: 'The two or three frequent verbs render inline as icons; the rest sit behind the row\'s own overflow menu, destructive ones under a "DESTRUCTIVE" divider (anatomy #5).',
    },
    {
      prop: "selectable",
      note: "Off drops the select column and the toolbar entirely — a table with nothing to bulk-act on is not forced to carry either (anatomy #2, Zones).",
    },
    {
      prop: "columns",
      note: "A column's own width is the consumer's content decision, not a design token (Content rule 1, 2) — the component only fixes the select and row-actions columns' own widths.",
    },
    {
      prop: "bulkActions",
      note: 'Rendered only once a row is checked, replacing the idle toolbar in place rather than stacking beside it (Zones "Toolbar — selection").',
    },
  ],
  relationships: [
    {
      target: "card",
      kind: "alternative",
      text: "Use instead when each record needs more than a line — a summary, an image, a chart. Cards trade the scannable column for room to breathe.",
    },
    {
      target: "empty-state",
      kind: "composes-with",
      text: "Replaces the body, never the toolbar, when there are no rows: the operator still needs CREATE and the column names to know what they are missing.",
    },
    {
      target: "popover",
      kind: "composes-with",
      text: "The row's ⋯ menu is a popover, and it follows that component's rules — including keeping destructive rows under their own labelled divider.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-25",
      text: "Selection standardised on ice with a 2px rail; zebra striping ruled out; actions column reserved so rows never reflow.",
    },
    {
      version: "1.0.1",
      date: "2026-08-21",
      text: "Bulk toolbar swaps in place instead of stacking a second bar; header box made tri-state.",
    },
    {
      version: "1.0.0",
      date: "2026-08-15",
      text: "Table introduced with row selection, bulk actions and per-row overflow menus.",
    },
  ],
  extractionNotes: [
    "Popover (\"popover\", packages/content/src/entries/components/popover.ts) is created as a new draft stub by this ticket, per docs/build-guide.md §3: this entry's own Related card and `composes-with` relationship are the first things in the catalogue that need to resolve to it. Unlike tabs.ts's own subnav.ts stub, its `purpose` paraphrases CONTEXT.md's own glossary line directly rather than this entry's side, since that line already exists.",
    'Section 02 ("Zones and row states", archive/v1 lines 11022–11044) is modelled as `states` even though two of its six rows (the idle/selection toolbar) describe a container\'s own content swap rather than a single interactive element\'s own state the way Checkbox\'s or Switch\'s `states` already do — `StateDocSchema` (name + description) is nonetheless the schema\'s closest fit for "a named condition and the prose describing it", the same stretch-fit tabs.ts\'s own entry already flagged for its "Placements" section landing in `variants`. Each row\'s own token column (`tk`, e.g. "--panel-2 · 56px") is not carried into a separate structured field — `StateDocSchema` has none — and is folded into this note rather than invented; the prose `description` fields above stay the verbatim `b` text alone (ADR-0009).',
    "Anatomy's and the Tokens row's \"--faint\" (header column names, idle toolbar's row count) ships as `text-mute`, not `text-faint`: the same measured gap text-input.ts's, empty-state.ts's and card.ts's own extractionNotes already document (--faint under AA's 4.5:1 floor at these sizes). The Tokens section's structured `tokens` field reflects what is actually shipped (`mute`), the same \"actual token names, not the prototype's own loose prose\" rule `VariantSchema`'s own doc comment already states for Variants; the anatomy and states prose above keep \"--faint\" verbatim (ADR-0009) since those are prose fields, not structured token data.",
    "The Tokens row's own literal `#ff8f6b` (\"Destructive verbs in toolbar and row menu\") does not ship as `text-alarm`: bare --alarm text fails AA by a wide margin on the light theme's --bg (documented at ~1.9–2.0:1 across text-input.ts's, button.ts's and tabs.ts's own entries for the same literal). The shipped toolbar's destructive bulk button and the row menu's destructive items instead reuse Button's own Danger treatment exactly — `border-alarm-line` + `text-fg` + `hover:bg-alarm-soft` (packages/ui/src/button/button.tsx) — so the destructive signal carries on the border and hover fill, with the verb itself in the ordinary --fg rank. The structured `tokens` row above lists `alarm-line`/`alarm-soft` rather than `alarm` for this reason.",
    'Selection\'s own ice treatment (--accent-2 rail, checked box, count chip) is not a deviation to flag — Zones\' own closing note (archive/v1 line 11042, kept verbatim in this entry\'s `states` "Row — selected"/"Toolbar — selection" prose) is explicit that selection is ice "because a selection refers to rows rather than acting on them," distinct from every other selection-like state in the system (Checkbox, Radio, Switch, Chip) which is amber because it commits a value. The shipped component\'s row and header checkboxes accordingly use `accent-2`/`accent-2-line`/`accent-2-soft` throughout rather than reusing Checkbox\'s own amber box.',
    "The row menu's own box-shadow (`0 22px 60px rgba(0,0,0,.45)`, archive/v1 line 11113) matches `--shadow-menu` exactly (packages/tokens/src/css/tokens.css: \"Menu. Select, popover, overflow\") — a clean token match, shipped as `shadow-menu`. Its own entrance animation (`panelIn .16s cubic-bezier(.4,0,.2,1) both`) is kept as the system's own `animate-panel-in` utility at its default 260ms rather than overriding to the prototype's literal 160ms: the Tailwind theme's own `--animate-panel-in` bundles duration, easing and fill into one utility with no override token for a 160ms variant (the theme's own comment names \"menu 160ms\" as a common override, not a supplied one), and no overlay component has shipped yet to set that precedent. Flagged for the token decisions backlog alongside radio.ts's, tabs.ts's and progress.ts's own un-snappable-duration notes.",
    'No shadcn/Radix scaffold, the same gap tabs.ts\'s own entry already flagged for the same acceptance-criterion wording ("shadcn counterpart: table"): the repo has no `components.json` and no Radix dependency anywhere, and shadcn\'s own Table primitive is unstyled markup with no selection, toolbar or menu behaviour of its own to begin from regardless. Built instead as a hand-rolled `role="grid"`/`"row"`/`"columnheader"`/`"gridcell"` widget, the row\'s own overflow menu a hand-rolled `role="menu"`/`"menuitem"` overlay with a real focus trap (Tab/Shift+Tab cycle the menu\'s own items, Escape closes and restores focus to its trigger — AGENTS.md rule 7) since no Popover component exists yet for it to compose with (the Related card above points at that future ticket instead). Flagged for Cory in case the ticket meant something else by naming `table`.',
    'This component does not implement the ARIA grid pattern\'s own roving-tabindex, arrow-key cell-to-cell navigation — only the reading structure (`grid`/`row`/`columnheader`/`gridcell`) that Accessibility "Real grid semantics" itself asks for. Interactive content (the select checkbox, each row action, the overflow trigger) is reached by ordinary Tab order between real focusable elements instead, which already satisfies Accessibility "Nothing hover-only" without the considerably larger scope of a full composite-widget keyboard protocol (AGENTS.md rule 9, stay in scope — this ticket\'s own acceptance criteria name Vitest/axe coverage, not the grid widget pattern specifically). Flagged for Cory as a deliberate scope cut, the same class of flag tabs.ts\'s own entry already raised for skipping the shadcn scaffold.',
    "A column's own width (`TableColumn.width`) is deliberately outside AGENTS.md rule 1's token governance: unlike every other shipped component, Table is generic over its caller's own row shape and column set, so the prototype's own specific 96px/120px/116px column widths (its own Automations demo's own choice of ID/Status/Owner/Last-run widths) are not baked into the component — they live only in this entry's own `automations-demo.tsx` example, passed as plain CSS grid track sizes. The component itself fixes only the two columns it owns outright: the 32px select column and the row-actions column (sized from `space[\"32\"]`/`space[\"4\"]` to fit its own icon buttons with no gap drift). The prototype's own literal 26px select-column width snaps to 32 rather than the arithmetically nearer 22 (docs/prd.md §8.3 permits choosing by context): 22px is too tight to centre an 18px checkbox with any breathing room, and 32 reuses the same module already governing the actions column's own icon buttons elsewhere in this same row, rather than inventing a third width for the same \"small fixed utility column\" problem. Flagged for the token decisions backlog.",
    'Usage\'s own "Use something else when" box (archive/v1 lines 11147–11154) has four bullets; only the first ("Cards") and the fourth ("Empty state") carry the source markup\'s own `<span style="color:var(--fg)">` around a named component, the same inline-Related-card-reference pattern docs/build-guide.md §3 means by "every ... row becomes a typed Relationship or useInstead item" — those two are modelled as `useInstead` rows. The second ("There is nothing to act on and nothing to compare — that is a list") names no Lairy component at all, and the third ("The point is the shape of the numbers — that is a Visualization") names a foundation-level category covering several distinct chart components (Chart (Block field), (Column series), (Ridge), …) with no single resolvable `EntryId` of its own. Neither is modelled as a row — `UseInsteadSchema.target` requires one real `EntryId` — and both are kept verbatim here rather than invented, since Usage\'s own schema has no "kept but unmodelled" slot beyond the four `useWhen` bullets already captured above, the same gap tabs.ts\'s own entry flagged for its own two unspanned bullets.',
    "Relationship `kind` is new structured metadata the prototype's own Related cards carry no tag for (the same note callout.ts's and tabs.ts's own entries already flag for their own relationships). Cards is `alternative`: its own card text opens with \"Use instead,\" the same explicit framing callout.ts's own Badge relationship already used for that kind. Empty state is `composes-with`: it replaces this component's own body region rather than standing in for the whole component, the same directional reading tabs.ts's own Card relationship already gives that kind. Popover is `composes-with` for the same reason: the row's own menu is built from Popover's own future rules, not a flat substitute for this component. Flagged for Cory alongside callout.ts's and tabs.ts's own relationship kinds.",
    "`propGuidance`'s four notes annotate `rowActions`, `selectable`, `columns` and `bulkActions` — the extracted API's own central, least self-explanatory props — by paraphrasing this entry's own anatomy #5, Zones and Content rules. No prototype counterpart, the same kind of addition callout.ts's and checkbox.ts's own `propGuidance` already set precedent for.",
    "Content rule 4's own \"status as a word in colour\" is kept verbatim (ADR-0009), but the demo example's own Running/Failed treatment does not ship as bare `text-accent`/`text-alarm`: this ticket's own `apps/docs/e2e/table.spec.ts` axe run measured bare --accent at this row's 12px Label size on the light theme's --panel at 4.42:1 — short of AA's 4.5:1 floor by a hair, the same class of gap tabs.ts's own selected-label note and button.ts's own Danger-label note already document for the same colour pairs at small sizes. Both statuses instead pair a small coloured dot (reusing the selection chip's own dot, not a second convention) with an ordinary --fg word — the colour signal survives, the text itself clears AA unconditionally. This is the example's own decision, not the component's: `Table` itself takes no `status` concept at all — a column's cell content is entirely the consumer's `render` function, so this fix lives in `automations-demo.tsx`, not `table.tsx`.",
  ],
});
