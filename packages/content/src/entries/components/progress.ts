import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/progress/examples";

/**
 * Progress, extracted from archive/v1/Workspace Shell.dc.html (template
 * 6648–7017, logic constants `progAnatomy` 15925 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on "Loading" inside the boundary sentence, the Variants
 * closing paragraph and the Usage "use something else" rows is dropped as
 * markup, not content, the same precedent every other entry's own
 * cross-reference styling already set. See extractionNotes for every place
 * structured metadata was added, a literal had no clean token, or the
 * shipped component departs from the prototype's own markup.
 */
export const progress = ComponentEntrySchema.parse({
  meta: {
    id: "progress",
    name: "Progress",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-10-02",
  },
  purpose: "Reports a measured fraction of a known total, and nothing else.",
  description: {
    summary: "Progress reports a measured fraction of a known total, and nothing else.",
    boundary:
      "The whole component rests on one condition: the system honestly knows the denominator. That is the line against Loading — while the total is unknown the answer is a phase label and a sweep, and the moment it becomes knowable this takes over. A bar that fakes a fraction is worse than no bar at all, because the operator plans around it.",
  },
  anatomy: [
    {
      number: "1",
      name: "Label",
      description:
        'What is being counted, in 12.5px --dim sentence case: "Exporting runs". It names the work rather than the state, so the bar is legible the second the operator glances at it.',
    },
    {
      number: "2",
      name: "Value",
      description:
        "The measured fraction in --mute, written as a count wherever a count exists — 132 / 214 rather than 62%. A percentage is a derived number; the count is the thing the operator can act on.",
    },
    {
      number: "3",
      name: "Fill",
      description:
        "--accent at 85% opacity, animating its width over 300ms so a jump of several percent reads as movement rather than a redraw. It only ever moves forward.",
    },
    {
      number: "4",
      name: "Track",
      description:
        "A 5px --panel-2 bar, square-cornered like everything else, spanning the full width of its container. Its length is the denominator made visible, which is why it is never sized to the content.",
    },
    {
      number: "5",
      name: "Caption",
      description:
        "One optional 11px --faint line under the bar, in the // phase voice, for what the fraction cannot say: which shard is being written, how much time is left. Present only when it is true.",
    },
  ],
  anatomyCaption:
    "Each part takes one edge of the frame, and every leader is a single straight line landing square on the target. Positions are measured from the artifact, so the diagram stays true at any size.",
  variants: [
    {
      name: "Bar",
      tokens: ["panel-2", "accent"],
      description:
        "One long task with a countable total — 132 of 214 runs exported. The default, and the only variant allowed to carry an estimate of time remaining.",
    },
    {
      name: "Steps",
      tokens: ["accent", "panel-2"],
      description:
        "A pipeline with named stages, where being halfway through stage two is not information the operator can use. Segments fill whole; they never fill partially.",
    },
    {
      name: "Meter",
      tokens: ["panel-2", "accent"],
      description:
        "A quantity inside a table row or a card, where the surrounding row already names it — quota used, coverage, capacity. It reports a level, not necessarily work in flight.",
    },
  ],
  variantsNote:
    "There is no indeterminate bar and no spinner. A bar that animates without a denominator is a lie told smoothly — that case belongs to Loading, which says what the system is doing instead of pretending to know how far along it is.",
  usage: {
    useWhen: [
      "The system can count both what is done and what is left.",
      "The work runs long enough that the operator would otherwise wonder — roughly five seconds and up.",
      "The fraction is a level worth knowing on its own: quota, coverage, capacity.",
      "The stages are named and discrete, and finishing one is the news.",
    ],
    useInstead: [
      {
        target: "loading",
        text: "The total is unknown — that is Loading, with a phase label.",
      },
      {
        target: "toast",
        text: "The result is already in and only needs reporting — that is a Toast.",
      },
    ],
  },
  contentRules: [
    {
      text: 'The label is a present participle naming the work: "Exporting runs", "Indexing documents" — never "Loading", never "Please wait".',
    },
    {
      text: "Write the value as a count with the total: 132 / 214. Percentages are for continuous quantities, and then with no decimal places.",
    },
    {
      text: 'Time estimates are approximate and say so — "~3M LEFT" — and they only appear once the rate has settled enough to be worth printing.',
    },
    {
      text: "The caption uses the // phase voice in uppercase mono, matching Loading, so the two components read as one system when a task moves between them.",
    },
    {
      text: 'On completion say what finished, in the past tense and with the number — "214 runs exported" — then let the bar go.',
    },
  ],
  propGuidance: [
    {
      prop: "variant",
      note: 'Which of the three Variants this instance renders — "bar" (the default, a countable total), "steps" (named discrete stages) or "meter" (an inline level, Progress Variants).',
    },
    {
      prop: "value",
      note: 'The measured amount — a count paired with `max` on "bar"; a 0–100 percent with no decimal places on "meter" (Content rule 2). Not read on "steps", which uses `steps`/`current` instead.',
    },
    {
      prop: "max",
      note: 'The known denominator that makes the bar honest — read only on "bar" (Rules "Only with a denominator", anatomy #2).',
    },
    {
      prop: "status",
      note: 'Which of the live states the fill renders — "running" (the default, --accent at 85%), "complete" (full --accent) or "failed" (--alarm, frozen in place) — read only on "bar" (Rules "Failure keeps its place").',
    },
    {
      prop: "steps",
      note: 'The total named stages — read only on "steps" (Variants "Steps").',
    },
    {
      prop: "current",
      note: 'The stage now running, 1-indexed — stages before it render filled, this one and the rest render empty (Rules "Forward only"; Variants "Steps" — "Segments fill whole; they never fill partially"). Read only on "steps".',
    },
    {
      prop: "caption",
      note: 'The optional phase note under the bar, in the // voice — read only on "bar" (anatomy #5, Content rule 4).',
    },
  ],
  examples: [
    {
      id: "bar",
      kind: "demo",
      title: "Bar",
      source: `${EXAMPLES_DIR}/bar.tsx`,
    },
    {
      id: "steps",
      kind: "demo",
      title: "Steps",
      source: `${EXAMPLES_DIR}/steps.tsx`,
    },
    {
      id: "meter",
      kind: "demo",
      title: "Meter",
      source: `${EXAMPLES_DIR}/meter.tsx`,
    },
    {
      id: "good-realcount",
      kind: "good",
      title: "A real count beside the bar",
      caption: "A real count beside the bar, so the fraction can be checked against something.",
      source: `${EXAMPLES_DIR}/good-realcount.tsx`,
    },
    {
      id: "bad-fakeprecision",
      kind: "bad",
      title: "Invented decimals and “Working…”",
      caption:
        'Never invent decimals or say "Working" — false precision over a vague label fools nobody twice.',
      source: `${EXAMPLES_DIR}/bad-fakeprecision.tsx`,
    },
    {
      id: "good-wholesegments",
      kind: "good",
      title: "Steps fill whole segments",
      caption: "Steps fill whole segments — stage two is either done or it is not.",
      source: `${EXAMPLES_DIR}/good-wholesegments.tsx`,
    },
    {
      id: "bad-partialfill",
      kind: "bad",
      title: "A part-filled segment",
      caption: "Never part-fill a segment — if the inside of a stage is measurable, use a bar.",
      source: `${EXAMPLES_DIR}/bad-partialfill.tsx`,
    },
    {
      id: "good-failureholds",
      kind: "good",
      title: "On failure the fill holds its position",
      caption: "On failure the fill holds its position and turns, so the operator sees how far it got.",
      source: `${EXAMPLES_DIR}/good-failureholds.tsx`,
    },
    {
      id: "bad-resetzero",
      kind: "bad",
      title: "Resetting to zero on failure",
      caption: "Never reset the bar to zero on failure — the work that did happen is the useful part.",
      source: `${EXAMPLES_DIR}/bad-resetzero.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Progressbar with values",
      body: 'role="progressbar" carrying aria-valuenow, aria-valuemin and aria-valuemax, labelled by the visible label. Meters use role="meter", because a level is not work in flight.',
    },
    {
      title: "Announced in steps",
      body: "The value is announced at coarse intervals — roughly every 10% or on each stage change — not on every tick. A bar that speaks per frame is a bar nobody can listen to.",
    },
    {
      title: "Colour is never alone",
      body: "The fill is always paired with a count or percentage in text, and failure is stated in words as well as in #ff8f6b. Amber over --panel-2 measures 5.8:1, but the number is what carries the meaning.",
    },
    {
      title: "Reduced motion",
      body: "Under prefers-reduced-motion the width snaps instead of animating. The value still updates on the same schedule, so nothing about the reading is lost with the movement.",
    },
  ],
  tokens: [
    { tokens: ["panel-2"], usage: "Track" },
    { tokens: ["accent"], usage: "Fill while running" },
    { tokens: ["accent"], usage: "Fill at completion" },
    { tokens: ["dim", "mute"], usage: "Label and value" },
    { tokens: ["mute"], usage: "Phase caption" },
  ],
  relationships: [
    {
      target: "loading",
      kind: "contrasts-with",
      text: "Where work goes while the total is unknown. The two hand over to each other mid-task, which is why they share the // caption voice.",
    },
    {
      target: "table",
      kind: "composes-with",
      text: "Meters live in table rows to compare levels down a column, which is why the inline variant carries no label of its own.",
    },
    {
      target: "toast",
      kind: "contrasts-with",
      text: "The bar reports work in flight; the toast reports that it finished. When the count reaches the total, one replaces the other.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-24",
      text: "Indeterminate bars and spinners ruled out; failure now freezes the fill instead of resetting it.",
    },
    {
      version: "1.0.1",
      date: "2026-08-18",
      text: "Counts made the default value format, with percentages reserved for continuous quantities.",
    },
    {
      version: "1.0.0",
      date: "2026-08-10",
      text: "Bar, steps and meter variants introduced on a 5px track with a 300ms advance.",
    },
  ],
  extractionNotes: [
    'This entry replaces the draft stub Badge\'s (LDS-020) `alternative` relationship created only so that row\'s own "use something else when" target had somewhere real to point. `purpose` is now Progress\' own opening sentence rather than a paraphrase from Badge\'s side.',
    "Anatomy #1/#2's off-scale literals (\"12.5px --dim\", \"11.5px --mute\" — the latter from the anatomy diagram's own specimen markup, data-anat=\"1\"/\"2\") are kept verbatim in this prose (ADR-0009); the shipped component maps 12.5→Small (13px) and 11.5→Label (12px) per docs/prd.md §8.2's own default mapping, with no ambiguity either way.",
    'Anatomy #4/#3\'s "5px" track/fill height has no spacing-ramp step (docs/prd.md §8.3\'s own default snap: "5 → 4 or 6"). Chosen Space-6 over Space-4 — the ramp only generates utilities at its own named steps, so 5px itself isn\'t an available class either way, and 6px keeps the track a visibly heavier weight than Loading\'s own 2px hairline track. Decision noted per §8.3\'s "choose by context and note the choice," the same precedent card.ts\'s own HUD-mark offsets and badge.ts\'s own below-floor padding already set.',
    'Anatomy #5\'s caption ("11px --faint") is kept verbatim in this prose, but the shipped component (packages/ui/src/progress/progress.tsx) renders it in --mute, not bare --faint — the same fix loading.ts\'s own phase label already needed: axe measures bare --faint text on --panel at 3.53:1 in the light theme, short of AA\'s 4.5:1 floor. The Tokens section\'s own "Phase caption" row below lists `mute`, not `faint`, for the same reason loading.ts\'s own Tokens row did. The Steps caption ("STAGE X OF N" / stage name) and the Meter row\'s own name text — neither carried by a `prog*` content constant, both only in the Live demo\'s own markup — get the same preemptive --mute treatment rather than waiting to reproduce the identical axe failure.',
    'Steps\' own segment gap ("3px gaps", Variants table row) has no explicit default-snap entry (docs/prd.md §8.3\'s list covers 5/7/9/10/11/13/20, not 3) and sits below the ramp\'s own floor; floored to Space-4, the same move badge.ts\'s own below-floor 2px vertical padding already made.',
    'The anatomy diagram\'s own specimen and the Live demo\'s "Bar" stack both use a "gap:7px" (archive/v1/Workspace Shell.dc.html:6671, 6754-ish) between label row / track / caption. §8.3\'s own default snap ("7 → 6 or 8") chose Space-6, paired with the track-height decision above rather than independently — the same "choose by context" latitude already used twice above.',
    'The Live demo\'s own Steps/Meter outer stacks use "gap:10px" (archive/v1/Workspace Shell.dc.html:6712, 6725). §8.3\'s own default snap ("10 → 8 or 12") chose Space-8, the tighter of the two, to keep each row compact next to its own heading.',
    'Fail\'s literal fill colour ("#ff8f6b", progContent/DoDont markup) is AGENTS.md rule 4 / docs/prd.md §8.1\'s `--alarm` (non-themeable) — the same mapping badge.ts\'s Fail tone and button.ts\'s Danger variant already made for this exact literal.',
    'The Do/Don\'t "good" failure example\'s own caption ("Stopped at 88 of 214", archive/v1/Workspace Shell.dc.html:6878-ish) renders in bare #ff8f6b in the prototype\'s own markup. Shipped in --fg instead: axe measures bare --alarm text at 2.02:1 against --bg in the light theme, the same documented gap badge.ts\'s Fail label and button.ts\'s Danger label already route around. The fill itself keeps literal --alarm — a solid colour fill has no text-contrast requirement of its own, only the 3:1 non-text floor, which it clears by a wide margin against --panel-2. Deliberate deviation from the prototype\'s own visual, not an extraction error, the same precedent button.ts\'s own Danger-variant note already set.',
    "The running fill's own opacity (\"85%\", anatomy #3 and every Tokens/variant reference to it) has no Tailwind default-scale utility — the stock `opacity-*` scale only steps at 0/5/10/20/25/.../100, skipping 85 — and isn't a design token either. Shipped as `bg-accent/85`, the colour-utility's own opacity modifier (not bracket/arbitrary syntax, so `tailwindcss/no-arbitrary-value` doesn't block it) rather than inventing a token. Flagged for the token decisions backlog, the same way button.ts flagged its own unmapped brightness/opacity literals.",
    'The fill\'s own width transition ("300ms", the Live demo\'s own "WIDTH 300MS" caption) matches none of the four named duration tokens (instant 140ms, control 180ms, panel 260ms, reveal 500ms) — closest is --panel at 260ms. Shipped as the literal `duration-300` utility (a bare numeric Tailwind duration class, not arbitrary-bracket syntax) rather than snapping to a token that isn\'t actually the same value, the same way button.ts\'s own extractionNotes flagged reading `duration.instant` directly rather than inventing a step. Also flagged for the token decisions backlog.',
    'The prototype\'s own `progTokens` has a sixth row ("width · 300ms", "Fill advance") not carried into this entry\'s `tokens` field: `TokenUsageSchema.tokens` is a `ColorTokenNameSchema` array, closed to colour tokens only — the same scope limit loading.ts\'s own extractionNotes already flagged for its own two motion rows (sweepline/caretblink). Referenced in prose instead (anatomy #3, the duration flag above).',
    'Usage\'s "use something else when" rows 2 ("The work is instant; a bar that flashes is noise, not feedback.") and 4 ("The number is the point and the shape adds nothing — write the count as text.") aren\'t modeled as `useInstead` rows: neither names an alternative component for `UsageSchema.useInstead`\'s `target` to resolve — unlike loading.ts\'s and empty-state.ts\'s own flagged "inline error" row, which at least named a missing component, these two are plain content-pattern guidance with nothing to link to. Kept verbatim; flagged for Cory in case either deserves its own contentRules-style guidance instead.',
    "The Variants table's own short per-row captions under each name (\"5px · labelled · counted\", \"3px gaps · whole stages only\", \"2px · inline · no label\") have no schema slot — `VariantSchema` is `{ name, tokens, description }`, with no field for a secondary caption line — and are dropped as redundant with their own `tokens` row and `description` sentence, the same gap every other entry's own per-variant caption line already left unmodeled.",
    'Three variants (Bar/Steps/Meter) are structurally different — different anatomy, different props, not just different styling of the same shape — so the shipped component (packages/ui/src/progress/progress.tsx) is a discriminated union dispatched on `variant`, not a single cva style map. The same shape loading.ts\'s own three variants already took, for the same reason.',
    "`current` (the \"steps\" variant's own prop) is 1-indexed to match the Live demo's own \"STAGE 3 OF 4\" caption format directly (current=3 renders 2 filled segments, the 3rd now running) — avoids an off-by-one translation at every call site.",
    "The Meter row's own proportions (name / track / value) aren't governed by a literal measurement in the prototype — its own markup is a CSS grid row (`minmax(90px,1fr) 1fr 44px`) whose middle column is relative, not a size. Shipped with a fixed 1/3 width share for the track instead, the same kind of judgement call card.ts's own HUD-mark extractionNotes already made for an unmeasurable proportion.",
    'Do/Don\'t "bad" examples 2 (an invented decimal percentage, "87.4%") and 4 (a part-filled segment) can\'t be built with the real component: "bar" has no percent-display mode (Content rule 2 — Bar always shows a count) and "steps" segments are always fully filled or fully empty by construction (Rules "Forward only"). Reproduced with plain markup instead, the same "structurally prevented" precedent loading.ts\'s own bad-spinner example already set.',
    'No shadcn CLI scaffold or `@radix-ui/react-progress` dependency was added for this ticket\'s named "progress" counterpart: no `components.json` exists anywhere in this repo, and no earlier ticket actually ran the CLI either, including button.ts\'s own "button" counterpart (flagged in that PR). Hand-built per this entry\'s own Accessibility section instead.',
  ],
});
