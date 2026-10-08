import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/select/examples";

/**
 * Select, extracted from archive/v1/Workspace Shell.dc.html (template
 * 5394–5717, logic constants `selAnatomy` 16013 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on component names in the opening boundary sentence, the
 * Usage "use something else" rows and the Related cards is dropped as
 * markup, not content. Completes the draft stub text-input.ts (LDS-028)
 * created for its `alternative` relationship. Like Text input, this entry
 * has no Variants section: the prototype's page goes straight from
 * Anatomy (01) to States (02), so `variants` stays the schema default.
 * See extractionNotes for every place structured metadata was added, a
 * literal had no clean token, or the shipped component deliberately
 * departs from the prototype's markup.
 */
export const select = ComponentEntrySchema.parse({
  meta: {
    id: "select",
    name: "Select",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-10-08",
  },
  purpose:
    "A select collapses one choice out of many into a single field, and spends a click to get the space back.",
  description: {
    summary:
      "A select collapses one choice out of many into a single field, and spends a click to get the space back.",
    boundary:
      "It is the same one-of-many question a Radio group asks, traded the other way round: the options are hidden until asked for, so the field always shows the current answer and never the alternatives. That trade is worth making from about six options up, or whenever the list can grow after launch. Below that, hiding the choices costs the operator more than the rows would.",
  },
  anatomy: [
    {
      number: "1",
      name: "Field",
      description:
        "The closed control, and the only part visible most of the time. It shares the text input’s box exactly — same height, same 10px/13px padding, same 2px corner — so a form of mixed controls still reads as one row of boxes.",
    },
    {
      number: "2",
      name: "Value",
      description:
        "The current answer in 14px --fg, or the placeholder in --mute when nothing is chosen. It is always the chosen option’s own words, never a count or a summary, because the field is the only place that answer appears.",
    },
    {
      number: "3",
      name: "Caret",
      description:
        "A single glyph on the right that rotates 180° and turns amber while the menu is open. It is the whole affordance: there is no second button, and the entire field is the hit target.",
    },
    {
      number: "4",
      name: "Menu",
      description:
        "A floating listbox on --bg with a --border-2 hairline and the deep panel shadow, matched to the field’s width and anchored 4px below it. It flips above the field when the viewport is short rather than scrolling the page.",
    },
    {
      number: "5",
      name: "Option",
      description:
        "One value per 9px/11px row, with an amber tick on the current one and a --panel-2 fill under hover and keyboard focus alike. Selecting closes the menu — a select commits on the click.",
    },
  ],
  anatomyCaption:
    "Shown open, since the menu is half the component. Each part takes one edge of the frame and every leader is a single straight line measured from the artifact itself.",
  states: [
    {
      name: "Default",
      description:
        "Closed with a value. This is the state the field lives in, so the value has to be legible at a glance and never abbreviated.",
    },
    {
      name: "Placeholder",
      description:
        "Nothing chosen yet. The text is a verb phrase in --mute so it never reads as a value, and it is never the field’s label doing double duty.",
    },
    {
      name: "Hover",
      description:
        "Pointer anywhere on the field. The border lifts to --fg and the caret follows, confirming the whole box is the target rather than the glyph.",
    },
    {
      name: "Focus",
      description:
        "Reached by keyboard, menu still closed. The soft amber ring is the system focus treatment and appears on nothing else.",
    },
    {
      name: "Open",
      description:
        "Menu showing. The field keeps the amber border for as long as the menu is up, so the two read as one object even with the shadow between them.",
    },
    {
      name: "Error",
      description:
        "A required field submitted empty. The border and caret both turn, and a line of text underneath says which field and why — colour never carries it alone.",
    },
    {
      name: "Disabled",
      description:
        "Not changeable now. The value stays readable at 45% so the operator can still see what it is set to, and something adjacent explains what would unlock it.",
    },
  ],
  statesNote:
    "There is no read-only variant distinct from disabled, and no searchable variant. Past roughly twenty options the field stops being the answer and the choice belongs in a modal picker with real search, rather than a select that quietly grows a text input.",
  usage: {
    useWhen: [
      "Six or more options, exactly one of which will be true.",
      "The list is data rather than design — it can grow without a redesign.",
      "The chosen value matters more day to day than the alternatives do.",
      "The row is dense — a toolbar or a table filter — and rows are not available.",
    ],
    useInstead: [
      {
        target: "radio",
        text: "Two to five options that want comparing — that is a Radio group.",
      },
      {
        target: "select-multi",
        text: "Several values can be true at once — that is Select (Multi).",
      },
      {
        target: "popover",
        text: "The rows are commands rather than values — that is a Popover menu.",
      },
      {
        target: "chip",
        text: "The choice narrows a visible list — those are Chips.",
      },
    ],
  },
  contentRules: [
    {
      text: "Label the field with the noun it sets — Stage, Owner, Region — above the box, never inside it as a placeholder that vanishes on the first pick.",
    },
    {
      text: "Write the placeholder as an instruction rather than a value: “Choose a stage”, not “None”, which is itself a legitimate option and would be ambiguous.",
    },
    {
      text: "Keep options to two or three words in sentence case, and make them parallel — all nouns or all verbs — so the list scans as one set of alternatives.",
    },
    {
      text: "Order options the way the operator thinks: by pipeline order, frequency or size, and only alphabetically when the list is long and unordered by nature.",
    },
    {
      text: "If “None” or “Any” is a real answer, put it in the list as the first row rather than relying on an empty field to mean it.",
    },
  ],
  propGuidance: [
    {
      prop: "label",
      note: "Always present, above the box, and never replaced by the placeholder (Content rule 1) — there is no labelless variant.",
    },
    {
      prop: "placeholder",
      note: "An instruction rather than a value (Content rule 2): “Choose a stage”, not “None”. Shown in --mute until an option is chosen (States “Placeholder”).",
    },
    {
      prop: "options",
      note: "Two or three words in sentence case, parallel, in the order the operator thinks (Content rules 3-4). A real “None” or “Any” answer is an option of its own, first in the list (Content rule 5).",
    },
    {
      prop: "error",
      note: "Says which field and why, in words underneath (States “Error”); the field takes aria-invalid and the message is tied to it by aria-describedby (Accessibility “Errors are announced”).",
    },
  ],
  examples: [
    {
      id: "demo",
      kind: "demo",
      title: "Stage select",
      source: `${EXAMPLES_DIR}/demo.tsx`,
    },
    {
      id: "good-label-above",
      kind: "good",
      title: "Label above, value in the field",
      caption: "Label above, the current value in the field — readable without opening anything.",
      source: `${EXAMPLES_DIR}/good-label-above.tsx`,
    },
    {
      id: "bad-label-as-placeholder",
      kind: "bad",
      title: "Label doing duty as the placeholder",
      caption:
        "Never let the label do duty as the placeholder — once a value is picked, the question is gone.",
      source: `${EXAMPLES_DIR}/bad-label-as-placeholder.tsx`,
    },
    {
      id: "good-error-in-words",
      kind: "good",
      title: "A required field that says so in words",
      caption: "An empty required field says so in words underneath, not in the border alone.",
      source: `${EXAMPLES_DIR}/good-error-in-words.tsx`,
    },
    {
      id: "bad-two-option-selects",
      kind: "bad",
      title: "Two selects of two options each",
      caption:
        "Never stack two selects that each hold two options — that is two radio groups paying rent on a click each.",
      source: `${EXAMPLES_DIR}/bad-two-option-selects.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Combobox and listbox",
      body: 'The field is a role="combobox" with aria-expanded and aria-controls pointing at the role="listbox" menu; each row is an option carrying aria-selected. The field is labelled by the visible label, not by placeholder text.',
    },
    {
      title: "Keyboard opens and moves",
      body: "Enter, Space or Down opens the menu at the current value; arrows move the active option, Enter commits, Escape closes and returns focus to the field with the old value intact. Tab closes and moves on — it never leaves an orphaned menu behind.",
    },
    {
      title: "Focus and selection differ",
      body: "The active row under the keyboard and the currently selected row are two different things, so the tick marks selection while the --panel-2 fill marks position. Never let the fill alone imply what is chosen.",
    },
    {
      title: "Errors are announced",
      body: "The message under the field is tied to it with aria-describedby and the field takes aria-invalid, so a screen reader hears the reason with the control rather than as a loose sentence somewhere in the form.",
    },
  ],
  tokens: [
    { tokens: ["border-2"], usage: "Resting field border, menu hairline" },
    { tokens: ["accent-line"], usage: "Field border while focused or open" },
    { tokens: ["accent"], usage: "Caret when open, tick on the current option" },
    { tokens: ["bg"], usage: "Field and menu surface" },
    { tokens: ["panel-2"], usage: "Hover and active-option fill" },
    { tokens: ["mute"], usage: "Placeholder text, resting caret" },
    { tokens: ["alarm-line"], usage: "Error border" },
  ],
  relationships: [
    {
      target: "radio",
      kind: "alternative",
      text: "Use instead under about six options. A radio group spends rows to show the alternatives; a select spends a click to hide them.",
    },
    {
      target: "select-multi",
      kind: "often-confused-with",
      text: "Differs in that the menu stays open and the chosen set becomes tokens in the field. One value or many is the only question that decides between them.",
    },
    {
      target: "popover",
      kind: "often-confused-with",
      text: "Looks the same open, but its rows are actions that do something. If a row does not set the field’s value, it belongs in a popover menu.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-25",
      text: "Menu width locked to the field; searchable and read-only variants ruled out in favour of a modal picker past twenty options.",
    },
    {
      version: "1.0.1",
      date: "2026-08-21",
      text: "Selection now closes the menu; active-row fill separated from the selected tick.",
    },
    {
      version: "1.0.0",
      date: "2026-08-13",
      text: "Select introduced as a custom listbox sharing the text input’s box.",
    },
  ],
  extractionNotes: [
    "Replaces the draft stub text-input.ts (LDS-028) created so its `alternative` relationship and its first \"use something else\" row had a target. That stub's `purpose` was paraphrased from Text input's Related card; this entry's `purpose` is now the opening sentence verbatim. `select` stays distinct from `select-multi` (LDS-021's stub).",
    'Usage "use something else when": each row names one component, so each is a typed `useInstead` item — Radio (`radio`), Select (Multi) (`select-multi`), Popover (`popover`) and Chips (`chip`). All four targets already exist, so no new stubs are needed.',
    "Relationship `kind`: Radio is `alternative` (its Related card says \"Use instead\"). Select (Multi) and Popover are `often-confused-with` — their cards describe near-identical looks or behaviour that differ in one respect (\"One value or many is the only question\", \"Looks the same open\") rather than a direct substitute or a pairing. Flagged for review.",
    "The prototype's `selTokens` row for `#ff8f6b` (\"Error border, caret and message\") is carried as `alarm-line` with the usage shortened to \"Error border\", the same deviation text-input.ts and textarea.ts already made: --alarm text and glyphs on the light theme's --bg measure roughly 1.9:1, under AA. The shipped component borders the field with `border-alarm-line` and renders the message in `text-fg` and the caret in `text-mute`; the States “Error” prose (“the border and caret both turn”) is kept verbatim, but the caret does not turn — the words under the field and aria-invalid / aria-describedby carry the signal, as the prose itself says colour never does alone. Flagged for the token decisions backlog alongside button.ts's and chip.ts's alarm-contrast deviations.",
    "Size and spacing literals in prose are kept verbatim (ADR-0009; the same choice text-input.ts made) and mapped to tokens in the shipped component: 14px mono value and option text → Body (`text-body`); the caret at 11px → Micro (`text-micro`, the type floor); the tick at 12px → Label (`text-label`, only a glyph so its tracking is moot); the field's 10px/13px padding → Space-8 / Space-12 (13 → 12 per the ramp's default table; 10 is a tie between 8 and 12, resolved to the tighter 8, the same call text-input.ts made, so the field matches Text input's box); the option's 9px/11px → Space-8 / Space-12 (9 → 8, 11 → 12); the menu's 5px padding → Space-4 (tie-break to the tighter step, as popover.tsx's separator did); the 4px menu offset is already Space-4; the 2px corner is the locked radius. The error line is Micro (11px).",
    "The States table's `tk` column (the token under each live specimen, e.g. \"--border-2\", \"ring + --accent-line\") has no field in `StateDocSchema`; every token it names is in the `tokens` section already, the same call text-input.ts made.",
    "Hover (\"The border lifts to --fg and the caret follows\") ships as `hover:border-fg` plus `hover:bg-panel-2` — the prototype's Hover specimen also fills the field with --panel-2, which the prose does not mention. Disabled blocks it (`enabled:`).",
    "Focus: the field shows the amber ring on `:focus`, not `:focus-visible` — the States “Focus” row calls it the system focus treatment and describes no pointer exemption, matching text-input.tsx. While the menu is open the border stays --accent-line (States “Open”).",
    "Disabled (`op: .45`) ships as the bare utility `opacity-45` with `text-faint`, `border-border`, the same non-arbitrary precedent text-input.tsx's `opacity-55` set. WCAG 1.4.3 exempts an inactive control's text from contrast.",
    "The menu is rendered in a portal by Radix Select, positioned `popper`-style so it matches the trigger's width (`--radix-select-trigger-width`) and flips above the field when the viewport is short (`avoidCollisions`). Those two Radix CSS variables are the only non-token values and are read through inline styles, as popover.tsx does for `popoverTokens.panelWidth`. The deep panel shadow is `shadow-menu` and the open animation is `animate-panel-in` (the prototype's `panelIn .16s`), both already provisioned.",
    "The component is scaffolded from shadcn's `select` (ADR-0004) on Radix Select, so Accessibility “Combobox and listbox” is carried by Radix: the trigger is a `button` with role=\"combobox\", aria-expanded and aria-controls, and options are role=\"option\" with aria-selected. It differs from the prototype's markup (a focusable `div`) deliberately — a native button is the correct element — and the visible label is tied by `<label for>`. Focus moves into the menu, Escape closes it and returns focus to the field, and Tab closes it.",
    "The Do/don't pairs in the prototype are three rows of two tiles. The first pair (label above / label as placeholder) and the error tile and the two-selects tile are shipped as examples. The menu pair (matched width with an amber tick / shrunk and truncated menu with amber text) is not: the component locks the menu to the field's width and always marks the current option with the tick, so the bad state cannot be produced from it — it is kept as the Anatomy #4 / #5 prose. One `demo` example (`demo`), no Variants grid.",
    "`options` takes `{ value, label, disabled? }`; Radix reserves the empty string for \"no selection\", so Content rule 5's real “None” / “Any” answer needs its own non-empty value. This is a propGuidance addition, not a content deviation.",
    "The shipped component needs `\"use client\"` (`useId`, Radix Select), the same precedent text-input.tsx set; the registry item copies the directive out verbatim.",
  ],
});
