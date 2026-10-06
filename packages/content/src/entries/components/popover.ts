import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/popover/examples";

/**
 * Popover, extracted from archive/v1/Workspace Shell.dc.html (template
 * 15906-16013, logic `popAnatomy`/`popRules`/`popContent`/`popA11y`/
 * `popTokens`/`popRelated`/`popLog` 15881-15920) per docs/build-guide.md
 * §3, completing the draft stub Table's (LDS-034) `composes-with`
 * relationship created so it had somewhere real to point. Prose is
 * verbatim (ADR-0009); inline `<span>` colour styling on "Modal" and
 * "Tooltip" in the opening boundary sentence, and on "Modal"/"Drawer"/
 * "Tooltip"/"Select" in the Usage "use something else when" card, is
 * dropped as markup, not content, the same call tooltip.ts's own entry
 * already made for the identical pattern. See extractionNotes for every
 * place structured metadata was added or a value was restructured rather
 * than lifted directly.
 */
export const popover = ComponentEntrySchema.parse({
  meta: {
    id: "popover",
    name: "Popover",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-24",
  },
  purpose: "A small anchored overlay holding a short action list or a few detail pairs.",
  description: {
    summary:
      "A popover is a small surface anchored to the control that opened it, holding actions or detail that would otherwise clutter the page.",
    boundary:
      "It is opened by a click, dismissed by looking away, and it never blocks the page behind it. That is the line against Modal: a modal is centred, scrimmed and must be answered before work continues, while a popover is peripheral and costs nothing to abandon. Against Tooltip the line is the click — anything that opens on hover is a tooltip and may contain nothing the operator has to reach.",
  },
  anatomy: [
    {
      number: "1",
      name: "Trigger",
      description:
        "The control that owns the popover, and the only thing that can open it. It stays visibly the source while the surface is up, and clicking it a second time closes what it opened.",
    },
    {
      number: "2",
      name: "Panel",
      description:
        "A 210px surface on --bg with a --border-2 hairline and a long soft shadow — one of the few places in the system allowed elevation, because it genuinely floats above the page. It rises 4px over 180ms and never covers its own trigger.",
    },
    {
      number: "3",
      name: "Row",
      description:
        "14px Body in --dim, filling to --panel-2 with an --fg label on hover, at 9px by 11px so the whole width is a target. Every row acts and every row closes the popover; nothing here just changes what the popover looks like.",
    },
    {
      number: "4",
      name: "Divider",
      description:
        "A single --border hairline with 5px of air either side, separating destructive rows from safe ones. It is the only structure a menu popover gets — no headings, no nested groups, no second divider.",
    },
    {
      number: "5",
      name: "Destructive row",
      description:
        "Delete and its relatives, in #ff8f6b, always last and always below the divider. Choosing one opens a confirming modal rather than acting immediately — a surface this easy to dismiss cannot be trusted with an irreversible click.",
    },
  ],
  anatomyCaption:
    "Each part takes one edge of the frame, and every leader is a single straight line landing square on the target. Positions are measured from the artifact, so the diagram stays true at any size.",
  variants: [
    {
      name: "Menu",
      tokens: ["dim", "fg", "panel-2", "border", "alarm-soft"],
      description:
        "Three to seven actions on one object, each row closing the popover as it fires. It is the overflow valve for a row or a card: the two actions worth showing stay as buttons, the rest come here.",
    },
    {
      name: "Detail",
      tokens: ["faint", "fg", "accent", "border-2"],
      description:
        "Facts about the anchor that are too long for a tooltip and too minor for a drawer — a run's timings, an operator's account. It may carry one link out, and no more.",
    },
  ],
  variantsNote:
    "A popover never scrolls, never nests a second popover and never holds a form with more than one field. Each of those is the same signal: the content has outgrown a peripheral surface and belongs in a Drawer.",
  states: [
    { name: "Default", description: "--dim, no fill." },
    { name: "Hover", description: "--panel-2, --fg label." },
    { name: "Focus", description: "3px accent-soft ring." },
    { name: "Destructive", description: "Below the divider." },
  ],
  statesNote:
    "The four row states shown against the live demo's own \"ROW STATES\" swatches (archive/v1 lines 15997-16002), not the structured `popRules`/`popA11y` lists — see extractionNotes for why they're modelled here rather than folded into Rules.",
  usage: {
    useWhen: [
      "A control owns three to seven actions that do not deserve permanent space.",
      "The operator needs a few facts about one thing without leaving the page.",
      "Abandoning the surface should cost nothing — no answer required, no state lost.",
      "The content is short enough to be read whole, with no scrolling.",
    ],
    useInstead: [
      {
        target: "modal",
        text: "The operator must decide before continuing — that is a Modal.",
      },
      {
        target: "drawer",
        text: "The content scrolls or is edited over time — that is a Drawer.",
      },
      {
        target: "tooltip",
        text: "It is one short line explaining a control — that is a Tooltip.",
      },
      {
        target: "select",
        text: "The rows set a single value on a field — that is Select.",
      },
    ],
  },
  contentRules: [
    {
      text: 'Rows are sentence-case verbs in Body 14px: "Rename", "Duplicate", "Archive", "Delete" — never uppercase Label, which is the tab and nav voice.',
    },
    {
      text: 'Name the object only when the row is ambiguous without it: "Delete run" inside a page about one run is noise; on a table row it is necessary.',
    },
    {
      text: "Keep every row to two words. A row that needs a clause is an action with consequences, and the consequence belongs in the modal that follows.",
    },
    {
      text: "Detail popovers use uppercase Label field names in --faint with values in --fg, at most six pairs, and no paragraph of prose.",
    },
    {
      text: "One way out, at most: a single amber link at the foot of a detail popover. Two links make it a page in the wrong place.",
    },
  ],
  examples: [
    {
      id: "demo",
      kind: "demo",
      title: "Demo",
      source: `${EXAMPLES_DIR}/demo.tsx`,
    },
    {
      id: "good-destructive-below-divider",
      kind: "good",
      title: "Destructive below the divider",
      caption: "Destructive actions sit last, below a divider, so they cannot be hit on the way past.",
      source: `${EXAMPLES_DIR}/good-destructive-below-divider.tsx`,
    },
    {
      id: "bad-destructive-first",
      kind: "bad",
      title: "Destructive first",
      caption:
        "Never put Delete first or mix it in with the safe rows — one slip and the object is gone.",
      source: `${EXAMPLES_DIR}/bad-destructive-first.tsx`,
    },
    {
      id: "good-anchored-menu",
      kind: "good",
      title: "Anchored to its trigger",
      caption: "Anchored to its trigger with a 9px offset and aligned to its near edge.",
      source: `${EXAMPLES_DIR}/good-anchored-menu.tsx`,
    },
    {
      id: "bad-scrolling-menu",
      kind: "bad",
      title: "A menu with a scrollbar",
      caption: "Never give a popover a scrollbar — if the list is that long, it was a drawer.",
      source: `${EXAMPLES_DIR}/bad-scrolling-menu.tsx`,
    },
    {
      id: "good-detail-one-link",
      kind: "good",
      title: "Facts and one way out",
      caption: "A detail popover holds facts and at most one way out, in amber.",
      source: `${EXAMPLES_DIR}/good-detail-one-link.tsx`,
    },
    {
      id: "bad-detail-form",
      kind: "bad",
      title: "A multi-field form",
      caption:
        "Never put a multi-field form in one — a surface you can lose by clicking away must not hold work.",
      source: `${EXAMPLES_DIR}/bad-detail-form.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Menu semantics",
      body: 'The trigger carries aria-haspopup and aria-expanded, and the panel is a role="menu" of role="menuitem" rows — so the number of actions is known before the operator starts walking them.',
    },
    {
      title: "Focus moves and returns",
      body: "Focus enters the first row on open and returns to the trigger on close, however the popover was dismissed. Focus is not trapped: it is a peripheral surface, and Tab leaving it simply closes it.",
    },
    {
      title: "Escape and outside click",
      body: "Escape closes it from anywhere, an outside click closes it without acting on what was clicked through, and the page keeps its scroll position. Nothing about dismissal needs to be learned.",
    },
    {
      title: "Destructive is spoken",
      body: "A destructive row names its object in the accessible name and points at the modal that follows, so a screen-reader user knows a confirm is coming rather than fearing the row itself.",
    },
  ],
  tokens: [
    { tokens: ["bg"], usage: "Panel surface." },
    { tokens: ["border-2"], usage: "Panel hairline." },
    { tokens: ["border"], usage: "Row divider." },
    { tokens: ["dim", "fg"], usage: "Rows at rest and on hover." },
    { tokens: ["panel-2"], usage: "Row hover fill." },
    { tokens: ["accent-soft"], usage: "Row focus ring." },
    { tokens: ["alarm-soft"], usage: "Destructive row highlight." },
    { tokens: ["faint", "accent"], usage: "Detail field labels and its one link out." },
  ],
  propGuidance: [],
  relationships: [
    {
      target: "modal",
      kind: "often-confused-with",
      text: "A modal must be answered and stops the page; a popover can be walked away from. A destructive row here always hands over to one.",
    },
    {
      target: "tooltip",
      kind: "often-confused-with",
      text: "Tooltips open on hover and hold one unreachable line. The moment the content contains something to click, it has to be a popover.",
    },
    {
      target: "select",
      kind: "contrasts-with",
      text: "Select uses the same floating surface to set one value on a field. Its rows change state rather than perform work, which is why it is a control and this is a menu.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-24",
      text: "Scrolling panels, nested popovers and multi-field forms ruled out; destructive rows fixed below the divider.",
    },
    {
      version: "1.0.1",
      date: "2026-08-16",
      text: "Offset standardised at 9px with edge-aware flipping on all four placements.",
    },
    {
      version: "1.0.0",
      date: "2026-08-08",
      text: "Popover introduced at 210px with menu and detail kinds and a 180ms rise.",
    },
  ],
  extractionNotes: [
    'This entry completes the draft stub table.ts\'s own LDS-034 ticket created ("popover", packages/content/src/entries/components/popover.ts) so its `composes-with` relationship had somewhere real to point — this ticket (LDS-039) is that future ticket. `purpose` is kept unchanged from the stub (CONTEXT.md\'s own glossary line) rather than reworded to the opening sentence\'s own phrasing, the same "no paraphrase needed" call the stub\'s own comment already made.',
    "Drawer (\"drawer\", packages/content/src/entries/components/drawer.ts) is created as a new draft stub by this ticket, per docs/build-guide.md §3: the Kinds section's own closing note and a `useInstead` row both need to resolve to it, and no Drawer ticket has landed yet. Its `purpose` paraphrases CONTEXT.md's own glossary line directly, the same \"already exists\" case popover.ts's own stub was in.",
    'Section 02 ("Kinds", `popRules`\' own closing line, archive/v1 line 15976) is modelled as `variants` rather than `states`: Menu and Detail are "a designed alternative form of a component, chosen by the author" (CONTEXT.md\'s own Variant definition) — a author-selected Popover shape, not a runtime condition it passes through the way tooltip.ts\'s own "Placement and timing" rows (behavioural rules, correctly `states`) are. This is the opposite stretch-fit call from tooltip.ts\'s own "Two kinds" note for the identical schema gap, because Popover\'s own two kinds genuinely differ in author intent and token usage, where Tooltip\'s own "kinds" were really placement/timing rules with no author-chosen form.',
    "Each variant's own `tokens` array is this entry's own choice of representative tokens for that kind's own visual treatment (Menu: row rest/hover/divider/destructive; Detail: label/value/link/hairline) — the prototype's own Kinds table carries no token column at all, only the structured `popTokens` list below (which doesn't distinguish by kind). `VariantSchema`'s own doc comment (\"the actual token names ... replaces the prototype's own loose prose\") is the schema's own precedent for this kind of addition, the same one table.ts's own Tokens-section note already cites for the same schema field.",
    "The four \"ROW STATES\" swatches (archive/v1 lines 15997-16002: Default, Hover, Focus, Destructive) are a separate hardcoded block inside the Kinds section's own live demo, not one of the `popXxx` logic arrays (`popAnatomy`/`popRules`/`popContent`/`popA11y`/`popTokens`/`popRelated`/`popLog`) — the same \"ad hoc, not array-driven\" shape tabs.ts's own Placements swatches and table.ts's own Zones swatches already extracted into `states`. Modelled as `states` here for the same reason: a named row condition with the terse token-ish caption text as its own `description`, verbatim after the em dash (ADR-0009 — restructuring the \"Default — --dim, no fill\" shape into name+description is not a rewrite).",
    "The Focus row state's own \"3px accent-soft ring\" (archive/v1 line 15999) is not implemented as a literal `:focus-visible` ring the way Checkbox's or Switch's own trigger rings are: Radix's `DropdownMenuPrimitive.Item` manages keyboard navigation with its own roving `data-highlighted` attribute rather than native focus, and the shipped `PopoverMenuItem` reuses the same `panel-2`/`fg` highlight treatment as pointer hover for `data-highlighted` rather than a second, visually distinct ring — a highlighted row and a hovered row are the same affordance in this implementation. The `accent-soft` token is kept in the structured Tokens list below as a flag that the prototype's own demo drew a third, ring-based treatment this component doesn't reproduce; flagged for Cory.",
    'The Tokens section\'s own sixth row ("panelIn · 180ms", not a colour token) is dropped from the structured `tokens` field, the same gap tooltip.ts\'s own entry already flagged for `--shadow-bubble`/`duration-160` (`TokenUsageSchema.tokens` is `ColorTokenNameSchema[]` only). The shipped panel instead uses the system\'s own `animate-panel-in` utility at its default 260ms cubic-bezier rather than overriding to the prototype\'s own literal 180ms "ease" — table.ts\'s own entry already made this exact call for the identical `panelIn`-but-different-duration gap (its own row menu, 160ms), for the same reason: the Tailwind theme\'s own `--animate-panel-in` bundles duration, easing and fill into one utility with no supplied override for a 180ms variant, and this is only the second overlay component to ship. Also: the shared `panelIn` keyframe itself translates 12px (packages/tokens/src/css/tailwind-theme.css), not the anatomy prose\'s own "rises 4px" (archive/v1 popAnatomy #2) — a prototype-internal inconsistency kept verbatim in the prose per ADR-0009, not corrected. Both flagged for the token decisions backlog.',
    "The Panel's own 210px width (anatomy #2) has no Spacing-ramp match (ramp: 4, 6, 8, 12, 16, 18, 22, 32, 44) — added as a new `--popover-panel-width` token (packages/tokens/tokens/popover.json) rather than an inline literal, the same component-specific-exception category `--shell-rail-width`/`--shell-subnav-width` already established for main-rail.ts's and subnav.ts's own non-ramp dimensions (LDS-035). Applied via `style={{ width: popover.panelWidth }}` on both `PopoverContent` and `PopoverMenuContent`, the same inline-style pattern main-rail.tsx's own `shell.railWidth` usage already set precedent for (Tailwind width utilities can't reach an unramped literal without an arbitrary-value class, which AGENTS.md rule 1 and the repo's own `tailwindcss/no-arbitrary-value` lint rule both forbid). Flagged in the PR (LDS-039).",
    "Anatomy #1-2's 9px trigger-to-panel offset (`sideOffset`) snaps to Space-8, the identical \"9 → 8\" call tooltip.tsx's own `EDGE_GAP` already made for the same prototype value — not re-derived, reused directly as the same decision for the same number. Anatomy #3's own row padding (\"9px by 11px\", archive/v1 `menu-row` style `padding:9px 11px`) snaps unambiguously to Space-8 vertical (the same 9→8 call) and Space-12 horizontal (11 is 1px from 12 and 3px from 8 — the closer step, no tie). Anatomy #4's own divider margin (\"5px of air either side\") is ambiguous between Space-4 and Space-6 (both 1px away) and is snapped to Space-4, the tighter of the two — the same tie-break tooltip.ts's own 10px-horizontal-padding note already chose for an identical ambiguous gap. All three per docs/prd.md §8.3.",
    "Anatomy #5's and the live demo's own literal `#ff8f6b` destructive-row colour does not ship as bare `text-alarm`: the same measured AA gap button.ts's own Danger-label note, table.ts's own destructive-verb note, text-input.ts's and tabs.ts's own entries already document for this exact colour at small/body text sizes on the light theme's `bg`. `PopoverMenuItem`'s own `destructive` variant instead ships `fg` text with an `alarm-soft` highlight on `data-highlighted` — reusing the highlight-not-text-colour pattern table.ts's own toolbar/row-menu destructive treatment already set (there, `alarm-line`/`alarm-soft` via Button's Danger variant; here, a plain background fill since a menu row has no border of its own to carry the signal). The structured `tokens` row above lists `alarm-soft` rather than `alarm` for this reason.",
    "No shadcn `components.json`/full `init` exists in this repo (the gap tabs.ts's and table.ts's own entries already flagged for the identical ticket wording, \"no Radix dependency anywhere\") — this ticket is the first to actually resolve it, since Popover's two kinds are exactly the case ADR-0004 was written for (real Radix behaviour worth keeping, unlike table.ts's own hand-rolled grid). `packages/ui/src/popover/popover.tsx` is scaffolded from the shadcn registry's own `popover` and `dropdown-menu` items (fetched via `shadcn view <name>`, not a full `shadcn add`/`init` — this package is a plain workspace library with no Next.js/Vite project or `components.json` of its own for the CLI's `add` command to target, confirmed by running it: \"It looks like you are running add [component] from a monorepo root\"), then rewritten per ADR-0004: every shadcn token class (`bg-popover`, `text-muted-foreground`, `rounded-md`, etc.) replaced with Lairy tokens, `CheckboxItem`/`RadioItem`/`Label`/`Shortcut`/`Sub*` dropped entirely (Rules \"Rows act\" puts toggles, filters and multi-selects out of scope for this component), and the new `radix-ui` package added to packages/ui/package.json's `dependencies`. Flagged in the PR as the ticket that finally pays off that gap.",
    "Radix's own `DropdownMenuPrimitive.Root` defaults `modal` to `true` (focus-trapped, page below `aria-hidden` and scroll-locked) — overridden to `false` and not exposed as a prop on `PopoverMenu` (`Omit<..., \"modal\">`), since Popover's own spec is explicit the page underneath \"is still live and still clickable\" (boundary sentence) and that \"focus is not trapped\" (Accessibility \"Focus moves and returns\") for both kinds alike. `PopoverPrimitive.Root`'s own default (`modal={false}`) already matches and needed no override.",
    "Relationship `kind` is new structured metadata the prototype's own Related cards carry no tag for, the same gap tooltip.ts's and table.ts's own entries already flag. Modal and Tooltip are both `often-confused-with`: the boundary sentence names both with the identical \"the line against X\" framing tooltip.ts's own Popover relationship used to justify that same kind. Select is `contrasts-with`: its own card explicitly shares this component's construction (\"the same floating surface\") while drawing a boundary on purpose (control vs menu), the same directional reading tooltip.ts's own Text input relationship already gave that kind. Flagged for Cory alongside tooltip.ts's and table.ts's own relationship kinds.",
    '`propGuidance` is empty: `extractProps`\'s own `propFilter` (packages/content/src/props.ts) keeps only props declared outside `node_modules`, and the one component react-docgen-typescript resolves for this id — `Popover` itself, docs/build-guide.md §4\'s "every ui component" convention — declares no props of its own at all; `ComponentProps<typeof PopoverPrimitive.Root>` is a type reference onto Radix\'s own declaration, which the filter correctly treats as inherited and drops (confirmed by running the extraction: the generated Props table for this entry is empty). `align` on `PopoverContent`/`PopoverMenuContent` and `destructive` on `PopoverMenuItem` have the same problem one level removed — they\'re on a different exported function than the one this id\'s table extracts from. All three stay documented in their own JSDoc in popover.tsx and in Rules/Accessibility above, but have no generated Props row for a guidance note to attach to. Flagged for Cory: LDS-009\'s "one component per entry" convention doesn\'t fit a component family with this many cooperating exports, the first entry to hit that gap.',
  ],
});
