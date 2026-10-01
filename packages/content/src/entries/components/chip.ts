import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/chip/examples";

/**
 * Chips, extracted from archive/v1/Workspace Shell.dc.html (template
 * 6085–6380, logic constants `chipAnatomy` 15438 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on "Badge" and "Button" in the opening boundary sentence,
 * and on component names inside the Usage "use something else" rows, is
 * dropped as markup, not content. See extractionNotes for every place
 * structured metadata was added, a literal had no clean token, or the
 * shipped component deliberately departs from the prototype's own markup.
 */
export const chip = ComponentEntrySchema.parse({
  meta: {
    id: "chip",
    name: "Chips",
    section: "components",
    status: "stable",
    version: "1.2.0",
    updated: "2026-10-01",
  },
  purpose: "A round-ended token representing a value the operator chose, such as a filter. The operator can dismiss it.",
  description: {
    summary: "A chip is a small pressable pill carrying a value the operator has chosen.",
    boundary:
      "It is theirs, not the system's: they turn it on, combine it with others, or take it away. That ownership is the whole distinction from a Badge, which is the same size and casing but assigned by the system and inert. A chip also never commits anything — it narrows what is shown, so if the press has a consequence it is a Button.",
  },
  anatomy: [
    {
      number: "1",
      name: "Container",
      description:
        "A 20px pill — the one deliberate exception to the sharp-radius lock. The round shape is what tells an operator this is theirs to press, not the system's to assign.",
    },
    {
      number: "2",
      name: "Label",
      description: "11.5px at .1em, uppercase. It names the value the chip carries, never the act of pressing it.",
    },
    {
      number: "3",
      name: "Padding",
      description:
        "5px vertical, 13px horizontal, widening to 9px on the right when a dismiss glyph is present so the label never crowds it.",
    },
    {
      number: "4",
      name: "Dismiss",
      description:
        "An optional × on removable chips only. It is a second hit target inside the chip, so it appears only where removal is the point.",
    },
  ],
  anatomyCaption:
    "Each part takes one edge of the frame, and every leader is a single straight line landing square on the target. Positions are measured from the artifact, so the diagram stays true at any size.",
  variants: [
    {
      name: "Filter",
      tokens: ["border", "dim"],
      description:
        "The default. One of a small set, at most one active at a time, narrowing what is already on screen. Pressing it changes the view, never the data.",
    },
    {
      name: "Toggle",
      tokens: ["border", "dim"],
      description: "Same shape, but several can be on at once. Use when the facets combine rather than replace each other.",
    },
    {
      name: "Removable",
      tokens: ["border", "dim", "mute"],
      description:
        "Carries a value the operator has already committed — a token in Select (Multi), an applied filter. The × is the only way out.",
    },
    {
      name: "Active",
      tokens: ["accent", "accent-soft"],
      description: "Not a variant so much as the on state: amber border, soft amber fill, amber label. Only ever one visual treatment for on.",
    },
  ],
  variantsNote:
    "There is no tonal chip — no info chip, no danger chip. Amber means on and that is the only colour a chip carries, because a coloured pill the operator can press would compete with the one action the page is actually asking for.",
  usage: {
    useWhen: [
      "The operator is narrowing a view they can already see.",
      "The facets are few enough to show at once, and worth showing without a click.",
      "The choice is theirs to make and theirs to undo, with no submit in between.",
      "A committed value needs to stay visible so it can be taken away later.",
    ],
    useInstead: [
      {
        target: "badge",
        text: "The system assigns it and it cannot be pressed — that is a Badge.",
      },
      {
        target: "button",
        text: "Pressing it commits or changes something — that is a Button.",
      },
      {
        target: "tabs",
        text: "It switches between whole views — that is Navigation (Tabs).",
      },
      {
        target: "select-multi",
        text: "The options outgrow a single row — that is Select (Multi).",
      },
    ],
  },
  contentRules: [
    {
      text: "Uppercase, 11.5px, .1em tracking — the same casing as a badge, so the shape rather than the type carries the difference.",
    },
    {
      text: 'One or two words naming the value: "OPEN", "LAST 7 DAYS". Never a verb — "FILTER" tells the operator nothing about what they get.',
    },
    {
      text: 'Keep a row of chips parallel in grammar and length; a set that mixes "OPEN" with "AWAITING MANUAL REVIEW" reads as unfinished.',
    },
    {
      text: "No counts inside the label. If the number matters, it belongs in the results heading, not baked into the chip.",
    },
    {
      text: "The same facet uses the same word wherever it appears, so a chip learned in one workspace is recognised in the next.",
    },
  ],
  propGuidance: [
    {
      prop: "children",
      note: 'One or two words naming the value, never a verb — "FILTER" tells the operator nothing about what they get (Content rule 2).',
    },
    {
      prop: "pressed",
      note: "Controlled: the consumer decides whether a Filter chip stays exclusive within its group or a Toggle chip combines freely with its siblings (Chips Variants) — the Chip itself only renders the on/off treatment.",
    },
    {
      prop: "onRemove",
      note: "Present only on a Removable chip, which carries an already-committed value — the × is the only way out (Chips Variants \"Removable\").",
    },
  ],
  examples: [
    {
      id: "filter",
      kind: "demo",
      title: "Filter",
      source: `${EXAMPLES_DIR}/filter.tsx`,
    },
    {
      id: "toggle",
      kind: "demo",
      title: "Toggle",
      source: `${EXAMPLES_DIR}/toggle.tsx`,
    },
    {
      id: "removable",
      kind: "demo",
      title: "Removable",
      source: `${EXAMPLES_DIR}/removable.tsx`,
    },
    {
      id: "active",
      kind: "demo",
      title: "Active",
      source: `${EXAMPLES_DIR}/active.tsx`,
    },
    {
      id: "good-ontone",
      kind: "good",
      title: "One treatment for on",
      caption: "One visual treatment for on, and the labels name values in parallel grammar.",
      source: `${EXAMPLES_DIR}/good-ontone.tsx`,
    },
    {
      id: "bad-tonal",
      kind: "bad",
      title: "Tonal chips",
      caption: "Never give chips tonal colours — amber means on, and nothing else competes for it.",
      source: `${EXAMPLES_DIR}/bad-tonal.tsx`,
    },
    {
      id: "good-fewfacets",
      kind: "good",
      title: "A short row shown in full",
      caption: "A short row shown in full, so every facet is visible without a click.",
      source: `${EXAMPLES_DIR}/good-fewfacets.tsx`,
    },
    {
      id: "bad-toomany",
      kind: "bad",
      title: "Chips wrapped onto three lines",
      caption: "Never wrap chips onto three lines — past about seven this wanted a Select (Multi).",
      source: `${EXAMPLES_DIR}/bad-toomany.tsx`,
    },
    {
      id: "good-removable",
      kind: "good",
      title: "Removable chips as tokens",
      caption: "Removable chips carry committed values, each with its own dismiss target.",
      source: `${EXAMPLES_DIR}/good-removable.tsx`,
    },
    {
      id: "bad-verb",
      kind: "bad",
      title: "An action inside a chip",
      caption: "Never put an action in a chip — a verb in a pill is a button wearing the wrong shape.",
      source: `${EXAMPLES_DIR}/bad-verb.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Pressed, not checked",
      body: "A filter or toggle chip is a button that reports aria-pressed, so a screen reader announces \"Open, pressed\" rather than leaving the operator to infer state from colour.",
    },
    {
      title: "Two targets, two labels",
      body: 'On a removable chip the body and the × are separate controls. The × carries its own label naming what it removes — "Remove Open" — never a bare "close".',
    },
    {
      title: "Never colour alone",
      body: "On state is amber border plus amber fill plus amber label plus aria-pressed. Three visual signals and one semantic one, because a single hue shift is invisible to a third of operators.",
    },
    {
      title: "Hit area",
      body: "The pill is 5px/13px padded to clear 32px in dense chrome. The × gets its own padding rather than shrinking the label's target.",
    },
  ],
  tokens: [
    { tokens: ["border", "dim"], usage: "Resting border and label" },
    { tokens: ["border-2", "fg"], usage: "Hover border and label" },
    { tokens: ["accent", "accent-soft"], usage: "Active border, fill and label" },
    { tokens: ["accent-soft", "accent-line"], usage: "Focus ring and its border" },
    { tokens: ["mute"], usage: "Dismiss glyph, brightening to --fg on hover" },
  ],
  relationships: [
    {
      target: "badge",
      kind: "contrasts-with",
      text: "Same size, opposite ownership. A badge is system-assigned and inert; if it can be pressed it belongs here.",
    },
    {
      target: "select-multi",
      kind: "alternative",
      text: "Where removable chips live as tokens. Use it instead when the option list is long enough to need a menu.",
    },
    {
      target: "tabs",
      kind: "contrasts-with",
      text: "Tabs switch between whole views; chips narrow the one view you are already in.",
    },
  ],
  changelog: [
    {
      version: "1.2.0",
      date: "2026-08-21",
      text: "Removable variant documented; dismiss glyph given its own hit area and label.",
    },
    {
      version: "1.1.0",
      date: "2026-08-16",
      text: "Pill radius kept at 20px as a named exception to the sharp-radius lock.",
    },
    {
      version: "1.0.0",
      date: "2026-08-12",
      text: "Initial release — filter and toggle, single active treatment.",
    },
  ],
  extractionNotes: [
    'Relationship `kind` follows badge.ts\'s precedent: Badge is `contrasts-with` (the mirror of Badge\'s own `contrasts-with` row back to Chip — opposite ownership, not an alternative route to the same goal); Select (Multi) is `alternative` per its own Related-card text ("Use it instead when the option list is long enough to need a menu"); Navigation (Tabs) is `contrasts-with` per its own Related-card text, which draws a boundary ("switch between whole views" vs. "narrow the one view") rather than offering an alternative. Flagged for review.',
    "`select-multi` is a new draft stub (packages/content/src/entries/components/select-multi.ts), the same pattern badge.ts used for `progress`: Select (Multi) has no ticket or CONTEXT.md glossary entry yet, so its stub `purpose` is paraphrased from this entry's own Related-card sentence about it, from Chip's side rather than its own — flagged, pending Select (Multi)'s own ticket.",
    "Variants `tokens` fold two prototype values that aren't colour-token names into the colour tokens the rendered chip actually carries in that state, the same way button.ts folded Danger's literal `#ff8f6b` into `alarm-line`/`alarm-soft`/`fg`: Toggle's own row reads `tok: 'multi-select'` (archive/v1/Workspace Shell.dc.html:15445) — a description of its selection cardinality, not a token — so `tokens` repeats Filter's resting pair (`border`/`dim`) since Toggle and Filter are the same visual treatment and differ only in how many a consumer lets stay on at once (captured in the variant's own `description`, kept verbatim). Removable's row reads `tok: '+ × glyph'` (line 15446) — likewise not a token — so `tokens` lists the resting pair plus `mute` for the dismiss glyph (chipTokens' own \"Dismiss glyph\" row, archive/v1/Workspace Shell.dc.html:15465).",
    "Anatomy #1's \"20px\" needed no snap: `@lairy/tokens`' `radius-chip` (Tailwind `rounded-chip`) is already the system's own named exception to the 2px radius lock at exactly 20px (packages/tokens/tokens/radius.json, AGENTS.md rule 5) — nothing to flag here, unlike the other literals below.",
    "Anatomy #2's \"11.5px\" and #3's \"5px vertical, 13px horizontal\" and the \"9px\" right padding when a dismiss glyph is present are kept verbatim in prose per ADR-0009; the shipped component (packages/ui/src/chip/chip.tsx) maps them per docs/prd.md §8.2–8.3's default tables: 11.5px → Label (12px, §8.2's \"11.5 → Label\") with the tracking kept at its own literal `tracking-tight-10` (.1em) rather than Label's own default .16em, the same decoupling badge.tsx already does (Micro's size, a non-default tracking); 13px horizontal → Space-12 (§8.3's explicit \"13 → 12\"); the 9px right padding when removable → Space-8 (§8.3's explicit \"9 → 8\"); the plain 5px vertical padding has no explicit snap entry (§8.3 only lists \"5 → 4 or 6\") and is chosen as Space-6 rather than Space-4, because Space-4 with Label's 1.4 line-height and the 1px border would fall further short of the Accessibility \"Hit area\" note's own claim of \"clears 32px\" than Space-6 does. Flagged for the token decisions backlog the same way badge.ts's own 2px/8px padding note was.",
    "The dismiss glyph's own hit-area technique — chip-x's `padding:2px;margin:-2px` (archive/v1/Workspace Shell.dc.html:15451 template) — is an informal nudge with no ramp entry for \"2\". It maps to Space-4 (the ramp's floor) for both the padding and the matching negative margin, so the control's visible size is unchanged while its hit box grows, the same floor-snap reasoning badge.ts used for its own sub-ramp literal.",
    "The dismiss glyph itself is drawn as a local inline SVG inside chip.tsx (path `M18 6 6 18M6 6l12 12`, the prototype's own cross, archive/v1/Workspace Shell.dc.html:15451) rather than added to `packages/ui/src/icons`' Inline icon set: that set is governed by the Icons foundation content entry (stable, 1.1.0), which currently documents exactly five inline icons, and extending its catalogue is out of scope for this ticket (AGENTS.md rule 9). The glyph does reuse that foundation's own `strokeInline` token (2) rather than the prototype's literal `stroke-width:3` on the same 24-unit viewBox, which exceeds the Icons foundation's own Construction rule 2 (\"Stroke is ... 2 on the 24 grid\") — flagged as a deliberate deviation from the prototype's markup, not an extraction error, the same class of deviation as button.tsx's Danger label colour. A follow-up ticket should decide whether a shared \"close\" inline icon belongs in the Icons foundation once a second component (Modal, Toast, Drawer) needs the same glyph.",
    "The prototype's own interactive chip markup (`chipAnatomy`'s rendered specimen and the `chips`/`chipToggles`/`chipTags` demo lists) uses a `<div onClick tabIndex=\"0\" class=\"chip focus-ring\">` for Filter/Toggle chips rather than a real `<button>` (archive/v1/Workspace Shell.dc.html:6182). Per AGENTS.md rule 2 (\"never copy markup\") and the precedent button.tsx already set (\"Always a real `<button>`, including Ghost and icon-only controls\"), the shipped component uses a real `<button type=\"button\">` for a pressable chip instead, carrying `aria-pressed` natively rather than through the prototype's own ad hoc div. The Removable variant's body, which the prototype's own markup never gives an `onClick`, stays a plain, non-interactive `<span>` for the same reason (Chips Variants \"Removable\": \"the × is the only way out\").",
    'The Usage "use something else when" rows all name a real or draft entry per docs/build-guide.md §3 — Badge, Button and Tabs already exist (badge.ts, button.ts, tabs.ts) and Select (Multi) is the new `select-multi` stub this entry adds.',
    'Accessibility "Never colour alone" claims the on state is "amber border plus amber fill plus amber label plus aria-pressed" (archive/v1/Workspace Shell.dc.html:15460) — kept verbatim per ADR-0009, but not what the shipped component does: axe measures bare --accent text over --accent-soft at 2.84:1 in the light theme (apps/docs/e2e/chip.spec.ts), well under AA, the same class of gap already routed around by badge.ts\'s Fail tone and button.ts\'s Danger variant. The pressed label (packages/ui/src/chip/chip.tsx) renders in --fg instead — two visual signals (border, fill) plus the semantic aria-pressed, one fewer than the prototype\'s own claimed three, with the word carrying the meaning regardless of its own colour. Flagged for the token decisions backlog.',
    "The prototype's own interactive chip (archive/v1/Workspace Shell.dc.html:6182) sets `transition:all .14s`; the shipped component carries no `color`/`border-color`/`background-color` transition at all, only button.tsx's own already-documented reasoning: those are theme-swapped custom properties, and animating them means a theme toggle passes through intermediate colours for the transition's duration, including combinations that fail AA contrast — exactly what axe caught here before this fix (apps/docs/e2e/chip.spec.ts). States snap instantly instead, the same deviation from the prototype's own markup button.ts's `transition-shadow`-only comment already made.",
  ],
});
