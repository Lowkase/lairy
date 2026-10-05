import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/main-rail/examples";

/**
 * Navigation (Main), extracted from archive/v1/Workspace Shell.dc.html
 * (doc page 10209–10592; logic consts `navAnatomy` 15751, `navContent`
 * 15759, `navA11y` 15766, `navTokens` 15772, `navRelated` 15780, `navLog`
 * 15786, `mainNavRules` 16561, per reference/INDEX.md) per
 * docs/build-guide.md §3. Replaces the draft stub created only so
 * Scrollbar's (LDS-027) `contrasts-with` relationship had somewhere real to
 * point. Prose is verbatim (ADR-0009). See extractionNotes for every place
 * structured metadata was added, a literal needed a token decision, or
 * prose didn't have a clean schema home.
 */
export const mainRail = ComponentEntrySchema.parse({
  meta: {
    id: "main-rail",
    name: "Navigation (Main)",
    section: "components",
    status: "stable",
    version: "1.0.0",
    updated: "2026-10-05",
  },
  purpose:
    "The full-height column on the left that moves the operator between workspaces. The one navigation in the product that never changes.",
  description: {
    summary: "The main rail is the full-height column on the left that moves the operator between workspaces.",
    boundary:
      "It is the only navigation in the product that never changes: the same items, in the same order, on every screen. That fixity is the point — it is hit fifty times a day and must be answerable by muscle memory rather than by reading. The line against Navigation (Subnav) is scope: the rail chooses which workspace you are in, the subnav chooses where you are inside it. One level each, and neither borrows the other's job.",
  },
  anatomy: [
    {
      number: "1",
      name: "Rail",
      description:
        "A full-height column on --bg with a single hairline against the content. It scrolls only if the workspace list outgrows the viewport, and it never scrolls the launcher or System out of reach.",
    },
    {
      number: "2",
      name: "Active indicator",
      description:
        "A 2px amber rail pinned to the left edge of the current row, 16px tall. It is the one piece of the nav that says where you are, so nothing else in the rail is allowed to use it.",
    },
    {
      number: "3",
      name: "Row",
      description:
        "40px tall with 9px padding — comfortable enough to hit without looking. Hover fills with --panel-2 and takes no rail, which is what keeps hover and active distinguishable.",
    },
    {
      number: "4",
      name: "Icon",
      description:
        "A 22px glyph in a fixed 22px box, so icons stay in a straight column whether labels are shown or not. Collapsing the rail changes nothing about their position.",
    },
    {
      number: "5",
      name: "Collapse row",
      description:
        "Set apart by 14px at the foot of the rail, in --dim so it reads as chrome rather than a destination. It is the only row that does not navigate.",
    },
    {
      number: "6",
      name: "Brand lockup",
      description:
        "The mark and wordmark, pinned above the rows behind a hairline. It is the way back to the launcher and, since the header dropped it, the only place the wordmark appears at all.",
    },
  ],
  anatomyCaption:
    "Each part takes one edge of the frame, and every leader is a single straight line landing square on the target. Positions are measured from the artifact, so the diagram stays true at any size.",
  variants: [
    {
      name: "Expanded",
      tokens: ["accent", "fg", "panel-2"],
      description:
        "The default, and what a new operator sees. Labels are what make the rail learnable, so it starts open and stays open unless the operator chooses otherwise.",
    },
    {
      name: "Collapsed",
      tokens: ["accent", "fg", "panel-2"],
      description:
        "For operators who know the rail by shape and want the width back for their work. Every item stays present and in the same order — only the labels leave, into a native tooltip. The content shifts by exactly the difference over 260ms.",
    },
  ],
  variantsNote:
    "There is no flyout, no nested tree and no \"more\" overflow. A rail that hides items behind a second interaction is no longer answerable by memory, and a second level of nesting is what the subnav is for.",
  states: [
    { name: "Default", description: "--fg label, no fill." },
    { name: "Hover", description: "--panel-2 fill, no rail." },
    { name: "Active", description: "Amber rail and label." },
    { name: "Focus", description: "2px accent ring." },
  ],
  usage: {
    useWhen: [
      "A workspace the operator returns to on their own, not one they are sent to.",
      "A destination with its own subnav and its own sense of \"home\".",
      "Something that survives a redesign of the page it opens.",
      "The launcher, and the system — the two fixed ends of the list.",
    ],
    useInstead: [
      { target: "subnav", text: "A page inside a workspace — that is Navigation (Subnav)." },
      { target: "tabs", text: "A view of the same page — that is Navigation (Tabs)." },
      { target: "button", text: "Anything that performs an action — that is a Button." },
    ],
  },
  contentRules: [
    { text: 'One word per row wherever possible — "Fleet", "Research", "Console". Two only when one would be ambiguous.' },
    {
      text: "Labels are nouns, never verbs: the rail names places, and a verb in a place list reads as an action that will fire.",
    },
    {
      text: "Sentence case at 12px with .08em tracking. The rail is the one navigation that is not uppercased, so it stays quieter than the chrome around it.",
    },
    {
      text: "The label in the rail matches the page title it opens, word for word. A rename in one place is a rename in both.",
    },
    {
      text: "Collapsed rows keep their label in a Tooltip on hover — the text is never dropped, only moved.",
    },
  ],
  examples: [
    { id: "demo", kind: "demo", title: "Navigation (Main)", source: `${EXAMPLES_DIR}/demo.tsx` },
    {
      id: "good-hover-no-rail",
      kind: "good",
      title: "Hover fills, active takes the rail",
      caption: "Hover fills; only active takes the amber rail and label. The two never look alike.",
      source: `${EXAMPLES_DIR}/good-hover-no-rail.tsx`,
    },
    {
      id: "bad-hover-as-active",
      kind: "bad",
      title: "Hover given the active treatment",
      caption: "Never give hover the active treatment — the operator loses track of where they are.",
      source: `${EXAMPLES_DIR}/bad-hover-as-active.tsx`,
    },
    {
      id: "good-collapsed-keeps-items",
      kind: "good",
      title: "Collapsed keeps every item",
      caption: "Collapsed keeps every item, in the same order, at the same height.",
      source: `${EXAMPLES_DIR}/good-collapsed-keeps-items.tsx`,
    },
    {
      id: "bad-overflow-menu",
      kind: "bad",
      title: "Items folded into overflow",
      caption: "Never fold items into an overflow menu — a hidden rail cannot be learned.",
      source: `${EXAMPLES_DIR}/bad-overflow-menu.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Nav landmark",
      body: "The rail is the page's single nav landmark, holding one list of links. The header is the banner, so landmark navigation never presents the same destinations twice.",
    },
    {
      title: "Current page",
      body: 'The active row carries aria-current="page", which is what announces position. The amber rail is the visual echo of that attribute, never the only signal.',
    },
    {
      title: "Collapsed still labelled",
      body: "In the 56px rail each link keeps its accessible name; only the visible text is replaced by a Tooltip. Nothing becomes an unlabelled icon.",
    },
    {
      title: "Focus and hit size",
      body: "Rows are 40px tall with a visible focus ring drawn inside the rail, so keyboard focus is never clipped by the hairline edge.",
    },
  ],
  tokens: [
    { tokens: ["fg"], usage: "Resting labels and icons" },
    { tokens: ["panel-2"], usage: "Row hover fill" },
    { tokens: ["accent"], usage: "Active rail and label" },
    { tokens: ["dim"], usage: "Collapse row" },
  ],
  propGuidance: [
    {
      prop: "items",
      note: 'Order is fixed (Rules "Order is fixed") — launcher first, System last, workspaces between them in creation order. The rail never reorders itself by recency.',
    },
    {
      prop: "collapsed",
      note: 'Two widths only (Rules "Two widths") — expanded (216px, icon + label) and collapsed (56px, icon only). No third, intermediate width.',
    },
  ],
  relationships: [
    {
      target: "subnav",
      kind: "contrasts-with",
      text: "The subnav moves within a workspace and changes per route — the level of nesting this rail refuses to carry.",
    },
    {
      target: "header",
      kind: "composes-with",
      text: "The header starts where this rail ends. It used to share the brand lockup too; now the rail carries the mark alone and the header opens empty on the left.",
    },
    {
      target: "tabs",
      kind: "contrasts-with",
      text: "Tabs switch views of one page. If the destination has its own subnav, it was a rail item instead.",
    },
  ],
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-05",
      text: "Navigation (Main) ported: two-width rail (216px expanded, 56px collapsed), amber active indicator, collapsed-row tooltips, keyboard-complete collapse toggle.",
    },
    {
      version: "0.1.0",
      date: "2026-10-02",
      text: "Draft stub created so Scrollbar's own relationship had somewhere real to point.",
    },
  ],
  extractionNotes: [
    "Replaces the draft stub (version 0.1.0) created for Scrollbar's (LDS-027) own `contrasts-with` relationship. `purpose` is rewritten from the stub's own paraphrase to this entry's real, extracted prose; the stub's citation of Scrollbar's own Related-card sentence is superseded by this ticket's own direct extraction.",
    'Section 02 ("Widths and states", archive/v1 lines ~10281–10384) folds a Variants table and a States list into one page section; split here into this schema\'s separate `variants` (Expanded/Collapsed) and `states` (Default/Hover/Active/Focus, sourced from the Live demo\'s own hardcoded "STATES" markup rather than a dedicated `nav`-prefixed states const — the same States-from-the-live-demo precedent tabs.ts\'s own entry already set for its own four states). `VariantSchema.tokens` requires at least one colour token even though the two rows are a width choice, not a colour one — the same schema stretch-fit tabs.ts\'s own "Placements" variants already made; both rows share the identical token list for the same reason (there is only one colour treatment, two widths).',
    "Anatomy #2's 2px active-indicator width and 16px height, and anatomy #4's 22px icon box, all reuse existing tokens: 16px is an exact Spacing-ramp step (Space-16) and 22px is an exact match for `--icon-glyph-rail` (packages/tokens/tokens/icon.json, \"Glyph box in the dock rail\" — literally written for this exact use before this ticket existed). The 2px width is shipped as a `border-l-2` (Tailwind's border-width scale, not the Spacing ramp) rather than a literal width, the same mechanism tabs.ts's own 2px underline marker already uses (`border-b-2`).",
    "Anatomy #1's and mainNavRules' own 216px (expanded) and 56px (collapsed) rail widths have no Spacing-ramp match and are shipped from the new `--shell-rail-width`/`--shell-rail-width-collapsed` tokens added by this ticket (packages/tokens/tokens/shell.json) rather than an invented literal (AGENTS.md rule 1) — flagged there for the token decisions backlog. 56px is the same figure Scrollbar's own shipped entry already cites as fact (\"its own 56px collapsed rail\"), kept consistent rather than re-decided.",
    "Anatomy #3's and the Live demo's own 40px row height and 9px row padding have no clean Spacing-ramp match (9 snaps to 8 per docs/prd.md §8.3's own table) and are not shipped as a hardcoded height at all: the row is `flex items-center gap-12 py-8 px-8`, letting the 22px icon plus Space-8 padding determine height instead of a magic 40px figure — the same \"derive from padding rather than invent a height\" call textarea.ts's own extractionNotes already made for its own unsnapped 56px minimum height.",
    "Anatomy #5's \"Set apart by 14px\" margin is the same 14px-is-a-review-decision-not-a-snap literal docs/prd.md §8.3 and tabs.ts's own extractionNotes already flag; shipped at Space-12 (`mt-12`), the same decision tabs.ts's own anatomy #4 padding already made for the identical literal.",
    "Usage's \"Does not\" list (archive/v1 lines ~10391–10399) has four bullets; the first three carry the source markup's own inline-span reference to a named component (Navigation (Subnav), Navigation (Tabs), Button) and are modelled as `useInstead` rows. The fourth (\"Anything the operator visits once a quarter — that lives in System\") names no resolvable catalogue entry (\"System\" is a workspace in the live product, not a documented Lairy entry) and is not modelled as a row — the same unspannable-bullet precedent tabs.ts's own entry already set.",
    "Relationship `kind`: Subnav and Tabs are both `contrasts-with` — this entry's own boundary sentence and both Related-card lines draw a scope/nesting-level line against each, not a stylistic alternative or a confusion risk. Header is `composes-with` (shares the rail's own right edge, carries the mark the header gave up). Kept asymmetric with subnav.ts's and tabs.ts's own existing `often-confused-with` pairing between themselves (unaffected by this entry) since Navigation (Main) was never a party to that specific confusion.",
    "`propGuidance`'s two notes annotate `items` and `collapsed` by paraphrasing mainNavRules' own \"Order is fixed\" and \"Two widths\" — no prototype counterpart, the same kind of addition tabs.ts's own `propGuidance` already set precedent for.",
    "States \"Active\" (\"Amber rail and label\") is kept verbatim (ADR-0009), but the shipped component keeps the active row's own label on `text-fg`, not `text-accent` — bare --accent (#9a6208 in the light theme) on --bg measures 4.0–4.2:1 at Label size (12px), caught by this ticket's own axe run in the light theme, short of the 4.5:1 AA floor. The same call tabs.ts's own selected-tab label and this ticket's own subnav.ts active-page label already make: the active row still carries colour, just on the 2px rail (a non-text indicator, held to the lower 3:1 floor, which --accent on --bg clears), with activeness still signalled a second, non-colour way by `aria-current=\"page\"`. Flagged for the token decisions backlog alongside tabs.ts's own note.",
    "Do/don't pairs 1–3 (hover-vs-active, collapsed-keeps-items, overflow-menu) use real captions harvested from the page's own Do-and-don't section (archive/v1 lines ~10427–10500); the fourth pair shown there (order-is-fixed) duplicates mainNavRules' own \"Order is fixed\" rule already carried as `propGuidance` and Content, so only three pairs are shipped as examples rather than four, avoiding a redundant fourth good/bad specimen for a rule already demonstrated by example ordering alone.",
  ],
});
