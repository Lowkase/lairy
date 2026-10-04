import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/switch/examples";

/**
 * Switch, extracted from archive/v1/Workspace Shell.dc.html (template
 * 5093–5393, logic constants `swAnatomy` 16110 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on "Checkbox" and "Radio" in the opening boundary sentence
 * and the Usage "use something else" rows is dropped as markup, not content,
 * the same call checkbox.ts's and radio.ts's own entries already made for
 * the same kind of inline styling. This entry replaces the draft stub
 * created only so Button's (LDS-018), Checkbox's (LDS-030) and Radio's
 * (LDS-031) own `useInstead`/`relationships` rows targeting `switch` had a
 * non-draft entry to resolve to. See extractionNotes for that handoff and
 * every other place a literal needed a token snap or the prototype's
 * content didn't map cleanly onto this schema.
 */
export const switchComponent = ComponentEntrySchema.parse({
  meta: {
    id: "switch",
    name: "Switch",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-25",
  },
  purpose: "Turns one setting on or off, and the change takes effect the moment it moves.",
  description: {
    summary: "A switch turns one thing on or off, and the change takes effect the moment it moves.",
    boundary:
      "That instant commit is the entire difference from a Checkbox, which records an answer and waits for a submit. A switch has no submit to wait for, so it belongs in settings and toolbars rather than in forms, and it must never appear beside a Save button that implies it was holding its breath. It is also always one thing: two switches offered as alternatives are a Radio group in the wrong clothes.",
  },
  anatomy: [
    {
      number: "1",
      name: "Track",
      description:
        "A 40×22 pill with a 1px border — the one shape in the system allowed a 20px radius, because the rounded ends are what make it read as a thing that slides rather than a box that fills. Amber fill means on; --panel-2 means off.",
    },
    {
      number: "2",
      name: "Knob",
      description:
        "A 16px circle travelling 18px in 180ms. The movement is the feedback: it is the only control here that animates its own state change rather than fading between two paints.",
    },
    {
      number: "3",
      name: "Label",
      description:
        'A stative phrase naming what is true when the switch is on — "Auto-retry failed runs", never "Turn on auto-retry". Commands belong on buttons; a switch describes a condition.',
    },
    {
      number: "4",
      name: "Hit row",
      description:
        "The whole row is the target, so label, sub-line and track all toggle. It gives a 44px-tall hit area out of a 22px control and takes --panel-2 on hover across the full width.",
    },
    {
      number: "5",
      name: "Sub-line",
      description:
        "One optional 12px --mute line for the consequence, present only when the label cannot carry it: what happens when on, or what would unlock a disabled row. Never a restatement of the label.",
    },
  ],
  anatomyCaption:
    "Shown as a settings row, which is where a switch lives: label left, control right, the whole row pressable. Each part takes one edge and every position is measured from the artifact.",
  states: [
    {
      name: "Off",
      description:
        "The resting negative. The track is a filled --panel-2 rather than an empty outline, so off still reads as a deliberate position rather than a control that failed to load.",
    },
    {
      name: "On",
      description:
        'Amber track, knob at the right. Amber means act everywhere in the system, and this is the one place it also means "is acting" — the setting is live right now.',
    },
    {
      name: "Hover",
      description:
        "Pointer anywhere on the row. The border and knob lift together so it is clear the whole row is pressable, not just the pill.",
    },
    {
      name: "Focus",
      description:
        "Reached by keyboard. The ring sits around the track rather than the row, so the operator sees which control they are about to commit.",
    },
    {
      name: "Disabled off",
      description:
        "Cannot be turned on right now. The row dims as one piece and the sub-line says what would unlock it — never a tooltip alone.",
    },
    {
      name: "Disabled on",
      description:
        "On and locked, usually by policy. The amber drains out so nothing dimmed ever reads as active, but the knob stays right so the state is still legible.",
    },
  ],
  statesNote:
    "There is no indeterminate switch and no loading switch. If the change takes long enough to need a spinner, the control is a Button and the outcome belongs in a snackbar — a switch that moves and then moves back is worse than one that never moved.",
  usage: {
    useWhen: [
      "One setting has two states and the change applies immediately.",
      "The effect is reversible with the same gesture that caused it.",
      "The row lives in settings, a toolbar, or a panel — somewhere with no submit.",
      "Both states are legitimate resting places, not a task to be completed.",
    ],
    useInstead: [
      {
        target: "checkbox",
        text: "The answer is submitted with a form — that is a Checkbox.",
      },
      {
        target: "radio",
        text: "There are more than two states, or two named alternatives — that is a Radio group.",
      },
      {
        target: "button",
        text: "The action runs once and finishes — that is a Button.",
      },
      {
        target: "badge",
        text: "The state is assigned by the system and only reported — that is a Badge.",
      },
    ],
  },
  contentRules: [
    {
      text: 'Write the label as the state, not the action: "Auto-retry failed runs". If it reads like a button, it will be treated like one.',
    },
    {
      text: "Never label the two ends of the track. The knob position and the amber fill carry on and off; ON/OFF text next to them is a second, competing answer.",
    },
    {
      text: "Keep the label under about six words and put the consequence in the sub-line, so a column of switches stays scannable as a list of settings.",
    },
    {
      text: 'Say what a locked switch needs in the sub-line — "Needs an admin on the workspace" — rather than leaving the operator to hover for a reason.',
    },
    {
      text: "Confirm nothing on toggle. If the change deserves feedback beyond the knob moving, that is a snackbar, and if it deserves a confirm dialog it is not a switch.",
    },
  ],
  propGuidance: [
    {
      prop: "label",
      note: 'A stative phrase naming what is true when on, not the action (anatomy #3, Content rule 1) — "Auto-retry failed runs", never "Turn on auto-retry".',
    },
    {
      prop: "description",
      note: "The optional --mute sub-line for the consequence (anatomy #5, Content rule 3) — present only when the label cannot carry it, and what a locked row says to explain itself (Content rule 4).",
    },
  ],
  examples: [
    {
      id: "auto-retry-failed-runs",
      kind: "demo",
      title: "Auto-retry failed runs",
      source: `${EXAMPLES_DIR}/auto-retry-failed-runs.tsx`,
    },
    {
      id: "good-stative-label",
      kind: "good",
      title: "A stative label with its consequence",
      caption: "A stative label naming what is on, and one --mute line for the consequence.",
      source: `${EXAMPLES_DIR}/good-stative-label.tsx`,
    },
    {
      id: "bad-command-with-on-off-flanks",
      kind: "bad",
      title: "A command label flanked by ON/OFF",
      caption: "Never write the label as a command, and never flank the track with ON/OFF — the knob says which it is.",
      source: `${EXAMPLES_DIR}/bad-command-with-on-off-flanks.tsx`,
    },
    {
      id: "good-stacked-settings",
      kind: "good",
      title: "Independent settings stacked",
      caption: "Independent settings stack as rows with the tracks aligned on one right-hand column.",
      source: `${EXAMPLES_DIR}/good-stacked-settings.tsx`,
    },
    {
      id: "bad-two-switches-as-alternatives",
      kind: "bad",
      title: "Two switches as alternatives",
      caption: "Never use two switches as alternatives — naming two options one-of is a radio group's job.",
      source: `${EXAMPLES_DIR}/bad-two-switches-as-alternatives.tsx`,
    },
    {
      id: "good-locked-explains",
      kind: "good",
      title: "A locked switch explains itself",
      caption: "A locked switch keeps its label and says, in the sub-line, what would unlock it.",
      source: `${EXAMPLES_DIR}/good-locked-explains.tsx`,
    },
    {
      id: "bad-behind-save",
      kind: "bad",
      title: "A switch behind a Save button",
      caption: "Never put a switch behind a Save — it already committed, and the button makes the operator doubt it.",
      source: `${EXAMPLES_DIR}/bad-behind-save.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Role and state",
      body: 'The control is role="switch" with aria-checked, labelled by the visible label and described by the sub-line. Role switch rather than checkbox is what tells a screen reader the change has already happened.',
    },
    {
      title: "Space toggles",
      body: "The row is one tab stop and Space toggles it; Enter does nothing, since the row is not a button. The whole row being the hit target means pointer and keyboard land on the same thing.",
    },
    {
      title: "Colour is never alone",
      body: "On is the knob at the right as well as the amber track, and amber on --panel measures 6.6:1. Anyone who cannot see the fill still reads the position, which is why the knob travels the full 18px.",
    },
    {
      title: "No motion, no problem",
      body: "Under prefers-reduced-motion the knob jumps rather than slides. The state is carried by position, so removing the transition costs nothing at all.",
    },
  ],
  tokens: [
    { tokens: ["accent"], usage: "Track fill when on" },
    { tokens: ["accent-line"], usage: "Track border when on" },
    { tokens: ["panel-2"], usage: "Track fill when off, row hover" },
    { tokens: ["border-2"], usage: "Track border when off" },
    { tokens: ["dim"], usage: "Knob when off" },
    { tokens: ["bg"], usage: "Knob when on" },
  ],
  relationships: [
    {
      target: "checkbox",
      kind: "alternative",
      text: "Use instead inside a form. The square records an answer and waits for the submit; the pill has already changed the system.",
    },
    {
      target: "radio",
      kind: "alternative",
      text: 'Use instead when two named alternatives are being compared. A switch has no vocabulary for its off state beyond "not on".',
    },
    {
      target: "button",
      kind: "alternative",
      text: "Use instead when the thing runs once and finishes. A switch describes a standing condition, never an errand.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-25",
      text: "Hit row extended across label and sub-line; loading and indeterminate switches ruled out.",
    },
    {
      version: "1.0.1",
      date: "2026-08-19",
      text: "Disabled-on drains the amber to --border-2 so nothing dimmed reads as active.",
    },
    {
      version: "1.0.0",
      date: "2026-08-12",
      text: "Switch introduced at 40×22 with a 16px knob and a 180ms travel.",
    },
  ],
  extractionNotes: [
    'This entry replaces the draft stub created only so that Button\'s (LDS-018), Checkbox\'s (LDS-030) and Radio\'s (LDS-031) own `useInstead`/`relationships` rows targeting `switch` had a non-draft entry to resolve to. `purpose` is now Switch\'s own opening sentence (restructured, dropping the leading "A switch" the way checkbox.ts\'s and radio.ts\'s own extractionNotes already did for their own purpose fields) rather than the paraphrase the stub carried.',
    "`meta.version` (1.1.0) and `meta.updated` (2026-08-25) carry over the prototype's own latest `swLog` entry directly, per docs/build-guide.md §4 step 10's default (\"carry over the prototype's\") — the same convention checkbox.ts's (1.2.0/2026-08-20, matching its own cbLog) and radio.ts's (1.1.0/2026-08-24, matching its own rdLog) entries already follow, rather than starting a fresh 1.0.0 for this ticket's own release.",
    "Anatomy #1's \"40×22\" track has no clean Spacing-ramp step for 40 (ramp: 4, 6, 8, 12, 16, 18, 22, 32, 44; docs/prd.md §8.3's own default snaps don't cover 40 either) — shipped at `w-44` (the nearer step, |44−40|=4 vs |40−32|=8), the same call radio.ts's own `good-switch-instead.tsx` illustration already made for the same literal. Anatomy #1's \"1px border\" and anatomy #2's \"16px\" knob both land exactly on the ramp with no snap needed.",
    "Anatomy #2's \"16px circle travelling 18px\" is shipped as `translate-x-18` on the knob, peer-checked/off — 18 is already an exact Spacing-ramp step, so unlike most literals in this system the travel distance needed no snap at all, only the geometry that produces it (below). The prototype's own top/left insets (`top:2px`/`left:2px` in `swStates`/`swAnatomy`) are below the Spacing floor (4) with nothing to snap to, the same gap radio.ts's own `good-switch-instead.tsx` note already flagged for the same component (\"the knob inset by the track's own border rather than a bare 2px padding literal\"). The shipped track uses `border px-4` (a real 1px border plus Space-4 padding, both tokens) rather than a bare 2px inset: with the knob at `size-16` inside a `w-44` track, that geometry produces an exact 18px of travel (44 − 2×1 border − 2×4 padding − 16 knob = 18) — matching the prototype's own literal travel distance exactly, even though the resting inset (5px: 1 border + 4 padding) is wider than the prototype's own 2px. Flagged for review as a deliberate trade: an exact match on the one dimension the anatomy prose actually measures (the 18px travel) over an exact match on an unmeasured, below-floor inset.",
    "Anatomy #3's \"stative phrase\" and anatomy #5's \"12px --mute\" sub-line map directly: the label is `text-body text-fg` (14px, Typography's own Body step, the same mapping checkbox.ts's and radio.ts's own label anatomy notes already make), and `description` is `text-small text-mute` (13px, Small) rather than a literal 12 — `text-small` is this system's existing step nearest 12 with no dedicated 12px type style of its own (docs/prd.md §8.2's table has Label at 12 but that's an uppercase/tracked style, not a sentence-case sub-line), the same substitution checkbox.ts's and radio.ts's own `description` fields already use for their own sub-12.5/13px literals.",
    "Anatomy #4's \"44px-tall hit area\" is shipped as `min-h-44` directly (Space-44, an exact ramp match with no padding arithmetic needed to reach it) rather than deriving the height from vertical padding the way checkbox.ts's and radio.ts's own hit rows do — the prototype gives no explicit vertical-padding literal for this row (unlike checkbox's \"9px/11px\" and radio's \"9px by 11px\"), so there is nothing to snap on that axis. The row's horizontal inset reuses the already-established `px-12 -mx-12` snap (Space-12, docs/prd.md §8.3's own \"11 → 12\") checkbox.ts's and radio.ts's own hit rows already made for the same horizontal rhythm, since this row has no horizontal literal of its own to extract either.",
    "States' own Hover row (`border:var(--fg)`, `background:color-mix(in oklab, var(--panel-2), var(--fg) 10%)`) is not reproduced on the track: this entry's own Tokens section (07) documents exactly six rows, none of them `--fg` and none of them a `color-mix` background — the same gap between a state's own demo-matrix styling and the documented Tokens section checkbox.ts's own extractionNotes already resolved in the documented section's favour (\"The shipped component's hover state matches that documented surface exactly ... rather than inventing a token for an unrelated demo's own chrome\"). The shipped row instead takes `hover:bg-panel-2` on the row itself, matching `swTokens`' own \"--panel-2: Track fill when off, row hover\" literally, with no border-colour change on hover at all.",
    "States' own \"Disabled off\" row borders in `var(--border)`, one step heavier than the resting \"Off\" row's own `var(--border-2)` — the same one-row anomaly checkbox.ts's own extractionNotes already found in `checkMatrix`'s DISABLED OFF row and chose not to carry (\"the opacity overlay alone already carries the 'unavailable' signal the token swap would have added on top of\"). Not reproduced here either, for the same reason and with the same simplification: disabled-off keeps `border-border-2` under `peer-disabled:opacity-38`.",
    "States' own \"Disabled on\" row, by contrast, is carried faithfully: its colour swap (amber track/knob draining to `--border-2`/`--panel`) is called out in its own prose (\"The amber drains out so nothing dimmed ever reads as active\") and has its own dedicated changelog entry (`swLog`'s 1.0.1, \"Disabled-on drains the amber to --border-2\"), unlike disabled-off's heavier border, which is asserted once in the matrix and never explained or revisited. The shipped component models this as its own `tone` (`disabled-on`, distinct from `on`), still composed with the same `peer-disabled:opacity-38` overlay every other disabled control in the system uses, exactly matching `swStates`' own `op: .38` on that row.",
    "Accessibility's own `role=\"switch\"` is applied to a real `<input type=\"checkbox\">` rather than a custom ARIA widget — the explicit `role` attribute overrides the input's own implicit checkbox role (a standard, broadly supported override; WAI-ARIA's switch pattern lists checkbox as an allowed host-role substitution) while keeping every native behaviour checkbox.ts's own \"Real inputs\" note already relies on: a real tab stop, Space to toggle, and the browser's own `checked` state exposed as the control's accessible state under the new role, with no manual `aria-checked` to keep in sync. The same \"build fresh from tokens, read the prototype only for appearance and behaviour\" call checkbox.ts's and radio.ts's own entries already made for their own real inputs, rather than radio.ts's own noted alternative (the prototype's fully custom `role=\"switch\"` `<div onClick>` widget with a hand-rolled `tabIndex`).",
    "There is no `error` prop or error state: `swStates` lists exactly six states (off, on, hover, focus, disabled off, disabled on) with no error row, unlike Checkbox's and Radio's own eight/four-state matrices — a switch is never submitted, so there is nothing for a required-field error to attach to, consistent with this entry's own `statesNote` and Usage \"use something else when\" row pointing a submitted, validated answer back to Checkbox.",
    "The Usage \"use something else when\" row naming Button (\"The action runs once and finishes — that is a Button\") and Badge (\"The state is assigned by the system and only reported — that is a Badge\") are two structured `useInstead` rows targeting `button` and `badge` — the Related section (08) itself stays at three cards (Checkbox, Radio, Buttons) per the prototype's own \"THREE\" count, so `relationships` does not include a fourth `badge` entry, the same Usage-only/Related split checkbox.ts's and radio.ts's own extractionNotes already drew for their own fourth useInstead rows (Table, Chips respectively).",
    "The Live block's own `switchMatrix` (a six-row OFF/ON/HOVER/FOCUS/DISABLED-OFF/DISABLED-ON legend reproducing the same states as prose, with its own demo-only `dsToggleSwitch` interactive track) is that interactive demo's own markup, not `swStates` itself — the same call checkbox.ts's own entry already made for `checkMatrix` and radio.ts's own entry already made for `radioMatrix`. This entry's six-row `states` field comes from the template's own States section (02) prose instead.",
    "Do/don't pair 2's own \"bad\" side (two switches captioned \"Fastest\"/\"Safest\" with only one on) is buildable with two real `<Switch>` instances and needed no mock, unlike several of Checkbox's and Radio's own bad examples — the violation here is a layout/usage mistake (two switches standing in for a radio group), not a prop the real component refuses to expose. Pair 1's \"bad\" side (a command label flanked by literal ON/OFF text) has no equivalent in this component's own props — the component never renders flanking text — so `bad-command-with-on-off-flanks.tsx` is a static, token-built mock illustrating the violation, the same class of static illustration checkbox.ts's and radio.ts's own entries already use for a prop-less violation (radio.ts's `bad-wrapped-grid.tsx`).",
    "Do/don't pair 3's own \"bad\" side (a switch followed by a SAVE chip) is built with the real `<Switch>` plus a plain token-styled span standing in for the button glyph, rather than importing the real `Button` component (LDS-018) — the prototype's own sketch renders the SAVE affordance as a small amber-outlined label, not a full button, and pulling in a second component's own API surface for one illustrative glyph would couple this entry's examples to Button's own prop shape for no benefit the caption needs.",
  ],
});
