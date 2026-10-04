import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/tabs/examples";

/**
 * Navigation (Tabs), extracted from archive/v1/Workspace Shell.dc.html
 * (template 7018–7352; logic consts `tabAnatomy` 15837, `tabRules` 15844,
 * `tabContent` 15850, `tabA11y` 15857, `tabTokens` 15863, `tabRelated`
 * 15871, `tabLog` 15876, per reference/INDEX.md) per docs/build-guide.md §3.
 * Prose is verbatim (ADR-0009); the inline `<span>` colour styling on
 * "Navigation (Subnav)" in the opening boundary sentence is dropped as
 * markup, not content, the same call callout.ts's own entry made for its
 * own opening sentence. This entry replaces the draft stub created only so
 * Buttons' (LDS-018) `often-confused-with` relationship had somewhere real
 * to point. See extractionNotes for every place structured metadata was
 * added, a literal needed a token decision, or prose didn't have a clean
 * schema home.
 */
export const tabs = ComponentEntrySchema.parse({
  meta: {
    id: "tabs",
    name: "Navigation (Tabs)",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-24",
  },
  purpose: "Switches between views of the page the operator is already on, with nothing else changing.",
  description: {
    summary: "Tabs switch between views of the page the operator is already on.",
    boundary:
      "Nothing about the page changes when a tab is clicked except which slice of it is showing: same route, same header, same object. That is the whole line against Navigation (Subnav) — a subnav row loads a different page, a tab re-dresses this one. The practical test is unsaved work: if moving between two views could lose it, they are tabs; if it could not, they were probably pages.",
  },
  anatomy: [
    {
      number: "1",
      name: "Tab row",
      description:
        "A single left-aligned row of labels with an 8px gap, sitting immediately above the content it governs. It never wraps, never scrolls and never centres — the first tab lines up with the page's left margin so the eye finds it without hunting.",
    },
    {
      number: "2",
      name: "Baseline",
      description:
        "A 1px --border rule running the full width beneath the row. It is what makes the tabs read as a set rather than three loose words, and it is the rail the selected marker sits on.",
    },
    {
      number: "3",
      name: "Selected marker",
      description:
        "A 2px --accent underline pulled 1px down so it covers the baseline exactly, paired with an --accent label. It moves over 160ms; nothing else in the row changes.",
    },
    {
      number: "4",
      name: "Tab label",
      description:
        "Label type at 12px and .14em uppercase, in --mute at rest and --fg on hover, with 9px by 14px of padding to give a comfortable hit area. Hover deliberately stops short of the underline so it can never be mistaken for selection.",
    },
    {
      number: "5",
      name: "Panel",
      description:
        "The view itself, on --panel-2 with the tab row's baseline as its top edge. It is the only thing that changes when a tab is clicked — the page header, title and actions above it hold still.",
    },
  ],
  anatomyCaption:
    "Each part takes one edge of the frame, and every leader is a single straight line landing square on the target. Positions are measured from the artifact, so the diagram stays true at any size.",
  variants: [
    {
      name: "Page tabs",
      tokens: ["accent", "mute", "fg", "border", "panel-2"],
      description:
        "The whole page has more than one shape — a fleet as a map or as a table. They sit directly under the page title, above everything else, because they govern all of it.",
    },
    {
      name: "Panel tabs",
      tokens: ["accent", "mute", "fg", "border", "panel-2"],
      description:
        "One region of a page has alternate readings — a run's logs or its diff. Scoped to the card's header rail so the operator can see the tabs and the card's own edge belong together.",
    },
  ],
  variantsNote:
    "There is one style and it is the underline. No pill tabs — a filled rounded tab is a Chip, and the system will not spend the same shape twice. No vertical tabs, no closable tabs, no second row.",
  states: [
    { name: "Default", description: "--mute, no underline." },
    { name: "Hover", description: "--fg, still no underline." },
    { name: "Selected", description: "--accent + 2px underline." },
    { name: "Focus", description: "3px accent-soft ring." },
  ],
  usage: {
    useWhen: [
      "Two to five readings of the same object, all equally valid.",
      "Views the operator switches between often and compares against each other.",
      "Content that shares the page's header, title and actions unchanged.",
      "A split that can be thrown away without breaking a link, since tabs are not routes.",
    ],
    useInstead: [
      {
        target: "subnav",
        text: "A different page — that is Navigation (Subnav).",
      },
      {
        target: "chip",
        text: "A subset of one list — those are Chips above the table.",
      },
    ],
  },
  contentRules: [
    { text: "Labels are Label case: one or two words, uppercase, .14em tracking — MAP, TABLE, LOGS, DIFF." },
    { text: 'Name the view, not the act: "MAP", never "VIEW MAP"; "DIFF", never "COMPARE VERSIONS".' },
    {
      text: "Keep every label in the row to a similar length; one long tab among three short ones makes the row look broken rather than emphasised.",
    },
    {
      text: "A count is allowed only when the number is the view's whole point — ALERTS 3 — set in --faint after the label, never as a coloured badge.",
    },
    {
      text: "Never put an action, a destination or Settings in a tab row. Everything in the row must be a way of looking at the same thing.",
    },
  ],
  examples: [
    {
      id: "page-tabs",
      kind: "demo",
      title: "Page tabs",
      source: `${EXAMPLES_DIR}/page-tabs.tsx`,
    },
    {
      id: "panel-tabs",
      kind: "demo",
      title: "Panel tabs",
      source: `${EXAMPLES_DIR}/panel-tabs.tsx`,
    },
    {
      id: "good-underline-only",
      kind: "good",
      title: "One row, underline only",
      caption: "One row, left aligned, underline on the selected tab and nothing else.",
      source: `${EXAMPLES_DIR}/good-underline-only.tsx`,
    },
    {
      id: "bad-pill-tabs",
      kind: "bad",
      title: "Pill tabs",
      caption: "Never draw tabs as pills — that shape is a filter chip, and the operator will try to combine them.",
      source: `${EXAMPLES_DIR}/bad-pill-tabs.tsx`,
    },
    {
      id: "good-title-stays-put",
      kind: "good",
      title: "Title stays put",
      caption: "The title stays put above the tabs, because the object is the same in every view.",
      source: `${EXAMPLES_DIR}/good-title-stays-put.tsx`,
    },
    {
      id: "bad-overflow-settings",
      kind: "bad",
      title: "Overflow row with a destination",
      caption: "Never overflow or scroll a tab row, and never smuggle a destination like Settings into it.",
      source: `${EXAMPLES_DIR}/bad-overflow-settings.tsx`,
    },
    {
      id: "good-count-in-faint",
      kind: "good",
      title: "Count in --faint",
      caption: "A count in --faint when the number is the view's whole point, sitting after the label.",
      source: `${EXAMPLES_DIR}/good-count-in-faint.tsx`,
    },
    {
      id: "bad-coloured-badge",
      kind: "bad",
      title: "Coloured badge in a tab",
      caption: "Never put a coloured badge in a tab — the underline is the only mark a tab row carries.",
      source: `${EXAMPLES_DIR}/bad-coloured-badge.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Tablist and panel",
      body: 'The row is role="tablist", each label a role="tab" with aria-selected, and the view a role="tabpanel" labelled by its tab. That pairing is what lets a screen-reader user know how many views exist before choosing one.',
    },
    {
      title: "Arrows move, Tab leaves",
      body: "Left and right arrows move between tabs and activate as they go; Home and End jump to the ends. One Tab press then lands in the panel, so reaching the content never means walking through every other tab.",
    },
    {
      title: "Colour is never alone",
      body: "Selection is the 2px underline as well as the --accent label. Amber on --panel measures 6.6:1 and --mute labels 4.9:1 at 12px, but the underline is what carries the state for anyone who cannot separate the hues.",
    },
    {
      title: "Panel keeps its place",
      body: "Switching a tab replaces the panel's content without moving focus or scrolling the page. The operator's position is preserved, and the change is announced by the panel's own heading rather than a live region.",
    },
  ],
  tokens: [
    { tokens: ["accent"], usage: "Selected label and 2px underline" },
    { tokens: ["mute", "fg"], usage: "Resting and hover labels" },
    { tokens: ["border"], usage: "Row baseline and panel edge" },
    { tokens: ["panel-2"], usage: "Panel surface" },
    { tokens: ["faint"], usage: "Optional count after a label" },
  ],
  propGuidance: [
    {
      prop: "tabs",
      note: "Order is meaning (Content rule, Rules 'Order is meaning') — the default view comes first and the order never changes with use.",
    },
    {
      prop: "value",
      note: "Switching a tab is not a route (Rules 'Not a route') — it never changes the page, its header or its URL beyond a query key.",
    },
  ],
  relationships: [
    {
      target: "subnav",
      kind: "often-confused-with",
      text: "The subnav loads pages; tabs re-dress one. If the switch deserves its own URL and header, it belongs over there.",
    },
    {
      target: "chip",
      kind: "alternative",
      text: "Chips filter the rows of one view and can combine. Tabs are exclusive and change the whole reading, which is why they never take the pill shape.",
    },
    {
      target: "card",
      kind: "composes-with",
      text: "Panel tabs live in a card's header rail, so the card's edge and the tab baseline have to agree about where the content starts.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-24",
      text: "Pill tabs, overflow rows and badge counts ruled out; hover fixed at --fg with no underline.",
    },
    {
      version: "1.0.1",
      date: "2026-08-17",
      text: "Marker pulled 1px down so it covers the baseline instead of sitting above it.",
    },
    {
      version: "1.0.0",
      date: "2026-08-09",
      text: "Underline tabs introduced at two placements with a 160ms marker transition.",
    },
  ],
  extractionNotes: [
    'Navigation (Subnav) ("subnav", packages/content/src/entries/components/subnav.ts) is created as a new draft stub by this ticket, per docs/build-guide.md §3: this entry\'s own `useInstead` row and Related card are the first things in the catalogue that need to resolve to it. Its `purpose` paraphrases this entry\'s own Related-card sentence about it, the same precedent main-rail.ts\'s and card.ts\'s own stubs already set.',
    'Anatomy #1\'s "8px gap" and Content rule 1\'s ".14em tracking" need no snap — both are exact ramp/tracking steps (docs/prd.md §8.3\'s ramp includes 8; §8.2\'s tracking set includes .14em, already shipped as `tracking-tight-14` in card.ts/loading.ts/progress.ts). Anatomy #4\'s "9px by 14px" padding is spacing, not type: 9 snaps directly to Space-8 per §8.3\'s own table ("9 → 8"), and 14 is explicitly "a review decision, not a snap" (§8.3) — shipped as Space-12 (`py-8 px-12`) rather than Space-16, matching the exact padding decision radio.tsx\'s own label row and chip.tsx\'s own pill already made for the same 9px/14px-shaped source literal, rather than inventing a third value for the same problem. Flagged for the token decisions backlog alongside radio.ts\'s and chip.ts\'s own unsnapped 14px padding literals.',
    "Anatomy #3's and the Tokens row's \"160ms\" marker transition matches none of the four named duration tokens (instant 140ms, control 180ms, panel 260ms, reveal 500ms, packages/tokens/src/css/tokens.css) — closest is --duration-instant at 140ms, but 160 isn't that value either. Shipped as the literal `duration-160` utility (Tailwind v4's bare-numeric support), the same call radio.ts's own dot-fade and progress.ts's own fill-transition extractionNotes already made for their own un-snappable 160ms/300ms literals. Also flagged for the token decisions backlog. The Tokens row's own sixth entry (\"Panel · 160ms\", \"Marker slide and colour change\") is not carried into this entry's structured `tokens` field for the same reason loading.ts's, progress.ts's and radio.ts's own motion rows already give: `TokenUsageSchema.tokens` is a `ColorTokenNameSchema` array, closed to colour tokens only. Referenced in prose instead (Anatomy #3, this note).",
    "That same Tokens row's \"Marker slide\" phrasing describes the live demo's own CSS behaviour loosely: the prototype's actual `.ds-tab` rule (`border-bottom:2px solid transparent; transition:all .16s`) is a per-tab border-colour transition, not a separately measured element translating across the row. Built fresh from that same behaviour (AGENTS.md rule 2 — never copy markup, read it for behaviour) as each tab's own `border-b-2` transitioning colour via `transition-colors duration-160`, with `-mb-px` pulling it down over the shared row baseline exactly as Anatomy #3's own \"pulled 1px down\" describes — not a second, separately positioned marker element.",
    'Anatomy #3\'s "paired with an --accent label", the Tokens row\'s "Selected label and 2px underline" and Accessibility\'s "Colour is never alone" ("Selection is the 2px underline as well as the --accent label") are kept verbatim (ADR-0009), but the shipped component keeps the selected label itself on `text-fg`, not `text-accent` — bare --accent (#9a6208 in the light theme) on --bg/--panel-2 measures 4.0–4.2:1 at Label size (12px), caught by this ticket\'s own `apps/docs/e2e/tabs.spec.ts` axe run in the light theme, short of the 4.5:1 AA floor AGENTS.md rule 7 requires. The same call button.ts\'s own Danger-label extractionNotes and callout.ts\'s own Title note already made for the same class of problem: the selected state still carries colour, just on the 2px underline (a non-text indicator, held to the lower 3:1 non-text-contrast floor, which --accent on --bg clears) rather than on body text, with selection still signalled a second, non-colour way by that underline\'s presence. Flagged for the token decisions backlog alongside the ring-width note below.',
    "States \"Focus\" (\"3px accent-soft ring\") is kept verbatim (ADR-0009) but the shipped component uses this system's universal 2px `ring-2` instead of a one-off 3px ring (Tailwind has no built-in 3px ring step, and every other shipped interactive component — Radio, Switch, Checkbox, Chip, Text input, Textarea — already standardises on `ring-2`/`ring-offset-2`). The same shipped-vs-prototype-prose gap callout.ts's own extractionNotes already flagged for its own Warning icon intensity. Flagged for Cory in case the ring-width step itself should be revisited system-wide.",
    'The four "Tab states" rows (Default/Hover/Selected/Focus) come from the Live demo\'s own hardcoded "TAB STATES" markup (archive/v1/Workspace Shell.dc.html, inside the pgTabs block, ~lines 104–112) rather than a dedicated `tab`-prefixed const the way `tabAnatomy`/`tabRules`/etc. are (reference/INDEX.md lists no such states const for this page) — the only states-shaped content the page has, modelled as `StateDocSchema` rows the same way button.ts\'s own `states` field already does for its own States table.',
    'Section 02 ("Placements", archive/v1 lines 52–87) is modelled as `variants` even though its two rows — Page tabs and Panel tabs — are not a tone/style choice the way every other shipped component\'s `variants` are (docs/prd.md §7.2: "variants/tones, each with token mapping"); the heading\'s own words are "TWO PLACEMENTS · ONE STYLE". `variants` is nonetheless the schema\'s only existing (name + token mapping + description) shape, and no dedicated "placements" field exists — the closest fit available without inventing new schema surface for one ticket (AGENTS.md rule 9, stay in scope). Both rows carry the identical `tokens` array for the same reason: there genuinely is only one look. Flagged for Cory as a stretch-fit, the same class of flag text-input.ts\'s own `statesNote` addition got for a different missing-schema-slot problem.',
    "Usage's \"Does not\" list (archive/v1 lines 141–149) has four bullets, but only the first two carry the source markup's own `<span style=\"color:var(--fg)\">` around a named component (\"Navigation (Subnav)\", \"Chips\") — the same inline-Related-card-reference pattern docs/build-guide.md §3 means by \"every ... row becomes a typed Relationship or useInstead item\". Those two are modelled as `useInstead` rows. The third (\"Steps in a sequence — a wizard is ordered; tabs are not\") names no Lairy component at all, and the fourth (\"Six or more views, or a set that grows at runtime — that wants a subnav or a select\") names two candidates with no single resolvable target and carries no span of its own either — `UseInsteadSchema.target` requires one real `EntryId`, so neither is modelled as a row; both are kept verbatim here rather than invented, the same call empty-state.ts's own extractionNotes already made for its own two unspanned \"use something else\" bullets.",
    'Relationship `kind` is new structured metadata the prototype\'s own Related cards carry no tag for (same note callout.ts\'s own entry already flags for its four relationships). Navigation (Subnav) is `often-confused-with`: this entry\'s own opening boundary sentence draws the exact same "is this the same page or a different one" line Callout draws against Toast, which that entry\'s own Related card also calls `often-confused-with`. Chips is `alternative`: tabRules\' own "a filled rounded tab is a Chip" names it as the shape that would otherwise be reached for, the same "flat alternative" framing Callout\'s own Badge relationship already used for that kind. Card is `composes-with`: Panel tabs live inside a card\'s header rail rather than replacing it, the same directional reading Callout\'s own Card relationship already gives that kind. Flagged for Cory alongside callout.ts\'s own four.',
    "No shadcn/Radix scaffold: unlike this ticket's own acceptance criteria wording (\"shadcn counterpart: tabs\"), the repo has no `components.json` and no Radix dependency anywhere (confirmed against every shipped component's own package.json) — shadcn's Tabs primitive wraps `@radix-ui/react-tabs`, and no prior component ticket has actually exercised the CLI (Checkbox's and Radio's own PRs already set this precedent for their own tickets). Built instead as a hand-rolled `role=\"tablist\"\"/\"tab\"/\"tabpanel\"` widget with roving `tabIndex` (0 on the selected tab, -1 on the rest — AGENTS.md rule 7, no positive tabindex) and arrow-key/Home/End handling per this entry's own Accessibility section — the one component so far with no native HTML host element to piggyback on the way Radio's real `<input type=\"radio\">` and Switch's real `<input type=\"checkbox\" role=\"switch\">` already do. Flagged for Cory in case the ticket meant something else by naming `tabs` as the shadcn counterpart.",
    "`propGuidance`'s two notes annotate `tabs` and `value` (the extracted API's two central props) by paraphrasing this entry's own Rules \"Order is meaning\" and \"Not a route\" — no prototype counterpart, the same kind of addition callout.ts's own `propGuidance` already set precedent for.",
  ],
});
