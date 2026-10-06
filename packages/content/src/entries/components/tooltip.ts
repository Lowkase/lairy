import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/tooltip/examples";

/**
 * Tooltip, extracted from archive/v1/Workspace Shell.dc.html (template
 * 8809–9099, logic `tipAnatomy`/`tipRules`/`tipContent`/`tipA11y`/
 * `tipTokens`/`tipRelatedGo`/`tipLog` 16240–16281) per docs/build-guide.md
 * §3. Prose is verbatim (ADR-0009); inline `<span>` colour styling on
 * "Popover" and "Toast" in the opening boundary sentence and the Usage
 * cards is dropped as markup, not content. See extractionNotes for every
 * place structured metadata was added or a value was restructured rather
 * than lifted directly.
 */
export const tooltip = ComponentEntrySchema.parse({
  meta: {
    id: "tooltip",
    name: "Tooltip",
    section: "components",
    status: "stable",
    version: "1.2.0",
    updated: "2026-09-19",
  },
  purpose: "Names the thing under the pointer, in one line, and holds nothing the operator has to reach.",
  description: {
    summary:
      "A tooltip names the thing under the pointer, in one line, and holds nothing the operator has to reach.",
    boundary:
      "It exists so an icon can stay an icon. Because it appears on hover and takes no pointer events, everything inside it is unreachable by definition — no links, no buttons, no selectable text. That is the whole line against Popover: the moment content has to be clicked, the trigger has to be clicked too. And a tooltip never carries information that exists nowhere else, because a pointer is one of several ways to use this shell.",
  },
  anatomy: [
    {
      number: "1",
      name: "Bubble",
      description:
        "A --bg box with an --accent-line hairline and a soft drop shadow, fading in over 160ms. Amber on the border rather than a fill: the bubble belongs to the control the operator is already pointing at, and it is gone the moment they are not.",
    },
    {
      number: "2",
      name: "Label",
      description:
        "One line of 12px --fg with white-space:nowrap — the bubble is as wide as the sentence and never wraps. If the text cannot survive that constraint, it is not tooltip content.",
    },
    {
      number: "3",
      name: "Offset",
      description:
        "9px between trigger and bubble. Enough that the bubble reads as a separate surface, close enough that the pairing is unambiguous, and small enough that the pointer never crosses it — there is nothing to cross to.",
    },
    {
      number: "4",
      name: "Trigger",
      description:
        "The control being named, usually an icon-only button. It owns the hover, keeps its own focus ring, and the tooltip never covers it — the bubble flips sides rather than sitting on top of what it describes.",
    },
  ],
  anatomyCaption:
    "Shown open above its trigger, which is the default side. Each part takes one edge and every position is measured from the artifact.",
  states: [
    {
      name: "Top by default",
      description:
        "Every tooltip opens above its trigger, centred. One default side means a row of icons produces a predictable line of bubbles rather than a scatter.",
    },
    {
      name: "Flips when clipped",
      description:
        "Against the top of the viewport it goes below; against a side it goes left or right. It flips rather than shifts, so the 9px relationship to the trigger is never stretched.",
    },
    {
      name: "Never covers the trigger",
      description:
        "The bubble is not allowed to sit over the control it names. An operator checking what something is should not lose sight of the thing itself.",
    },
    {
      name: "No pointer events",
      description:
        "The bubble cannot be hovered, clicked or selected, which is what makes it safe to appear under the cursor — and what makes any interactive content inside it a bug.",
    },
    {
      name: "Delay in, none out",
      description:
        "A 400ms wait before showing, so crossing a toolbar does not flash five bubbles; instant hide on leave, so nothing lingers over work.",
    },
    {
      name: "One at a time",
      description:
        "Only one tooltip exists at once, and moving between triggers inside 400ms swaps its content rather than re-running the delay.",
    },
  ],
  statesNote:
    "There is no arrow, no title row, and no rich variant. The 9px offset and the amber hairline are enough to tie the bubble to its trigger, and anything that needed a heading was never one line long.",
  usage: {
    useWhen: [
      "An icon-only control needs its name spelled out.",
      "A truncated cell needs its full value on demand.",
      "A keyboard shortcut is worth showing next to the control it fires.",
      "The information is a convenience — the operator can work without ever seeing it.",
    ],
    useInstead: [
      {
        target: "popover",
        text: "Anything inside has to be clicked — that is a Popover.",
      },
      {
        target: "text-input",
        text: "The text explains a field's constraint — that is the field's own hint line.",
      },
      {
        target: "toast",
        text: "It reports something that just happened — that is a Toast.",
      },
    ],
  },
  contentRules: [
    {
      text: 'Write the control’s name, in sentence case, with no full stop: "Duplicate run". It is a label, not a sentence.',
    },
    {
      text: "Keep it under about six words. Anything longer belongs in the layout, where every operator can read it.",
    },
    {
      text: 'Append the shortcut after a middot where one exists — "Duplicate run · D" — so the tooltip teaches the faster path.',
    },
    {
      text: "Never repeat text already visible next to the control; a tooltip on a labelled button is noise on every hover.",
    },
    {
      text: "Never put a constraint, a reason or a warning in a tooltip. If the operator needs it to act correctly, it cannot be hidden behind a pointer.",
    },
  ],
  propGuidance: [
    {
      prop: "content",
      note: 'Sentence case, no full stop, under about six words — append a shortcut after a middot ("Duplicate run · D") where one exists (Content rules 1-3).',
    },
    {
      prop: "side",
      note: 'Top is the system default (Rules "Top by default") — set only to pre-empt a known tight space; it still flips automatically when clipped.',
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
      id: "good-name-and-shortcut",
      kind: "good",
      title: "Name and shortcut, one line",
      caption:
        "The control's name, and its shortcut, on one line above the icon.",
      source: `${EXAMPLES_DIR}/good-name-and-shortcut.tsx`,
    },
    {
      id: "bad-paragraph-with-link",
      kind: "bad",
      title: "Paragraph and a link",
      caption:
        "Never put a paragraph or a link in a tooltip — it takes no pointer events, so the link cannot be reached.",
      source: `${EXAMPLES_DIR}/bad-paragraph-with-link.tsx`,
    },
    {
      id: "good-constraint-in-hint",
      kind: "good",
      title: "Constraint in the hint line",
      caption: "A field's constraint lives in its hint line, where it is readable before the operator types.",
      source: `${EXAMPLES_DIR}/good-constraint-in-hint.tsx`,
    },
    {
      id: "bad-constraint-behind-tooltip",
      kind: "bad",
      title: "Constraint behind a question mark",
      caption:
        "Never hide a rule behind a question mark — a constraint discoverable only by hovering is a constraint most operators will break.",
      source: `${EXAMPLES_DIR}/bad-constraint-behind-tooltip.tsx`,
    },
    {
      id: "good-truncated-value",
      kind: "good",
      title: "Full value on hover",
      caption:
        "A truncated value gets its full text on hover — the one case where the tooltip repeats what is already on screen.",
      source: `${EXAMPLES_DIR}/good-truncated-value.tsx`,
    },
    {
      id: "bad-already-labelled",
      kind: "bad",
      title: "Repeats a visible label",
      caption:
        "Never label a control that is already labelled — a tooltip repeating visible text is noise on every hover.",
      source: `${EXAMPLES_DIR}/bad-already-labelled.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Never the only copy",
      body: "Because a tooltip needs a pointer and a wait, nothing in it is load-bearing. Every icon-only control also carries a real accessible name, and every rule it might state is written in the layout.",
    },
    {
      title: "Described, not labelled",
      body: 'The bubble is role="tooltip" tied to its trigger with aria-describedby, so it is heard as extra description after the control’s own name rather than replacing it.',
    },
    {
      title: "Keyboard shows it too",
      body: "Focusing the trigger shows the tooltip with no delay and Escape dismisses it, so a keyboard operator gets the same hint a pointer does — hover is not the only path.",
    },
    {
      title: "Nothing to chase",
      body: "With pointer-events off and a 0ms hide, there is no bubble to move the cursor into and nothing that can be lost by moving too slowly — the failure mode of hoverable tooltips.",
    },
  ],
  tokens: [
    { tokens: ["bg"], usage: "Bubble surface." },
    { tokens: ["accent-line"], usage: "Bubble hairline." },
    { tokens: ["fg"], usage: "Label text." },
    { tokens: ["border-2"], usage: "Trigger border." },
    { tokens: ["panel-2"], usage: "Trigger fill." },
  ],
  relationships: [
    {
      target: "popover",
      kind: "often-confused-with",
      text: "Where anything clickable goes. The test is the pointer: if the operator has to reach into it, the trigger has to be a click.",
    },
    {
      target: "main-rail",
      kind: "composes-with",
      text: "Its most common production trigger: every icon in the collapsed rail names itself with a Tooltip instead of a native title.",
    },
    {
      target: "text-input",
      kind: "contrasts-with",
      text: "Owns field constraints. A rule about what may be typed belongs in the hint line under the field, never behind a question mark.",
    },
    {
      target: "button",
      kind: "composes-with",
      text: "The usual trigger. An icon-only button needs both a tooltip for the pointer and an accessible name for everything else.",
    },
  ],
  changelog: [
    {
      version: "1.2.0",
      date: "2026-09-19",
      text: "Adopted by the collapsed main rail — icon-only rows and the collapse/expand toggle now use this component in place of a native title.",
    },
    {
      version: "1.1.0",
      date: "2026-08-25",
      text: "Arrow and rich variant ruled out; 400ms in / 0ms out fixed; single-instance swap documented.",
    },
    {
      version: "1.0.1",
      date: "2026-08-19",
      text: "Bubble flips instead of shifting when clipped; keyboard focus now shows it without delay.",
    },
    {
      version: "1.0.0",
      date: "2026-08-12",
      text: "Tooltip introduced above the trigger at a 9px offset with no pointer events.",
    },
  ],
  extractionNotes: [
    'Section 02 ("Placement and timing", `tipRules`, archive/v1 lines 8862-8882) is modelled as `states` rather than `variants`: its six rows are behavioural rules, not a tone/style choice with a token mapping, the same stretch-fit table.ts\'s own "Zones and row states" extractionNote already chose over `variants` for the identical reason. Each row\'s own token-ish column (`tk`, e.g. "pointer-events:none", "400ms in · 0ms out") is not a colour token and has no structured field to hold it — `StateDocSchema` is name + description only — so it is folded into the verbatim `description` text (sourced from the row\'s own `b` field) rather than invented a new schema field for one ticket (AGENTS.md rule 9, stay in scope). Flagged for Cory as the same class of stretch-fit.',
    "Anatomy #3's 9px trigger-to-bubble offset maps to Space-8 per docs/prd.md §8.3's own default snap (\"9 → 8\") — button.ts's own 9px vertical-padding note already made this exact call. The live demo's own bubble padding (archive/v1 line 8883: `padding:6px 10px`) has its 6px already on the ramp; the 10px horizontal has no single default (§8.3: \"10 → 8 or 12\") — chosen as Space-8, the tighter of the two, so the one-line label (anatomy #2's own white-space:nowrap floor) sits close rather than loose. Both decisions noted per §8.3's own instruction.",
    'Anatomy #1\'s "fading in over 160ms" matches none of the four named duration tokens (instant 140ms, control 180ms, panel 260ms, reveal 500ms, packages/tokens/src/css/tokens.css) — closest is --duration-instant at 140ms, but 160 isn\'t that value either. Shipped as the literal `duration-160` utility (Tailwind v4\'s bare-numeric support), the same call radio.ts\'s, progress.ts\'s and tabs.ts\'s own un-snappable-duration extractionNotes already made. Also flagged for the token decisions backlog. `--shadow-bubble` (packages/tokens/src/css/tokens.css: "Bubble. Tooltip only") is this component\'s own pre-existing elevation token (LDS-015) and needed no decision — it matches the live demo\'s own box-shadow (`0 12px 30px rgba(0,0,0,.5)`) exactly.',
    'The Usage section\'s "use something else when" card (archive/v1 lines 8887-8892) has a fourth bullet — "It says why a control is locked — that belongs beside the control, in the layout" — with no component it names to target. The other three bullets each name a real component (Popover, the field\'s own hint line → Text input, Toast) and became the three `useInstead` rows above; this fourth one is kept here verbatim rather than forced into a `useInstead` row with an invented target (docs/build-guide.md §3: every "use something else" row becomes a typed relationship with its target id — this row has none). Flagged for Cory.',
    "The Related section's (`tipRelatedGo`) own prose for Popover, Text input and the field-constraint line overlaps in meaning with the Usage section's `useInstead` rows above but is not the same text — both are kept verbatim in their own fields per ADR-0009, the same as callout.ts's own Toast/Modal cards appearing in both `usage.useInstead` and `relationships` with different wording.",
    'Relationship `kind` is new structured metadata the prototype\'s Related cards don\'t carry, the same flag callout.ts\'s own extractionNotes already raised. Popover is `often-confused-with` (the prototype\'s own boundary sentence calls it "the whole line against Popover" — the two overlay types most likely to be reached for by mistake); main-rail and Buttons are `composes-with` (both are triggers Tooltip is mounted inside, not alternatives to it); Text input is `contrasts-with` (a boundary on which component owns a field\'s own constraint prose, the same relationship class Callout\'s own Modal row used). Flagged for review.',
    "main-rail.tsx (packages/ui/src/main-rail/main-rail.tsx, collapsed-rail item labels) already renders its own hand-rolled hover/focus bubble — predating this ticket, before Tooltip existed — using a plain aria-hidden span with the native `title` attribute for the accessible name, not role=\"tooltip\"/aria-describedby, and `border-border-2` rather than this component's `border-accent-line` hairline. The Related card above (`tipRelatedGo`'s own \"every icon in the collapsed rail names itself with a Tooltip instead of a native title\") describes the end state this predates, not the current main-rail.tsx. Swapping main-rail's own markup for this shipped Tooltip component is out of scope for this ticket (AGENTS.md rule 9) and is filed separately as a needs-triage follow-up rather than done inline, unlike LDS-018's own Callout-into-Button swap (that swap shipped inside the Buttons ticket itself; this one did not, since main-rail's own markup is already accessible via `title` and a styling-only migration carries no behavioural urgency).",
    "The `side` prop and its automatic viewport-edge flip (Rules \"Flips when clipped\") have no prototype JS counterpart to port — `tipRules`' own rows document the behaviour in prose only. Built fresh (AGENTS.md rule 2) as a `useLayoutEffect` measuring the trigger and bubble on open and flipping to the opposite side when the preferred one would clip, rather than a floating-UI dependency: no Radix/floating-ui infra exists in this repo yet (ADR noted in tabs.ts's and table.ts's own extractionNotes for the same reason), and the prototype's own live demo positions its bubble with plain CSS relative to an `overflow:visible` ancestor, not a portal — this component does the same.",
    "The prototype's own \"One at a time\" rule (`tipRules` row 6 — a single tooltip instance across the whole page, and swapping between triggers within 400ms skips the delay) is not implemented: it requires a shared registry or context provider tracking the currently-open tooltip across every instance, which is new cross-component architecture, not this one component's own concern (AGENTS.md rule 9, stay in scope). Each Tooltip instance here manages its own open/delay state independently. Flagged for Cory; worth a provider if a page ever ships enough simultaneous triggers for the gap to be visible.",
    "`propGuidance` (LDS-009) has no prototype counterpart, the same gap callout.ts's own extractionNotes already flagged — the prototype never documented a JS API. Its two notes paraphrase Content rules 1-3 and the `tipRules` \"Top by default\" row rather than being extracted verbatim from anywhere. `children` is left unannotated since cloning the trigger to attach the hover/focus handlers is implementation detail, not usage guidance.",
  ],
});
