import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/radio/examples";

/**
 * Radio, extracted from archive/v1/Workspace Shell.dc.html (template
 * 4748–5092, logic constants `rdAnatomy` 15969 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on "Checkbox", "Select", "Switch" and "Chips" in the
 * opening boundary sentence and the Usage "use something else" rows is
 * dropped as markup, not content, the same call checkbox.ts's own entry
 * already made for the same kind of inline styling. This entry replaces the
 * draft stub created for Text input's (LDS-028) own "use something else
 * when" row — see extractionNotes for that handoff and every other place a
 * literal needed a token snap or the prototype's content didn't map cleanly
 * onto this schema.
 */
export const radio = ComponentEntrySchema.parse({
  meta: {
    id: "radio",
    name: "Radio",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-24",
  },
  purpose: "A set of mutually exclusive options, all visible at once, exactly one of them chosen.",
  description: {
    summary:
      "A radio group is a set of mutually exclusive options, all visible at once, exactly one of them chosen.",
    boundary:
      "It exists so the operator can compare the alternatives before committing, which is why it costs vertical space and why it stops being the right control past about five options. The line against Checkbox is arithmetic: checkboxes are independent and can all be off, radios are one-of and can never be none. If “none” is a legitimate answer, it has to be an option in the list rather than an empty group.",
  },
  anatomy: [
    {
      number: "1",
      name: "Group",
      description:
        "The set itself, and the real unit of the component — a radio never exists alone. Options stack one per line with 2px between rows, so the eye reads a list rather than a layout.",
    },
    {
      number: "2",
      name: "Dial",
      description:
        "An 18px circle with a 1.5px border, fixed at every density. Round is reserved: with dots and avatars, this is one of the only circles in a system that is otherwise square, and the shape is what says one-of.",
    },
    {
      number: "3",
      name: "Dot",
      description:
        'A 9px --accent disc fading in over 160ms, centred in the dial. It fills rather than ticks, because a tick is the checkbox’s word for "yes" and this control answers "which".',
    },
    {
      number: "4",
      name: "Label",
      description:
        "14px Body in --fg, sentence case, and part of the target. It is the option itself — never a description of the dial — and it may carry one --mute line underneath when the trade-off needs stating.",
    },
    {
      number: "5",
      name: "Hit row",
      description:
        "Dial and label share one row padded 9px by 11px, so the whole line is clickable and clears the minimum target in dense chrome. Hover fills the row with --panel-2, never just the dial.",
    },
  ],
  anatomyCaption:
    "Each part takes one edge of the frame, and every leader is a single straight line landing square on the target. Positions are measured from the artifact, so the diagram stays true at any size.",
  states: [
    {
      name: "Off",
      description:
        "Not chosen. The dial is empty rather than dimmed, because a faint dot would read as a weak choice instead of no choice.",
    },
    {
      name: "On",
      description:
        "The chosen option: amber ring, amber 9px dot fading in over 160ms. Exactly one row in the group is ever in this state.",
    },
    {
      name: "Error",
      description:
        "A required group submitted with nothing chosen. Every dial in the group takes the border, since the fault belongs to the question and not to one option.",
    },
    {
      name: "Disabled",
      description:
        "An option that cannot be chosen right now. It keeps its dot if it was the selection, and something next to the group has to say why it is locked.",
    },
  ],
  statesNote:
    "There is no indeterminate radio and no way to clear a group by clicking the selected option again. Both would mean a group with nothing chosen, which is the one state a radio set is not allowed to be in — add an explicit option instead.",
  usage: {
    useWhen: [
      "Two to five options, exactly one of which will be true.",
      "The options need comparing before choosing — seeing them all is the point.",
      "The choice is part of a form and commits with everything else.",
      "The wording of each option matters more than the space it costs.",
    ],
    useInstead: [
      {
        target: "select",
        text: "Six or more options, or a list that grows — that is Select.",
      },
      {
        target: "checkbox",
        text: "Several can be true at once — that is Checkbox.",
      },
      {
        target: "switch",
        text: "It is one setting on or off, committing instantly — that is a Switch.",
      },
      {
        target: "chip",
        text: "The choice filters a list rather than setting a value — those are Chips.",
      },
    ],
  },
  contentRules: [
    {
      text: 'Options are sentence case and grammatically parallel: "Every run", "Failures only", "Never" — never a mix of nouns and clauses.',
    },
    {
      text: 'Name the outcome, not the mechanism: "Failures only" rather than "Filter where status equals failed".',
    },
    {
      text: "Keep options roughly the same length. One option twice as long as the others reads as the recommended one whether you meant it or not.",
    },
    {
      text: 'Add at most one --mute line under an option, and only where the trade-off is not obvious from the label — "Skips validation".',
    },
    {
      text: 'The group needs a question above it in --dim: "Notify me about" — short, no colon, and never repeated inside the options.',
    },
  ],
  propGuidance: [
    {
      prop: "label",
      note: 'The question above the group, in --dim (Content rule 5) — short, no colon, never repeated inside the options.',
    },
    {
      prop: "options",
      note: 'Each option’s own label is the option itself, never a description of the dial (anatomy #4); `description` is the optional --mute trade-off line under it (Content rule 4, anatomy #4).',
    },
    {
      prop: "error",
      note: "A required group submitted with nothing chosen (States \"Error\"). Every dial in the group takes the border, since the fault belongs to the question and not to one option.",
    },
  ],
  examples: [
    {
      id: "ingest-or-normalize",
      kind: "demo",
      title: "Ingest or normalize",
      source: `${EXAMPLES_DIR}/ingest-or-normalize.tsx`,
    },
    {
      id: "good-default-selected",
      kind: "good",
      title: "A default already chosen",
      caption: '“Never” written as an option, stacked one per line, with one already chosen.',
      source: `${EXAMPLES_DIR}/good-default-selected.tsx`,
    },
    {
      id: "bad-empty-group",
      kind: "bad",
      title: "A group with nothing chosen",
      caption: "Never leave a group empty — the operator cannot tell a missing default from a broken form.",
      source: `${EXAMPLES_DIR}/bad-empty-group.tsx`,
    },
    {
      id: "good-switch-instead",
      kind: "good",
      title: "One setting, two states is a Switch",
      caption: "One setting with two states is a switch, and commits the moment it is flipped.",
      source: `${EXAMPLES_DIR}/good-switch-instead.tsx`,
    },
    {
      id: "bad-on-off-pair",
      kind: "bad",
      title: "Two rows saying on and off",
      caption: "Never spend two rows saying on and off — that is a switch wearing a radio group.",
      source: `${EXAMPLES_DIR}/bad-on-off-pair.tsx`,
    },
    {
      id: "good-clarifying-line",
      kind: "good",
      title: "A clarifying line per option",
      caption: "One clarifying line per option, in --mute, when the trade-off is not obvious.",
      source: `${EXAMPLES_DIR}/good-clarifying-line.tsx`,
    },
    {
      id: "bad-wrapped-grid",
      kind: "bad",
      title: "A group wrapped into a grid",
      caption: "Never wrap a group into a grid — the reading order stops being obvious and so does the set.",
      source: `${EXAMPLES_DIR}/bad-wrapped-grid.tsx`,
    },
  ],
  accessibility: [
    {
      title: "One tab stop",
      body: 'The group is a role="radiogroup" labelled by its question, and the whole set is a single tab stop — Tab enters at the chosen option and Tab again leaves the group entirely.',
    },
    {
      title: "Arrows choose",
      body: "Arrow keys move between options and select as they move, which is the expected behaviour and the reason radios must not have side effects. Space selects the focused option where nothing is chosen yet.",
    },
    {
      title: "Colour is never alone",
      body: "Selection is the filled dot as well as the amber ring, and it is carried in aria-checked. Amber on --panel measures 6.6:1, but the dot is what reads for anyone who cannot separate the hues.",
    },
    {
      title: "Locked options explain",
      body: "A disabled option keeps its label readable and is described by the same text that says why it is locked, so the reason is announced with the option rather than sitting somewhere else on screen.",
    },
  ],
  tokens: [
    { tokens: ["border-2"], usage: "Dial at rest" },
    { tokens: ["accent"], usage: "Chosen ring and dot" },
    { tokens: ["fg"], usage: "Option labels" },
    { tokens: ["mute"], usage: "Clarifying line under an option" },
    { tokens: ["panel-2"], usage: "Row hover fill" },
    { tokens: ["alarm-line"], usage: "Error border" },
  ],
  relationships: [
    {
      target: "checkbox",
      kind: "alternative",
      text: "Checkboxes are independent and can all be off. If the answers are not mutually exclusive, the square is the right shape.",
    },
    {
      target: "select",
      kind: "alternative",
      text: "Past five options the list should collapse into a field. Select trades comparing the options for getting the space back.",
    },
    {
      target: "switch",
      kind: "alternative",
      text: "A switch is one setting with two states, committing instantly. Two radios saying on and off is always a switch in disguise.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-24",
      text: "Clearing a group by re-clicking ruled out; error state moved to every dial in the group rather than one.",
    },
    {
      version: "1.0.1",
      date: "2026-08-20",
      text: "Hit row extended to the label with a --panel-2 hover fill across the whole line.",
    },
    {
      version: "1.0.0",
      date: "2026-08-12",
      text: "Radio introduced at an 18px dial with a 9px dot and a 160ms fade.",
    },
  ],
  extractionNotes: [
    'This entry replaces the draft stub LDS-028 (Text input) created only so that entry\'s own "use something else when" row ("The answers are a known list — that is a Select or a Radio group") had somewhere real to point, and so checkbox.ts\'s own `useInstead`/`relationships` rows targeting `radio` had a non-draft entry to resolve to. `purpose` is now Radio\'s own opening sentence (restructured, dropping the leading "A radio group is" the way checkbox.ts\'s own extractionNotes already did for its own purpose field) rather than a paraphrase from Text input\'s or Checkbox\'s side.',
    "The Usage \"use something else when\" row naming Chips (\"The choice filters a list rather than setting a value — those are Chips\") is a fourth structured `useInstead` row targeting `chip` — the Related section (08) itself stays at three cards (Checkbox, Select, Switch) per the prototype's own \"THREE\" count, so `relationships` does not include a fourth `chip` entry, the same Usage-only/Related split checkbox.ts's own extractionNotes already drew for Table.",
    "Anatomy #2's \"1.5px border\" has no border-width utility between Tailwind's 1px (`border`) and 2px (`border-2`) defaults and AGENTS.md rule 1 rules out inventing one — the shipped component (packages/ui/src/radio/radio.tsx) uses plain `border` (1px), the same resolution checkbox.ts's own extractionNotes already recorded for its own 1.5px box border, and the same weight every other bordered control in the system uses.",
    "Anatomy #2's and #3's circular dial and dot (`border-radius:50%` in the prototype, shipped as `rounded-full`) read against AGENTS.md rule 5 (\"Circles only for marks with no layout\") and docs/prd.md §8.4 (\"Full circle only for marks that hold no layout\") at first glance, since the dial is the component's own interactive hit target, not a decorative mark. The anatomy #2 prose itself resolves this: Radio is named, verbatim, as one of the system's own designated circle exceptions (\"Round is reserved: with dots and avatars, this is one of the only circles in a system that is otherwise square, and the shape is what says one-of\") — the same class of exception the anatomy-diagram's own numbered badge and the Loading spinner (`rounded-full`, packages/ui/src/loading/loading.tsx) already use for an atomic indicator mark rather than a container. Not a rule violation; flagged for Cory in case the rule's wording should name Radio's dial explicitly.",
    "Anatomy #3's dot fade (\"fading in over 160ms\") and the matching States \"On\" row's own \"fading in over 160ms\" don't match any of the four named duration tokens (instant 140ms, control 180ms, panel 260ms, reveal 500ms, packages/tokens/src/css/tokens.css) — closest is --duration-instant at 140ms, but 160 isn't that value either. Shipped as the literal `duration-160` utility (Tailwind v4's bare-numeric arbitrary support, not bracket syntax) rather than snapping to a token that isn't actually the same value, the same way progress.ts's own extractionNotes already made this call for its own 300ms fill transition. Also flagged for the token decisions backlog. The prototype's own `rdTokens` has a sixth row (\"opacity · 160ms\", \"Dot fade in and out\") not carried into this entry's `tokens` field for the same reason: `TokenUsageSchema.tokens` is a `ColorTokenNameSchema` array, closed to colour tokens only — the same scope limit checkbox.ts's, loading.ts's and progress.ts's own extractionNotes already flagged for their own motion rows.",
    "Anatomy #5's \"9px by 11px\" padded row snaps the same way checkbox.ts's own hit row did: 9 → Space-8, 11 → Space-12 (docs/prd.md §8.3's own explicit snaps), shipped as `py-8 px-12 -mx-12` — only a horizontal negative margin is needed here (unlike checkbox's own `-my-8 -mx-12`), since the row's own vertical padding doesn't need to be cancelled against a surrounding static layout the way checkbox's box-plus-label row did.",
    "The Live demo row's own dial-to-label `gap:10px` (archive/v1/Workspace Shell.dc.html:4857/4870's own row markup; not itself one of `rdAnatomy`'s numbered parts) has no exact Spacing-ramp step (docs/prd.md §8.3's own default snap: \"10 → 8 or 12\"). Shipped as `gap-12`, chosen over 8 to match checkbox.tsx's own box-to-label gap (also 12, its own anatomy #3 \"12px from the box\") so the two sibling controls share one hand-to-label rhythm — the choice noted per §8.3's own instruction.",
    "Anatomy #1's own \"2px between rows\" sits below the Spacing ramp's floor (4, 6, 8, 12, 16, 18, 22, 32, 44) with nothing to snap to. Floored to Space-4 (`gap-4` on the group's own column), the same below-floor-to-floor move chip.ts's own dismiss-glyph hit-padding note and badge.ts's own sub-ramp vertical padding already made.",
    "The template's own embedded `rdRules` grid (four {t,b} cards — \"Always one chosen\", \"Two to five\", \"Stacked, never wrapped\", \"Commits with the form\" — sitting inside the Live interactive block, not inside any numbered page section) restates facts already captured elsewhere rather than carrying anything net-new: \"Two to five\" and \"Commits with the form\" duplicate `usage.useWhen` rows 1 and 3; \"Always one chosen\" duplicates `statesNote`; \"Stacked, never wrapped\" duplicates the `bad-wrapped-grid` example's own caption. Not re-extracted into any schema field — `contentRules` is scoped to wording-of-content rules (checkbox.ts's own five rows are all about label wording), not behavioural/layout rules, and none of `rdRules`'s own four items is new information. Flagged as a dropped duplicate section, not a gap.",
    "The Live block's own `dsRadioOpts` (an interactive Auto/Manual toggle) and `radioMatrix` (a seven-row OFF/ON/HOVER/FOCUS/ERROR/DISABLED-OFF/DISABLED-ON legend, including the demo's own `HOVER_TINT` background and `FOCUS_RING` box-shadow constants) are that interactive demo's own markup, not `rdTokens` or `states` — the same call checkbox.ts's own extractionNotes already made for `checkMatrix`/`HOVER_TINT`. This entry's four-row `states` field comes from the template's own States section (02) prose instead, which is where checkbox.ts's five states also came from (not its own seven-row `checkMatrix`).",
    "Do/don't pair 2's own \"good\" side (archive/v1/Workspace Shell.dc.html:221–232) renders a hand-drawn switch sketch, not a Radio at all — illustrating that two radios saying on/off should be one Switch instead. Switch has no shipped component yet (its own future ticket), so `good-switch-instead.tsx` reproduces that one sketch inline, from tokens, purely as an illustration for this contrast pair — commented in the file as not a Switch implementation. The sketch's own literal `40px` track width has no clean Spacing-ramp step (ramp: 4, 6, 8, 12, 16, 18, 22, 32, 44); shipped at `w-44` (the nearer step) with the knob inset by the track's own border rather than a bare 2px padding literal that the ramp has no step for either.",
    "Do/don't pair 3's own \"bad\" side (wrapping four options into a grid) is not rendered with `<Radio>` at all: the component always stacks its own options in a single column (anatomy #1, Content rule \"Stacked, never wrapped\") with no layout prop that would defeat that, by design, so there is no supported way to make the real component do the wrong thing. `bad-wrapped-grid.tsx` is a static token-built mock of four option rows in a wrapping flex row instead — illustrating the mistake, not a second layout mode the shipped component actually offers.",
    "The group's own question line (Content rule 5, \"Notify me about\") is the `label` prop; no example sets it, since none of the prototype's own Do/don't sketches or the Live demo's own toggle show one above the options — flagged in case Cory wants one added for the Props/demo coverage.",
    "Accessibility's own native-input approach (role=\"radio\"/\"radiogroup\" from real `<input type=\"radio\">` elements sharing one `name`, per Accessibility \"One tab stop\" and \"Arrows choose\") is not a port of the prototype's own Live demo, which is a fully custom ARIA widget (`role=\"radio\"` on a `<div onClick>`, with its own manual `tabIndex`) — real native radio inputs already implement both documented behaviours (single tab stop, arrow-key move-and-select) for free, the same \"build fresh from tokens, read the prototype only for appearance and behaviour\" call checkbox.ts's own entry made for its own real `<input type=\"checkbox\">`.",
  ],
});
