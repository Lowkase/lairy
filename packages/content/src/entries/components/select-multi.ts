import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/select-multi/examples";

/**
 * Select (Multi), extracted from archive/v1/Workspace Shell.dc.html
 * (template 5718–6084, logic constants `mtAnatomy` 16063 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on component names in the opening boundary sentence, the
 * Usage "use something else" rows and the Related cards is dropped as
 * markup, not content. Completes the draft stub LDS-021 (Chips) created for
 * its `alternative` relationship. See extractionNotes for every place
 * structured metadata was added, a literal had no clean token, or the
 * shipped component deliberately departs from the prototype's markup.
 */
export const selectMulti = ComponentEntrySchema.parse({
  meta: {
    id: "select-multi",
    name: "Select (Multi)",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-10-08",
  },
  purpose: "A multi-select holds several values in one field, each one a token the operator can take back out.",
  description: {
    summary: "A multi-select holds several values in one field, each one a token the operator can take back out.",
    boundary:
      "Everything it does differently from Select follows from one fact: the answer is a set, so the set has to stay visible and stay editable. That is why picking does not close the menu, why the chosen values come back as removable tokens rather than as a count, and why the field is allowed to be taller than a text input. It is still a form control, not a filter bar — if the choice narrows a list in front of the operator, those are Chips.",
  },
  anatomy: [
    {
      number: "1",
      name: "Field",
      description:
        "A fixed 42px box — four pixels taller than the single select, and never taller than that. The height is fixed on purpose: a field that grows a row per pick reflows the form underneath the operator while they are working in it.",
    },
    {
      number: "2",
      name: "Token",
      description:
        "One chosen value, in the amber-soft box with an --accent-line hairline, carrying its own ✕. The tokens are the answer, which is why they name their values in full and are never collapsed into “3 selected”.",
    },
    {
      number: "3",
      name: "Overflow",
      description:
        "A counted --panel-2 chip standing in for the tokens that no longer fit the measured width. It is the pressure valve that lets the field stay one row tall, and opening the menu shows the full set again.",
    },
    {
      number: "4",
      name: "Menu",
      description:
        "The same listbox as Select — field width, --border-2 hairline, deep shadow — with a square 16px checkbox on every row and its metadata right-aligned in --faint. Picking does not close it, because the answer is a set and sets are built up.",
    },
    {
      number: "5",
      name: "Footer",
      description:
        "A hairline-separated row with the live count on the left and ALL / CLEAR on the right. It exists because bulk moves are the two things a multi-select is asked for that a single select never is.",
    },
  ],
  anatomyCaption:
    "Shown open with the field already holding a set, since that is the state the control is designed around. Each part takes one edge and every leader is measured from the artifact.",
  states: [
    {
      name: "Empty",
      description:
        "No values yet. The placeholder is a plural instruction — “Select stages” — so it reads as a prompt for a set rather than for one value.",
    },
    {
      name: "Focus",
      description:
        "Reached by keyboard with the menu still closed. The field takes the soft amber ring, and the caret turns amber the moment the menu opens.",
    },
    {
      name: "Overflow",
      description:
        "More tokens chosen than fit the measured width. The remainder becomes one counted chip rather than a second row, and the count is exact.",
    },
    {
      name: "Error",
      description:
        "A required field submitted with an empty set. The border and caret turn and a line underneath says how many are needed — never the border alone.",
    },
    {
      name: "Disabled",
      description:
        "Not editable now. Tokens stay legible but lose their ✕, so the set can still be read while nothing about it can be changed.",
    },
  ],
  statesNote:
    "There is no state for a partially valid set and no per-token error. Validation belongs to the field as a whole, because the operator submits a set rather than a sequence of picks — and the specimens for every state are rendered live in the panel below.",
  usage: {
    useWhen: [
      "Several values out of seven or more can be true at once.",
      "The chosen set has to stay readable after the menu closes.",
      "Values are removed as often as they are added — tokens make that one click.",
      "The list is data and can grow, so a column of checkboxes would not hold.",
    ],
    useInstead: [
      { target: "select", text: "Exactly one value is allowed — that is Select." },
      { target: "checkbox", text: "Under about seven options with room for rows — those are Checkboxes." },
      { target: "chip", text: "The set narrows a list already on screen — those are Chips." },
      { target: "popover", text: "The rows run commands rather than setting values — that is a Popover menu." },
    ],
  },
  contentRules: [
    {
      text: "Label the field with the plural noun it collects — Stages, Owners, Regions — so the operator knows a set is expected before they open it.",
    },
    {
      text: "Write the placeholder as a plural instruction: “Select stages”, never “Stage” or “None selected”, which read as a single value and a state respectively.",
    },
    {
      text: "Keep option labels to two or three words, since each one has to survive being shown twice — once as a menu row, once as a token in a narrow field.",
    },
    {
      text: "Show metadata in the menu rows rather than on the tokens: the row is where the operator decides, and the token only has to identify what was decided.",
    },
    {
      text: "Count in the footer with the total — “3 of 5” — so the operator can see at a glance whether ALL would change anything.",
    },
  ],
  propGuidance: [
    {
      prop: "label",
      note: "The plural noun the field collects (Content rule 1), above the box and never replaced by the placeholder — there is no labelless variant.",
    },
    {
      prop: "placeholder",
      note: "A plural instruction (Content rule 2): “Select stages”, never “None selected”. Shown in --mute until a value is chosen (States “Empty”).",
    },
    {
      prop: "options",
      note: "Two or three words per label, since each is shown as a row and as a token (Content rule 3). `meta` shows on the menu row only, never on the token (Content rule 4).",
    },
    {
      prop: "error",
      note: "Says how many are needed, in words underneath (States “Error”); the field takes aria-invalid and the message is tied to it by aria-describedby.",
    },
  ],
  examples: [
    {
      id: "demo",
      kind: "demo",
      title: "Stage multi-select",
      source: `${EXAMPLES_DIR}/demo.tsx`,
    },
    {
      id: "good-fixed-height",
      kind: "good",
      title: "Fixed height, counted overflow",
      caption: "Fixed height: tokens that no longer fit collapse into a counted overflow chip.",
      source: `${EXAMPLES_DIR}/good-fixed-height.tsx`,
    },
    {
      id: "bad-growing-field",
      kind: "bad",
      title: "A field that grows row by row",
      caption: "Never let the field grow row by row — the form reflows under the operator as they pick.",
      source: `${EXAMPLES_DIR}/bad-growing-field.tsx`,
    },
    {
      id: "bad-round-dials",
      kind: "bad",
      title: "Dials in a multi-select menu",
      caption: "Never use dials in a multi-select menu — round means one-of everywhere else in the system.",
      source: `${EXAMPLES_DIR}/bad-round-dials.tsx`,
    },
    {
      id: "bad-count-instead-of-set",
      kind: "bad",
      title: "The set replaced by a count",
      caption: "Never replace the set with a count — the operator has to reopen the menu to learn what they chose.",
      source: `${EXAMPLES_DIR}/bad-count-instead-of-set.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Multiselectable listbox",
      body: 'The field is a role="combobox" with aria-expanded; the menu is a role="listbox" with aria-multiselectable and each row carries aria-checked. The plural label is what the field is named by, not the placeholder.',
    },
    {
      title: "The menu stays put",
      body: "Space toggles the active row and leaves the menu open and focus where it was, so a keyboard operator builds the set in one pass. Escape closes and returns focus to the field with the set intact; Tab closes and moves on.",
    },
    {
      title: "Tokens are reachable",
      body: "Each ✕ is a real button labelled “Remove Ingest” rather than a bare glyph, and Backspace with the field focused removes the last token — the shortcut is a convenience, never the only way.",
    },
    {
      title: "Changes are announced",
      body: "The count line is a live region, so adding or clearing values is spoken as “3 of 5 selected” instead of leaving a keyboard operator to infer the state from a field they cannot see.",
    },
  ],
  tokens: [
    { tokens: ["accent-line"], usage: "Token border, field border when open" },
    { tokens: ["accent-soft"], usage: "Token fill" },
    { tokens: ["accent"], usage: "Caret when open, checked box fill" },
    { tokens: ["border-2"], usage: "Resting field border, menu hairline, overflow chip" },
    { tokens: ["panel-2"], usage: "Overflow chip fill, row hover" },
    { tokens: ["mute"], usage: "Placeholder, token remove glyph" },
    { tokens: ["alarm-line"], usage: "Error border" },
  ],
  relationships: [
    {
      target: "select",
      kind: "often-confused-with",
      text: "Differs only in cardinality, and everything else follows: one value, so the menu closes on the pick and the field shows a word instead of tokens.",
    },
    {
      target: "checkbox",
      kind: "alternative",
      text: "Use instead under about seven options. Rows of boxes cost space but no clicks, and they show the whole set of possibilities at once.",
    },
    {
      target: "chip",
      kind: "often-confused-with",
      text: "Looks like the tokens but does the opposite job: chips narrow a list in front of the operator and commit nothing to a form.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-25",
      text: "Field height locked at 42px with measured overflow collapse; footer count paired with the total.",
    },
    {
      version: "1.0.1",
      date: "2026-08-22",
      text: "Selection no longer closes the menu; ALL and CLEAR added to the footer.",
    },
    {
      version: "1.0.0",
      date: "2026-08-14",
      text: "Multi introduced with removable tokens and square boxes in the menu.",
    },
  ],
  extractionNotes: [
    "Replaces the draft stub LDS-021 (Chips) created so its `alternative` relationship and its \"use something else when\" row had a target. That stub's `purpose` was paraphrased from Chips' Related card; this entry's `purpose` is now the opening sentence verbatim. CONTEXT.md still has no glossary entry for Select (Multi) — flagged.",
    'Usage "use something else when": each row names one component, so each is a typed `useInstead` item — Select (`select`), Checkbox (`checkbox`), Chips (`chip`) and Popover (`popover`). All four targets already exist, so no new stubs are needed. The prototype\'s "Checkbox​es" plural is kept as "Checkboxes".',
    "Relationship `kind`: Checkbox is `alternative` (its Related card says \"Use instead\"). Select and Chips are `often-confused-with` — their cards describe a near-identical look or behaviour that differs in one respect (\"Differs only in cardinality\", \"Looks like the tokens but does the opposite job\"). Flagged for review.",
    "The prototype's `mtTokens` row for `#ff8f6b` (\"Error border, caret and message\") is carried as `alarm-line` with the usage shortened to \"Error border\", the same deviation select.ts, text-input.ts and textarea.ts already made: --alarm text and glyphs on the light theme's --bg measure roughly 1.9:1, under AA. The shipped component borders the field with `border-alarm-line` and renders the message in `text-fg` and the caret in `text-mute`; the States “Error” prose (“The border and caret turn”) is kept verbatim, but the caret does not turn — the words underneath plus aria-invalid / aria-describedby carry the signal.",
    "Size and spacing literals in prose are kept verbatim (ADR-0009; the same choice select.ts made) and mapped to tokens in the shipped component: the Field's fixed 42px box has no ramp step (4, 6, 8, 12, 16, 18, 22, 32, 44) and snaps to the nearest, Space-44 (`h-44`) — so “four pixels taller than the single select” is now two pixels off in the shipped component. Flagged for the token decisions backlog; the field height is still fixed and never grows. The 16px menu box → Space-16 (`size-16`); the 15px remove target → Space-16; the token's 4px/6px/9px padding → Space-4 / Space-6 / Space-8 (9 → 8); the overflow chip's 4px/9px → Space-4 / Space-8; the field's 11px side padding → Space-12; menu rows' 8px/10px → Space-8 / Space-8 (10 is a tie between 8 and 12, resolved to the tighter 8, as select.tsx did); the menu's 5px padding → Space-4; the 4px menu offset is already Space-4; the 2px corner is the locked radius. Text: 14px value, placeholder and rows → Body (`text-body`); 12.5px token and chip text → Small (`text-small`, 13px); 12px ✕ → Label; 11px caret → Micro; 10.5px footer count and ALL / CLEAR → Micro (11px, the type floor).",
    "The menu's metadata is `--faint` in the prototype (anatomy #4, kept verbatim) but ships as `text-mute`, and so does the footer count: axe measured --faint text at Micro (11px) on the light theme's --bg at 3.69:1, short of AA's 4.5:1 — the same gap text-input.tsx and empty-state.ts document. Flagged.",
    "The States table's `tk` column (the token under each live specimen) has no field in `StateDocSchema`; every token it names is in the `tokens` section already, the same call select.ts made. The prototype's Overflow specimen ('Collapse past two tokens') is a fixed illustration; the shipped component collapses by measured width, per the Overflow anatomy prose.",
    "Disabled (`op: .38`) ships on the token layer as the bare utility `opacity-38`, with the field `border-border` and `bg-panel-2`, matching the States specimen. WCAG 1.4.3 exempts an inactive control's text.",
    "Focus: the field shows the amber ring on `:focus`, not `:focus-visible`, matching select.tsx and text-input.tsx (States “Focus” describes no pointer exemption). While the menu is open the border stays --accent-line and the caret turns amber and rotates.",
    "No shadcn counterpart (ticket): the component is built on Radix Popover with a hand-rolled listbox. The combobox is a real `<button>` that fills the field box; the tokens and their ✕ buttons sit in a sibling layer above it, because a button cannot contain buttons. Because Radix Popover's trigger and content come with `aria-haspopup=\"dialog\"` and `role=\"dialog\"`, the component overrides them to `listbox` and `group` (labelled by the field's label) so the semantics match Accessibility “Multiselectable listbox”. The listbox carries `aria-multiselectable`; each row carries `aria-checked` (verbatim) and also `aria-selected`, so assistive tech that only reads one of the two still hears the state.",
    "Accessibility “The menu stays put” says “Tab closes and moves on.” The ticket requires that focus moves in and is held while the menu is open, and the footer's ALL / CLEAR buttons have to be reachable by keyboard, so the menu is modal (Radix Popover `modal`): Tab cycles through the footer and wraps instead of closing the menu. Escape closes and returns focus to the field with the set intact; the field then Tabs on normally. Flagged as a deviation from the prose, which is kept verbatim.",
    "Focus stays on the listbox while rows toggle (the active row is tracked with `aria-activedescendant`, arrows / Home / End move it, Space and Enter toggle), and row clicks do not take focus (`mousedown` is prevented), matching “leaves the menu open and focus where it was”.",
    "Overflow is measured: an invisible, `aria-hidden` copy of every token and of the `+N more` chip is measured against the token track's width (and re-measured on resize), so the cap is exact. When not even one token fits the chip reads “N selected” (the prototype's `mCap === 0` branch). When the track has no measurable width (hidden, or jsdom) all tokens are shown.",
    "Footer buttons read “All” and “Clear” in the DOM and are rendered uppercase with `uppercase`, so their accessible names are the plain words; the count is `role=\"status\"` (“3 of 5 selected”, uppercase by CSS). ALL selects every enabled option and keeps any disabled one that was already chosen; CLEAR clears everything but disabled chosen values.",
    "`value` / `defaultValue` / `onValueChange` take `string[]`, always in option order. With `name`, one hidden input per value is rendered so the set submits with a form.",
    "The Do/don't pairs in the prototype are three rows of two tiles. Shipped: fixed-height / growing-field, dials, and the count; the menu 'square boxes and a footer' good tile is the demo's own open menu and is not a separate example, since a static tile would only duplicate the component. One `demo` example, no Variants grid.",
    "The shipped component needs `\"use client\"` (`useId`, Radix Popover), the same precedent select.tsx set; the registry item copies the directive out verbatim.",
  ],
});
