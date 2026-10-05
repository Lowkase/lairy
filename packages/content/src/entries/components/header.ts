import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/header/examples";

/**
 * Header, extracted from archive/v1/Workspace Shell.dc.html (doc page
 * 9838–10208; logic consts `headerAnatomy` 16515, `headerContent` 16522,
 * `headerA11y` 16529, `headerTokens` 16535, `headerRelated` 16543,
 * `headerLog` 16548, `headerRules` 16555, per reference/INDEX.md) per
 * docs/build-guide.md §3. This entry is new — no draft stub existed before
 * this ticket (LDS-035, Desktop shell). Prose is verbatim (ADR-0009). See
 * extractionNotes for every place structured metadata was added, a literal
 * needed a token decision, or prose didn't have a clean schema home.
 */
export const header = ComponentEntrySchema.parse({
  meta: {
    id: "header",
    name: "Header",
    section: "components",
    status: "stable",
    version: "1.0.0",
    updated: "2026-10-05",
  },
  purpose:
    "Names the selected top-level module and carries ambient reference and the operator's own identity. Chrome, not content.",
  description: {
    summary:
      "The header is the 52px bar pinned to the top of every screen, naming the selected module and carrying ambient reference and the operator's own identity.",
    boundary:
      "It is chrome, not content: it says where you are in the product and who you are signed in as, and nothing about the page underneath. That is the line against the page header inside the content column — breadcrumb, title, status, actions all live there, because they change with the route. Anything that would need to change when the operator navigates does not belong in this bar.",
  },
  anatomy: [
    {
      number: "1",
      name: "Bar",
      description:
        "52px tall, pinned to the top, with a blurred 60% background so content stays visible passing under it. Its only hard edge is the 1px bottom hairline, and its left edge starts where the main nav ends.",
    },
    {
      number: "2",
      name: "Module title",
      description:
        "The selected top-level rail item, named at the left edge in --accent: its glyph, its name, and a SYS code. It moves with the rail, never with the route.",
    },
    {
      number: "3",
      name: "Ambient cluster",
      description:
        "Date in --dim, clock in --mute, split by a 1px 12px divider. Read-only by design — there is nothing here to click and nothing here to act on.",
    },
    {
      number: "4",
      name: "Identity square",
      description:
        "A 34px square opening the operator menu: appearance, preferences, sign out. Square rather than round, because a circular avatar would read as a chip.",
    },
    {
      number: "5",
      name: "Status dot",
      description:
        "An 8px amber dot ringed in --bg, pulsing on a 2.6s cycle. It is the single live element in the bar, which is exactly why it is legible — one moving thing in otherwise still chrome.",
    },
  ],
  anatomyCaption:
    "The bar is shallow, so the parts share the top and bottom edges rather than crowding the ends. Every leader is still a single straight line landing square on its target, measured from the artifact.",
  variants: [
    {
      name: "Module title",
      tokens: ["accent"],
      description:
        "The selected top-level rail item — its own glyph, name and a SYS code — anchoring the left edge that the brand lockup vacated. It only ever names the top level; it never follows the operator into a sub-page.",
    },
    {
      name: "Ambient",
      tokens: ["dim", "mute"],
      description:
        "Date then clock, split by a 1px 12px divider. Reference only — nothing in this zone is clickable, and nothing in it is ever amber, because a workspace where the wall clock competes with an alert is a workspace nobody reads.",
    },
    {
      name: "Identity",
      tokens: ["accent", "fg"],
      description:
        "A square opening the operator menu — appearance, preferences, sign out. The status dot is the single live element in the whole bar, which is what makes it readable at a glance.",
    },
  ],
  variantsNote:
    "There is no search field, no notification tray and no page action in this bar, and no compact variant of it. Global search belongs to the command palette on a keystroke; alerts belong to the surface that owns them; a page's primary action belongs beside that page's title. Nothing here changes with the route below it — not even the module title, which tracks the rail, not the page.",
  states: [
    { name: "Default", description: "Translucent bar, --dim date, --mute clock, --fg identity square." },
    { name: "Live", description: "The status dot pulses on a 2.6s cycle — the one moving element in the bar." },
    { name: "Menu open", description: "The identity square's operator menu is open, anchored below it." },
    { name: "Focus", description: "2px accent ring on the identity square." },
  ],
  usage: {
    useWhen: [
      "Ambient reference the operator glances at rather than acts on.",
      "Who is signed in, and the menu that changes that.",
      "State that is true on every screen, at every route, without exception.",
    ],
    useInstead: [
      { target: "main-rail", text: "Moving between workspaces — that is Navigation (Main)." },
      { target: "subnav", text: "Moving within one — that is Navigation (Subnav)." },
      { target: "toast", text: "Anything that has just happened — that is a Toast." },
    ],
  },
  contentRules: [
    {
      text: "The bar carries no brand mark — the lockup lives in the main rail now. Its left edge instead names the selected top-level module, so the header always says where the rail has you.",
    },
    {
      text: "The date reads WED 23 AUG 2026: uppercase, weekday first, no punctuation, so its width barely changes across the year.",
    },
    {
      text: "The clock is 24-hour with seconds. Seconds are what make it read as a live instrument rather than a decoration nobody trusts.",
    },
    {
      text: "No page title, breadcrumb or record name ever appears in the bar — if it changes with the route, it belongs to the page header below.",
    },
    {
      text: "The identity square carries no count, no initials and no label; the status dot is the only thing it is allowed to say.",
    },
  ],
  examples: [
    { id: "demo", kind: "demo", title: "Header", source: `${EXAMPLES_DIR}/demo.tsx` },
    {
      id: "good-chrome-only",
      kind: "good",
      title: "Chrome only",
      caption: "Three zones, one accent, and the bar reads in half a second.",
      source: `${EXAMPLES_DIR}/good-chrome-only.tsx`,
    },
    {
      id: "bad-fourth-zone",
      kind: "bad",
      title: "A fourth zone",
      caption: "Never grow a fourth zone — search, counts and page actions each have a home already.",
      source: `${EXAMPLES_DIR}/bad-fourth-zone.tsx`,
    },
    {
      id: "good-ambient-grey",
      kind: "good",
      title: "Ambient stays grey",
      caption: "Ambient stays grey: date in --dim, clock in --mute, divided by a hairline.",
      source: `${EXAMPLES_DIR}/good-ambient-grey.tsx`,
    },
    {
      id: "bad-accent-clock",
      kind: "bad",
      title: "Accent clock",
      caption: "Never let the clock take accent — amber in the chrome must mean something happened.",
      source: `${EXAMPLES_DIR}/bad-accent-clock.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Banner, not nav",
      body: "The bar is the page's banner landmark and contains no navigation list. The main rail is the nav landmark, so a screen-reader user jumping between landmarks does not meet the same links twice.",
    },
    {
      title: "Named identity control",
      body: 'The identity square is a button whose accessible name carries both the operator and the state — "Aria, active" — because the dot alone is invisible to anyone not looking at it.',
    },
    {
      title: "Quiet clock",
      body: "The ambient cluster is not a live region. A clock announcing itself every second would make the rest of the screen unusable, so it is read only when the operator moves to it.",
    },
    {
      title: "Measured contrast",
      body: "--fg wordmark clears 12:1 over the translucent bar, --dim date 7.1:1, --mute clock 4.8:1 at 12px. Contrast is measured against the darkest content that can scroll beneath, not against --bg.",
    },
  ],
  tokens: [
    { tokens: ["border-2"], usage: "Bottom hairline and identity square" },
    { tokens: ["accent"], usage: "Module title icon, label and code; operator status dot" },
    { tokens: ["dim"], usage: "Date, module code" },
    { tokens: ["mute"], usage: "Clock" },
  ],
  propGuidance: [
    {
      prop: "moduleLabel",
      note: "Never a sub-page (Content rule 1) — it tracks the selected top-level rail item, not the route.",
    },
    {
      prop: "onThemeChange",
      note: "The shell's theme toggle (docs app, LDS-035) lives in the identity square's operator menu, under Appearance — the same place the prototype's own menu puts it.",
    },
  ],
  relationships: [
    {
      target: "main-rail",
      kind: "composes-with",
      text: "The rail owns the product mark and moving between workspaces; the header names which top-level item is selected. They share one edge and never share a control.",
    },
    {
      target: "subnav",
      kind: "contrasts-with",
      text: "Subnav sits inside the content column and changes with the route — which is precisely what the header may never do.",
    },
    {
      target: "popover",
      kind: "composes-with",
      text: "The operator menu is a popover anchored to the identity square, so the bar itself never grows to hold it.",
    },
  ],
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-05",
      text: "Header ported: translucent 52px bar, module title, ambient cluster, identity square with an Appearance (theme) control in its operator menu.",
    },
  ],
  extractionNotes: [
    "No draft stub existed before this ticket (LDS-035) — this is header.ts's first entry, added to packages/content/src/catalogue.ts's components list directly.",
    'Section 02 ("Zones", archive/v1 lines ~9907–9962) is modelled as `variants` even though its three rows are not a tone/style choice — the same stretch-fit tabs.ts\'s own "Placements" section already made for the identical missing-schema-slot problem (docs/prd.md §7.2 variants being the schema\'s only (name + token mapping + description) shape). Each row\'s own token column ("--accent · rail glyph", "--dim / --mute", "34px · --accent dot") is paraphrased into the `tokens` array where it names a real colour token, and the bare pixel figure is dropped there since `VariantSchema.tokens` is colour-only.',
    "Anatomy #4's and the Live demo's own 34px identity-square figure, and the status dot's 8px figure, both reuse existing tokens rather than mint new ones: 34px is an exact match for `--icon-glyph-tile` (packages/tokens/tokens/icon.json, \"Glyph box for section tiles and empty states\") and 8px is an exact match for the Spacing ramp's own Space-8 step — the shipped Header component sizes the identity square and the status dot from those rather than a new literal. The bar's own 52px height has no such match (nearest ramp step 44, an 8px gap) and is shipped from the new `--shell-header-height` token added by this ticket (packages/tokens/tokens/shell.json) instead of an invented literal (AGENTS.md rule 1) — flagged there for the token decisions backlog.",
    "Content rule 2's \"WED 23 AUG 2026\" date format and the clock's 24-hour-with-seconds rule are both implemented with `Intl.DateTimeFormat`/`Date`, not hardcoded strings — the rule's own example date is illustrative, not the one the component renders.",
    "The operator menu (anatomy #4's identity square) has no Popover component to compose with yet (still a draft stub, packages/content/src/entries/components/popover.ts) — the same gap tabs.ts's own entry already found for Navigation (Subnav)'s tablist/tab primitives. Built as a small, self-contained overlay instead (focus trap, Escape closes, click-outside closes, focus restores to the identity square on close — AGENTS.md rule 7), the same \"build your own primitive, flag the gap\" call tabs.ts's own extractionNotes already made.",
    "The operator menu's real content in the prototype (\"appearance, preferences, sign out\", anatomy #4's own body text) is a real account menu; the docs app has no accounts, so this ticket's own shell usage (apps/docs/components/shell.tsx) passes only an Appearance control (Dark/Light) — satisfying this ticket's own \"a theme toggle in the shell\" acceptance criterion from the exact place the prototype's own spec already puts it, rather than adding a second, redundant toggle control elsewhere in the chrome. `menuItems` stays an open prop on the shipped `Header` component for a consumer that does have preferences/sign-out rows to add.",
    "Accessibility note \"Named identity control\"'s own example name (\"Aria, active\") describes a real product's operator; the shipped component's `identityLabel`/`identityStatus` props are generic (not hardcoded to \"Aria\") so a consuming app — including this ticket's own docs app shell, which has no signed-in operator — can supply its own accessible name rather than inheriting a placeholder identity.",
    "Do/don't pair 2's own caption (\"The bar starts where the nav ends, so the wordmark aligns to the content\" / \"Never span the bar over the nav\") describes the live shell's own layout contract (the header's left edge tracks the main rail's width) rather than a prop the standalone `Header` component itself exposes — modelled here as the `good-chrome-only`/`bad-fourth-zone` pair's captions instead, and the real layout contract is carried by apps/docs/components/shell.tsx's own composition (header `margin-left`/`left` tracking the rail's current width), not by Header in isolation.",
    "Relationship `kind` is new structured metadata the prototype's own Related cards carry no tag for (same note tabs.ts's and callout.ts's own entries already flag). Main rail is `composes-with` (shares one edge, never a control — the same directional \"lives beside, not instead of\" reading callout.ts's own Card relationship already gives that kind); Subnav is `contrasts-with` (the header's one fixed rule — never changes with the route — is defined entirely against what Subnav does do); Popover is `composes-with` (the operator menu anchors to the identity square without growing the bar).",
    "`propGuidance`'s two notes annotate `moduleLabel` and `onThemeChange` — no prototype counterpart, the same kind of addition tabs.ts's own `propGuidance` already set precedent for.",
    "Anatomy #2's \"named ... in --accent: its glyph, its name, and a SYS code\" and the Tokens row \"Module title icon, label and code\" are kept verbatim (ADR-0009), but the shipped component keeps the module title's own text label on `text-fg`, not `text-accent` — bare --accent (#9a6208 in the light theme) on the translucent bar measures below the 4.5:1 AA floor at Label size (12px), the same measurement tabs.ts's own selected-tab label, main-rail.ts's own active-row label and subnav.ts's own active-page label already flag for the identical token. Only the icon (non-text, held to the lower 3:1 floor) and the divider keep --accent; the SYS code was already shipped on --dim, not --accent, matching headerTokens' own separate \"--dim, Date, module code\" row. Flagged for the token decisions backlog alongside the other three.",
    "The Appearance control's selected button (apps/docs/components/shell.tsx's own theme toggle, this ticket's addition — no prototype counterpart) keeps its selected state on `text-fg` for the same AA reason, with the `border-accent-line` border carrying the colour signal instead (non-text, 3:1 floor).",
    'The `bad-accent-clock` example (examples/bad-accent-clock.tsx) deliberately renders the clock in `text-accent` — the one example in this entry that does not clear AA contrast by construction, because the mistake it illustrates (Content rule "Never let the clock take accent") is exactly that choice. Its own `good-ambient-grey` counterpart shows the compliant version. Not one of this ticket\'s own axe-gated routes (the shell and foundation pages, docs/build-guide.md\'s own acceptance criteria) — flagged here rather than silently fixed, since fixing it would stop it demonstrating the rule it exists to warn against.',
  ],
});
