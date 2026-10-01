import { FoundationEntrySchema } from "../../schema/foundation";

/**
 * Motion, extracted from archive/v1/Workspace Shell.dc.html (template
 * 2101–2448, logic `motDocs()` 14965, `motRelated()` 15003) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling in the Durations closing note and the Loops closing note
 * is dropped as markup, not content. See extractionNotes for every place
 * structured metadata was added or a value was restructured rather than
 * lifted directly.
 */
export const motion = FoundationEntrySchema.parse({
  meta: {
    id: "motion",
    name: "Motion",
    section: "foundations",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-26",
  },
  description: {
    summary:
      "Motion here has one job: to say what just changed, and where it came from. Nothing moves to be admired.",
    boundary:
      "This is a console an operator watches for hours, so the budget is spent on transitions that carry cause and effect — a panel arriving from the direction it was summoned, a row acknowledging a click. Everything else holds still. Two things may loop and only two: something that is genuinely live, and something that is genuinely waiting. A third looping element in a view means one of them is decoration, and decoration in peripheral vision reads as an alert.",
  },
  scales: [
    {
      name: "Instant",
      tokens: ["duration-instant"],
      description:
        "Hover fills, chip toggles, row highlights, the fade on a revealed action. Short enough to feel like a property of the pointer rather than an animation — the row is already lit by the time the eye lands on it.",
    },
    {
      name: "Control",
      tokens: ["duration-control"],
      description:
        "Buttons and inputs, where several properties change together: fill, border, transform and shadow. The extra 40ms buys those four a common landing so the control does not appear to come apart under the cursor.",
    },
    {
      name: "Panel",
      tokens: ["duration-panel", "easing-standard"],
      description:
        "Anything that changes the shape of the page: the dock collapsing, the drawer taking width, the header sliding to follow. This is the longest step an operator is made to wait through before they can act.",
    },
    {
      name: "Reveal",
      tokens: ["duration-reveal", "easing-standard"],
      description:
        "Cards and panels arriving on first paint, spread 360–600ms with no delay on anything. Duration is uniform inside a group of equals — nine launcher tiles at 500ms, four metric cards at 450ms — so they arrive and land together. It varies only where a group holds panels of different weight, 500 against 550 on the home grid and 550 against 600 in the viz column, which gives the heavier panel a slightly softer landing rather than a later one. Long because it happens once and nothing is blocked by it: the content is readable from the first frame; only its position is still settling.",
    },
    {
      name: "Draw",
      tokens: ["easing-draw"],
      description:
        "The blueprint line-draw in a visualization, and only there. Every call passes its own duration — 620ms is typical, 560 for the short risers on a node graph, 900 for a full signals layer — because a line's duration is set by its length, not by a token. It runs once per mount and never repeats, since a chart that redraws itself on every state change is a chart nobody can read a number off.",
    },
  ],
  scalesNote:
    "Bars are drawn to scale against the 900ms Draw ceiling. These five are the scale; 140 and 180 are the only neighbours close enough to argue about, and they never appear on the same element. Three further values are still in the codebase and are not part of it: 160ms on the dock's active rail, the radio dot, the swatch border and the select caret; 200ms on the dock labels; and 220ms on every launcher tile. Each is a chrome timing that predates the scale and should collapse into Instant, Control or Panel — they are listed here because a spec that quietly omits what ships is not a spec.",
  usage: {
    useWhen: [
      "Something arrives or leaves, and the direction says where it came from.",
      "A control needs to acknowledge a pointer or a key within 180ms.",
      "The layout itself changes size — the dock collapsing, a drawer taking width.",
      "The system is genuinely working and cannot yet say how far along it is.",
    ],
    useInstead: [
      "The content is the point. Numbers never count up; a table never reflows for effect.",
      "You want to draw attention — that is Color, and it works without moving.",
      "Something already animates nearby. Two loops in one view is one too many.",
      "The element is under a pointer that is about to click it. Nothing should move away.",
    ],
  },
  principles: [
    {
      text: "No easing in this system overshoots. There is no spring, no bounce and no elastic curve — an overshoot implies weight and play, and nothing in an operations console should feel like it has momentum of its own.",
    },
    {
      text: "Every entrance travels a short distance on one axis and fades — 6px for a small element, 12–16px for a panel. Nothing scales up from zero, and nothing rotates in. No card or panel entrance is delayed: a group of equals shares one duration and arrives together, and where a group mixes panel weights the heavier one is given 50ms more to settle. Delay is reserved for visualization geometry and its labels. Geometry steps 40 to 130ms per element — 40ms across the fine grid lines of a node graph, 130ms between the rings of a research map, wider the heavier the thing being drawn — while labels step 55 to 90ms over a 520–900ms base, so a name never arrives before the shape it belongs to. A six-layer signals chart runs 110ms per layer, putting the last line 550ms behind the first. That is deliberate: a chart is meant to be watched once, and a grid of cards is not.",
    },
    {
      text: "The full loop set is pulse at 2.6s and breathe at 2s for live status — 1.1s where breathe carries a working label rather than a state — then sweepline, shimmer, ringspin and caretblink for waiting, and gridDrift and glowdrift for the ambient background of the launcher — the one place decoration is allowed, because there is nothing there to read yet. Where several tracks sweep together they are staggered .22s apart so the group reads as one movement.",
    },
  ],
  accessibilityNotes: [
    {
      title: "Reduced motion is honoured",
      body: "Under prefers-reduced-motion every loop stops — the sweep becomes a static amber segment, the caret stays lit, the pulse holds at full opacity — and entrances collapse to opacity alone. No information lives in movement, so nothing is lost; the state is always also carried by position, colour and text.",
    },
    {
      title: "Nothing loops without cause",
      body: "A loop is a claim that something is happening right now. Two are permitted in a view at most, and a loop that outlives its cause is a defect: it trains the operator to ignore movement, which is the one signal a console cannot afford to spend.",
    },
    {
      title: "Animation is never a message",
      body: "Every animated state has a text equivalent announced politely — aria-busy while waiting, a status word beside a pulse. The moving element itself is aria-hidden, because an animation has nothing to say to a screen reader.",
    },
    {
      title: "Motion never moves a target",
      body: "Nothing animates position under a pointer or a focus ring. Entrances run before the element is interactive, and no hover state changes an element's size, so a click can never land on something that has since moved.",
    },
  ],
  relationships: [
    {
      target: "elevation",
      kind: "composes-with",
      text: "Motion says where an overlay came from; elevation says how far off the page it now sits. A drawer needs both to read as one gesture.",
    },
    {
      target: "accessibility",
      kind: "composes-with",
      text: "Holds the reduced-motion contract for the whole system. This page sets the timings; that one sets what happens when they are switched off.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-26",
      text: "Published five durations to scale with the three easing curves, named the loop set and its periods explicitly, and listed the three chrome timings still running off the scale rather than leaving them undocumented.",
    },
    {
      version: "1.0.1",
      date: "2026-08-15",
      text: "Slowed the live-status pulse from 1.4s to 2.6s after it kept reading as an alarm in peripheral vision. Capped sibling stagger at 70ms.",
    },
    {
      version: "1.0.0",
      date: "2026-08-08",
      text: "Replaced ad-hoc timings with a five-step scale, dropped every spring and bounce curve, and made the blueprint draw run once per mount.",
    },
  ],
  extractionNotes: [
    "Section 01 \"Durations\" (`motDurations`, 5 steps) becomes `scales`. Each step's long `b` field becomes the scale's `description`, verbatim, and its duration (and, where the step is tied to one in the prototype's own prose, its easing curve) become the real token names from packages/content/src/entries/tokens/motion.ts (LDS-013). Draw has no fixed duration token — every call site passes its own, per the prototype's own text — so its `tokens` carries only `--easing-draw`.",
    "Section 02 \"Easing\" (three curves: `ease`, `cubic-bezier(.4,0,.2,1)`/`--easing-standard`, `cubic-bezier(.45,0,.55,1)`/`--easing-symmetric`) is not a separate `scales` entry: `--easing-standard` is already referenced from the Panel and Reveal duration rows, `ease` (the browser default used at the two shortest steps, Instant and Control) has no token of its own to reference, and `--easing-symmetric` belongs to the sweepline loop rather than to one of the five named durations — it is not part of the documented five-step scale, so folding it into a duration row would misrepresent it. Flagged rather than forced in.",
    "The Durations table's own closing note (the \"Bars are drawn to scale...\" paragraph, including the three off-scale legacy chrome timings) becomes `scalesNote`, the same role the field played for the other foundations extracted so far.",
    "Section 02's own closing note (\"No easing in this system overshoots...\"), Section 03 \"Entrances\"'s closing paragraph and Section 04 \"Loops\"'s closing paragraph are folded into `principles`, since `scalesNote` only holds one string and these are rules rather than table captions. Section 03's and 04's own per-row tables (`motEntrances`, the six named keyframes; the two live Loop specimens) are not separately stored — their content is carried in the Tailwind theme's named animations (packages/tokens/build.mjs's `ANIMATIONS`, LDS-012) and in each closing paragraph above, so nothing is lost, only not duplicated as table rows here.",
    "`motRelated()`'s three cards target Loading (a component, no entry yet), Elevation and Accessibility. Per catalogue.ts's existing scope boundary (foundation `relationships` resolve only against the foundations catalogue, LDS-014), Loading is dropped rather than left dangling; Elevation and Accessibility are kept.",
    "Section 06 \"Do and don't\" is not stored in this entry, the same as the other foundations extracted so far (docs/build-guide.md §4 step 6 — component examples, not Foundation content).",
    "Section 08 \"Tokens\" (`motTokens`) is not duplicated here: the docs page resolves each scale's `tokens` against the real token catalogue instead of this entry re-stating values that package already owns.",
  ],
});
