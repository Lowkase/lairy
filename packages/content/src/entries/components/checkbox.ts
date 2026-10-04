import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/checkbox/examples";

/**
 * Checkbox, extracted from archive/v1/Workspace Shell.dc.html (template
 * 4461–4747, logic constants `cbAnatomy` 15566 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on "Radio" and "Switch" in the opening boundary sentence,
 * and on component names inside the Usage "use something else" rows and
 * the Related cards, is dropped as markup, not content. This entry has no
 * Variants section at all — like Text input's, the prototype's own page
 * goes straight from Anatomy (01) to States (02) to Usage (03) — so
 * `variants` stays the schema default `[]`. See extractionNotes for every
 * place structured metadata was added, a literal had no clean token, or the
 * shipped component deliberately departs from the prototype's own markup.
 */
export const checkbox = ComponentEntrySchema.parse({
  meta: {
    id: "checkbox",
    name: "Checkbox",
    section: "components",
    status: "stable",
    version: "1.2.0",
    updated: "2026-08-20",
  },
  purpose: "Records an independent yes-or-no the operator sets themselves.",
  description: {
    summary: "A checkbox records an independent yes-or-no the operator sets themselves.",
    boundary:
      "Each box stands on its own, so ticking one says nothing about the others, and nothing happens until the form is submitted. If the options are mutually exclusive it is a Radio; if the change lands the instant it is flipped it is a Switch. That deferred, independent quality is what everything below assumes.",
  },
  anatomy: [
    {
      number: "1",
      name: "Box",
      description:
        "18px square, 1.5px border, 2px radius. Fixed at every density — the box never scales with its label.",
    },
    {
      number: "2",
      name: "Glyph",
      description:
        "A tick when on, a dash when indeterminate, nothing when off. Drawn in --bg so it reads as cut out of the fill rather than sat on top.",
    },
    {
      number: "3",
      name: "Label",
      description:
        "14px --fg in sentence case, 12px from the box. It states what being checked means, not what the click does.",
    },
    {
      number: "4",
      name: "Hit row",
      description:
        "The box and label share one 9px/11px padded row, so the whole line is clickable and clears the 32px minimum in dense chrome.",
    },
  ],
  anatomyCaption:
    "Each part takes one edge of the frame, and every leader is a single straight line landing square on the target. Positions are measured from the artifact, so the diagram stays true at any size.",
  states: [
    {
      name: "Off",
      description:
        'The resting state. An empty box, never a greyed tick — an absent glyph is the only honest way to show "not chosen".',
    },
    {
      name: "On",
      description:
        "Filled amber with a --bg tick. Amber is the act colour, and checking something is an act.",
    },
    {
      name: "Indeterminate",
      description:
        "A parent whose children are partly checked. Only ever set by the system from its children — never something the operator can click into.",
    },
    {
      name: "Error",
      description:
        "A required box left unchecked at submit. The border carries it, never the fill, so the state still reads at a glance.",
    },
    {
      name: "Disabled",
      description:
        "Unavailable but still present, and still announced. A checkbox that vanishes reads as a bug.",
    },
  ],
  statesNote:
    "There is no read-only checkbox distinct from disabled. A value the operator cannot change is either disabled, or it is not a control at all and belongs in the page as text.",
  usage: {
    useWhen: [
      "The answer is independently yes or no, and other options do not constrain it.",
      "The operator may pick none, some, or all of a small set.",
      "The change is committed later by a submit, not the instant it is clicked.",
      "The full set of options is short enough to show at once — up to about seven.",
    ],
    useInstead: [
      {
        target: "radio",
        text: "Exactly one option may be chosen — that is a Radio.",
      },
      {
        target: "switch",
        text: "The setting applies immediately with no submit — that is a Switch.",
      },
      {
        target: "select-multi",
        text: "The list is long or the chosen set must stay visible — that is Select (Multi).",
      },
      {
        target: "table",
        text: "It selects rows to act on rather than recording a value — that belongs to Table, where selection is Ice.",
      },
    ],
  },
  contentRules: [
    {
      text: 'Label in sentence case, 14px, no terminal punctuation: "Send weekly digest", never "SEND WEEKLY DIGEST" or "Send weekly digest."',
    },
    {
      text: 'Phrase the label as the positive statement being agreed to, so checking always means yes. "Include archived", never "Do not include archived".',
    },
    {
      text: 'Say what the state means, not what the click does — "Retry failed steps", never "Click to retry".',
    },
    {
      text: "Keep labels to a line where possible; if the rule needs explaining, put a 12.5px --mute line beneath rather than lengthening the label.",
    },
    {
      text: "A group of checkboxes shares one grammar and one subject, so the set can be read as a list rather than five unrelated sentences.",
    },
  ],
  propGuidance: [
    {
      prop: "label",
      note: 'States what being checked means, not what the click does (anatomy #3, Content rule 3) — "Retry failed steps", never "Click to retry".',
    },
    {
      prop: "description",
      note: "A --mute line beneath the label, only where the rule needs explaining (Content rule 4) — never a reason to lengthen the label itself.",
    },
    {
      prop: "indeterminate",
      note: "Set only by the system from a group of children, never something the operator can click into directly (States \"Indeterminate\", Do/don't \"Never use indeterminate as a third answer\").",
    },
    {
      prop: "error",
      note: "A required box left unchecked at submit (States \"Error\"). The border carries the signal; it never changes the fill.",
    },
  ],
  examples: [
    {
      id: "retry-failed-steps",
      kind: "demo",
      title: "Retry failed steps",
      source: `${EXAMPLES_DIR}/retry-failed-steps.tsx`,
    },
    {
      id: "good-positive-label",
      kind: "good",
      title: "Labels state the positive",
      caption: "Labels state the positive, so a tick always means yes.",
      source: `${EXAMPLES_DIR}/good-positive-label.tsx`,
    },
    {
      id: "bad-negated-label",
      kind: "bad",
      title: 'A negated "don\'t include" label',
      caption: 'Never negate a label — a ticked "don\'t include" forces the reader to do logic.',
      source: `${EXAMPLES_DIR}/bad-negated-label.tsx`,
    },
    {
      id: "good-detail-beneath",
      kind: "good",
      title: "Detail beneath a one-line label",
      caption: "Detail goes on a --mute line beneath, keeping the label to one line.",
      source: `${EXAMPLES_DIR}/good-detail-beneath.tsx`,
    },
    {
      id: "bad-label-as-sentence",
      kind: "bad",
      title: "A label grown into a sentence",
      caption: "Never grow the label into a sentence — the box stops being scannable.",
      source: `${EXAMPLES_DIR}/bad-label-as-sentence.tsx`,
    },
    {
      id: "good-indeterminate-from-children",
      kind: "good",
      title: "Indeterminate derived from children",
      caption: "Indeterminate is derived from children — the system sets it, never a click.",
      source: `${EXAMPLES_DIR}/good-indeterminate-from-children.tsx`,
    },
    {
      id: "bad-indeterminate-as-answer",
      kind: "bad",
      title: "Indeterminate as a third answer",
      caption: "Never use indeterminate as a third answer an operator can choose.",
      source: `${EXAMPLES_DIR}/bad-indeterminate-as-answer.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Real inputs",
      body: 'Every checkbox is a real input with a bound label, so it takes a tab stop, toggles on Space, and announces its checked state. Indeterminate is set through the DOM property, which is what lets a screen reader say "partially checked".',
    },
    {
      title: "The row is the target",
      body: "The 18px box is smaller than any hit-target floor, so the padded row carries the interaction. Clicking the label toggles the box — a label that does nothing is a broken control.",
    },
    {
      title: "Never colour alone",
      body: "Checked is signalled by the tick as well as the fill, and error by a border plus a message. Under greyscale the tick still reads, which is the test.",
    },
    {
      title: "Groups announce",
      body: "A set of related checkboxes shares a group label so its purpose is announced once, and the reading order follows the visual order down the column.",
    },
  ],
  tokens: [
    { tokens: ["border-2"], usage: "Box border when off" },
    { tokens: ["accent", "bg"], usage: "Fill when on, and the glyph cut out of it" },
    { tokens: ["accent-soft", "accent-line"], usage: "Focus ring and its border" },
    { tokens: ["alarm-line"], usage: "Error border" },
    { tokens: ["fg"], usage: "Label, and the box border on hover" },
  ],
  relationships: [
    {
      target: "radio",
      kind: "alternative",
      text: "Use instead when the options are mutually exclusive. A checkbox answers one yes-or-no; a radio picks one of several.",
    },
    {
      target: "switch",
      kind: "alternative",
      text: "Use instead when the change takes effect immediately. Checkboxes wait for a submit; switches do not.",
    },
    {
      target: "select-multi",
      kind: "alternative",
      text: "Use instead past roughly seven options, or when the chosen set needs to stay visible after the list closes.",
    },
  ],
  changelog: [
    {
      version: "1.2.0",
      date: "2026-08-20",
      text: "Indeterminate documented as system-set only; hover tint unified with Radio.",
    },
    {
      version: "1.1.0",
      date: "2026-08-15",
      text: "Box radius locked to 2px; focus moved to the soft ring.",
    },
    {
      version: "1.0.0",
      date: "2026-08-12",
      text: "Initial release — real inputs, eight-state matrix.",
    },
  ],
  extractionNotes: [
    'This entry replaces the draft stub LDS-028 (Text input) created only so that entry\'s own "use something else when" row ("The answer is yes or no — that is a Checkbox or a Switch") had somewhere real to point. `purpose` is now Checkbox\'s own opening sentence rather than a paraphrase from Text input\'s side.',
    'The Usage "use something else when" row naming Table ("It selects rows to act on rather than recording a value — that belongs to Table, where selection is Ice") is a fourth structured `useInstead` row targeting `table` — unlike text-input.ts\'s own compound rows, each of this entry\'s four rows names exactly one component, so none needed the "first-named target only" compromise that entry\'s own extractionNotes recorded. The Related section (08) itself stays at three cards (Radio, Switch, Select (Multi)) per the prototype\'s own "THREE" count — Table is a Usage-only pointer, not a Related card, so `relationships` does not include it, the same distinction between the two schema fields text-input.ts\'s own Related/useInstead split already established.',
    "Anatomy #1's \"18px square\" needed no snap: it lands exactly on the spacing ramp's own Space-18 step (docs/prd.md §8.3) with no deviation — the shipped component (packages/ui/src/checkbox/checkbox.tsx) uses `size-18` bare. Its \"1.5px border\" has no ramp step and no border-width utility between Tailwind's own 1px (`border`) and 2px (`border-2`) defaults; AGENTS.md rule 1 rules out inventing one or reaching for arbitrary-bracket syntax, so the shipped box uses plain `border` (1px) — the nearer of the two non-arbitrary steps, and the same weight every other bordered control in the system (text-input, chip, button) already uses. Flagged for the token decisions backlog as a missing border-width step, the same class of gap badge.ts's and card.ts's own unsnapped literals already raised.",
    "Anatomy #2's glyph has no literal size of its own in `cbAnatomy` — its 12×12px rendered size comes from the template's own tick SVG (archive/v1/Workspace Shell.dc.html:4480, `width=\"12\" height=\"12\" viewBox=\"0 0 24 24\"`), which lands exactly on Space-12. The indeterminate dash, by contrast, is a separate hand-drawn bar (`width:9px;height:2.2px`, line 4539/15575) sized nothing like the tick — 9 snaps to Space-8 (docs/prd.md §8.3's explicit \"9 → 8\") but 2.2 has no ramp step and sits below the floor (4) with nothing to snap to. Rather than ship two different glyph scales for the same slot (a tick drawn as a 12px/24-grid icon, a dash drawn as a bare below-floor-height span), the shipped component draws the dash as a second path on the tick's own 12px/24-grid/stroke-2 icon instead (`M6 12h12`) — one shared glyph scale, not a second unsnappable literal. Flagged for review as a deliberate deviation from the prototype's own markup, not an extraction error.",
    "Both glyphs render with `icon.strokeInline` (2) from `@lairy/tokens`, not the prototype's own literal `stroke-width:3.2` — the same substitution chip.ts's own dismiss glyph already made for its literal `stroke-width:3`, reusing the Icons foundation's inline stroke token instead of a second, uncatalogued weight. Neither glyph is added to `packages/ui/src/icons`'s Inline icon set itself: that set is governed by the Icons foundation content entry (stable, 1.1.0), which currently documents exactly five named icons, and a checkbox's tick/dash are box-internal marks, not a text-adjacent inline icon — the same \"local SVG, not a foundation addition\" call chip.ts's own extractionNotes already made for its own × glyph.",
    "Anatomy #3's \"14px --fg\" is Typography's own Body step verbatim (docs/prd.md §8.2: 14, IBM Plex Mono, 400, 1.6) — a clean 1:1 match, the same no-deviation reasoning text-input.ts's own anatomy #2 note already gives for the same size. Its \"12px from the box\" (the box-to-label gap) needed no snap either: 12 is already an exact ramp step.",
    'Anatomy #4\'s "9px/11px padded row" is the one pair of spacing literals needing a §8.3 snap: 9 → Space-8 (the ramp\'s own explicit "9 → 8") for the vertical padding, 11 → Space-12 (the ramp\'s own explicit "11 → 12") for the horizontal — both unambiguous, unlike most other components\' off-scale literals. The row is shipped as `py-8 px-12 -my-8 -mx-12`, so the padding that makes the row clickable does not also push the row\'s own visible content off the hit-row\'s now 32px-cleared box — the same negative-margin technique Chip\'s own dismiss-glyph hit-padding note already used for a different literal.',
    'The Content section\'s own closing rule 4 ("put a 12.5px --mute line beneath") describes the optional description line shipped as the `description` prop; 12.5 maps per docs/prd.md §8.2\'s own default table ("12.5 → Small") with no ambiguity.',
    'The Do/don\'t "Send weekly digest" pair\'s own description line is positioned in the prototype\'s own markup with a literal `padding-left:30px` (archive/v1/Workspace Shell.dc.html:4646) — exactly the box width (18) plus the box-to-label gap (12), so it lines up under the label rather than the box. The shipped component does not reproduce that literal: it nests `description` inside the label\'s own flex column (to the right of the box), so the same visual alignment falls out of the row\'s own flex layout with no separate offset to invent or snap. Flagged as a structural simplification, not a content change — the rendered result matches the prototype\'s own screenshot (reference/screenshots/components/checkbox--dark.png).',
    "States' own Disabled opacity (\"38% opacity\", `checkMatrix`'s own `op: .38`) ships as a bare `opacity-38` utility — Tailwind's opacity scale accepts any bare integer directly, the same non-arbitrary bare-numeric precedent button.tsx's own `opacity-35` and text-input.tsx's own `opacity-55` already set (not blocked by `tailwindcss/no-arbitrary-value`, which flags bracket syntax, not bare numerics).",
    "`checkMatrix`'s own DISABLED OFF row borders in `var(--border)`, one step heavier than every other Off-state row's own `var(--border-2)` (ON/INDETERMINATE/ERROR/DISABLED ON all keep their own resting-state border token unchanged when disabled). The shipped component does not carry that one-row exception: Off keeps `border-border-2` under `peer-disabled:opacity-38` the same way every other tone does, since the opacity overlay alone already carries the \"unavailable\" signal the token swap would have added on top of. Flagged for review as a deliberate simplification, the same class of one-row-matrix flattening button.ts's own states shape change already made.",
    "The Live demo's own hover wash (`HOVER_TINT = color-mix(in oklab, var(--accent), transparent 88%)`, archive/v1/Workspace Shell.dc.html:16580) is not reproduced: it belongs to that interactive demo's own markup, not to `cbTokens` — this entry's own Tokens section (07) documents exactly one hover change, the border going to `--fg` (\"Label, and the box border on hover\"), with no background token at all. The shipped component's hover state matches that documented surface exactly (`peer-hover:border-fg`, no background change) rather than inventing a token for an unrelated demo's own chrome.",
    "States' own Error row (`rgba(255,143,107,.7)` border) maps to `alarm-line` (`rgba(255, 143, 107, 0.4)`, packages/tokens/src/css/tokens.css) — same hue, the system's one non-themeable alarm border token, the same substitution text-input.ts's own Error state already made for its own bare `#ff8f6b` literal. The opacity differs (.7 in the prototype's own literal vs .4 in the token) because `--alarm-line` is a single fixed value with no per-component override — flagged for the token decisions backlog alongside text-input.ts's own instance of the same gap.",
    "Accessibility \"Groups announce\" (a shared `<fieldset>`/`<legend>` for a related set) is not something a single Checkbox renders — grouping several checkboxes under one accessible name is the consuming form's responsibility, the same scope line Radio's own eventual group semantics will need to draw. Not implemented here; flagged as a consumer concern, not a gap in this component.",
    "`indeterminate` is not a settable JSX/HTML attribute — the shipped component (packages/ui/src/checkbox/checkbox.tsx) sets it imperatively on the input's own DOM node via a ref, the standard React technique for this native-only property. `checked`/`defaultChecked`/`onChange` otherwise pass straight through to the real `<input type=\"checkbox\">` unchanged, keeping with this entry's own Accessibility \"Real inputs\" note; the component tracks its own checked value locally only when uncontrolled (no `checked` prop given), the same controlled/uncontrolled split text-input.tsx's own counter already uses for `value`/`defaultValue`.",
    'The whole row — box, label and `description` — is one `<label>` (Accessibility "The row is the target": "Clicking the label toggles the box"), but a `<label>`\'s own accessible name is every descendant text node, which would fold `description` into the checkbox\'s own announced name alongside the label. The shipped component sets `aria-labelledby` on the input to the label text\'s own id alone, overriding that default computation to just the label — the row\'s native click-to-toggle behaviour is unaffected, since that comes from the `<label for>` pairing, not from ARIA. Not a deviation text-input.ts\'s own entry needed: its hint/error sit beside the field, not inside a wrapping `<label>`.',
  ],
});
