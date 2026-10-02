import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/loading/examples";

/**
 * Loading, extracted from archive/v1/Workspace Shell.dc.html (template
 * 12858–13209, logic constants `loadAnatomy` 16471 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on "Progress"/"Empty state"/"Toast" inside the Usage "use
 * something else" rows is dropped as markup, not content. See
 * extractionNotes for every place structured metadata was added, a literal
 * had no clean token, or the shipped component departs from the prototype's
 * own markup.
 */
export const loading = ComponentEntrySchema.parse({
  meta: {
    id: "loading",
    name: "Loading",
    section: "components",
    status: "stable",
    version: "1.2.0",
    updated: "2026-10-01",
  },
  purpose: "What a region shows while it still does not know the answer.",
  description: {
    summary: "Loading is what a region shows while it still does not know the answer.",
    boundary:
      "It is the only place in the system where amber moves without something having happened, and it earns that because motion is the one honest way to say “still working”. The line against Progress is knowledge: progress states a measured fraction of a known total, loading states nothing but that work is under way. Never fake one as the other — a bar creeping to 90% and stopping is worse than a sweep that admits it cannot say.",
  },
  anatomy: [
    {
      number: "1",
      name: "Region",
      description:
        "The waiting area, scoped as tightly as possible — one panel, one row, one field. It keeps the frame it already had, so the page does not reflow when the answer arrives.",
    },
    {
      number: "2",
      name: "Track",
      description:
        "A 2px hairline in --accent-line, one per line of text that has not arrived. Widths are deliberately unequal — 86%, 64%, 74% — because prose does not arrive in a rectangle.",
    },
    {
      number: "3",
      name: "Sweep",
      description:
        "A gradient a third of the track wide, travelling left to right over 1.8s and staggered 220ms per track. The direction is the direction of reading, which is what makes it feel like text being written.",
    },
    {
      number: "4",
      name: "Phase label",
      description:
        "11.5px in --faint, mono, prefixed // and uppercased: the one piece of real information in the whole component. It names what the system is doing right now, not that it is busy.",
    },
    {
      number: "5",
      name: "Caret",
      description:
        "A 5×11px amber block blinking on a 1s step, sitting where the next character would land. It is the smallest unit of liveness the system has, and the only one allowed inside a table row.",
    },
  ],
  anatomyCaption:
    "The sweep is held still here so its geometry can be measured; in use it travels. Every leader is a single straight line landing square on its target, derived from the artifact’s real rect.",
  variants: [
    {
      name: "Sweep stack",
      tokens: ["accent-line", "accent"],
      description:
        "The default, and the house style. Two or three hairlines of unequal width, staggered by 220ms, standing in for text that has not arrived. Use it when an agent is working and the shape of the answer is not yet known.",
    },
    {
      name: "Skeleton",
      tokens: ["border", "border-2"],
      description:
        "For layouts whose shape is already known — table rows, a card grid. It holds the exact geometry the content will occupy so nothing jumps when it lands, and it is grey, not amber: the shape is the message, not the motion.",
    },
    {
      name: "Inline caret",
      tokens: ["accent", "mute"],
      description:
        "For dense chrome where a stack will not fit: a table row mid-refresh, a button mid-submit, a status line. The phase name carries the meaning and the caret carries the liveness.",
    },
  ],
  variantsNote:
    "There is no spinner in this system, and no full-screen loading overlay. A rotating disc says only that something is happening somewhere, which the operator already assumed; and blanking the whole workspace to say it takes away the very context they were reading. Loading is always scoped to the region that is actually waiting.",
  usage: {
    useWhen: [
      "The wait will exceed about 400ms — below that, showing anything only flickers.",
      "The duration cannot be measured, so no honest percentage exists.",
      "A named phase can be reported, and it will change as the work moves on.",
      "The region that is waiting can be pointed at precisely.",
    ],
    useInstead: [
      {
        target: "progress",
        text: "The total is known and the fraction is real — that is Progress.",
      },
      {
        target: "empty-state",
        text: "The work finished with nothing to show — that is an Empty state.",
      },
      {
        target: "toast",
        text: "The work finished elsewhere and needs acknowledging — that is a Toast.",
      },
    ],
  },
  contentRules: [
    {
      text: 'The phase label is a present participle in mono uppercase behind a // prefix: "// ANALYZING", "// READING 214 RUNS".',
    },
    {
      text: 'Name the phase, never the state: "// SYNCING" tells the operator something; "// LOADING" and "Please wait" tell them nothing they had not worked out.',
    },
    {
      text: "Include a real count when one exists — it turns an indefinite wait into a measurable one without pretending to know the total time.",
    },
    {
      text: "Change the label as the work moves through phases. A label that never changes for thirty seconds reads as a hang.",
    },
    {
      text: 'Past about ten seconds, say what is slow — "// WAITING ON UPSTREAM" — rather than leaving the same phase spinning.',
    },
  ],
  propGuidance: [
    {
      prop: "variant",
      note: 'Which of the three Variants this instance renders — "sweep-stack" (the default house style), "skeleton" or "inline-caret" (Loading Variants).',
    },
    {
      prop: "phase",
      note: 'The present participle the component prefixes with // and uppercases — "analyzing", never the state itself (Loading Content rules 1–2, anatomy #4). Read only on "sweep-stack" and "inline-caret"; "skeleton" carries no phase label (Loading Variants "Skeleton").',
    },
    {
      prop: "lines",
      note: 'How many unequal-width tracks the sweep stack renders — 2 or 3 (Loading anatomy #2, "Two or three hairlines of unequal width"). Read only on "sweep-stack".',
    },
  ],
  examples: [
    {
      id: "sweep-stack",
      kind: "demo",
      title: "Sweep stack",
      source: `${EXAMPLES_DIR}/sweep-stack.tsx`,
    },
    {
      id: "skeleton",
      kind: "demo",
      title: "Skeleton",
      source: `${EXAMPLES_DIR}/skeleton.tsx`,
    },
    {
      id: "inline-caret",
      kind: "demo",
      title: "Inline caret",
      source: `${EXAMPLES_DIR}/inline-caret.tsx`,
    },
    {
      id: "good-namedphase",
      kind: "good",
      title: "A named phase with a real count",
      caption: "A named phase with a real count — the wait reports what it is doing.",
      source: `${EXAMPLES_DIR}/good-namedphase.tsx`,
    },
    {
      id: "bad-spinner",
      kind: "bad",
      title: "A spinner and “Loading…”",
      caption: 'Never a spinner, and never "Loading…" — neither says anything the operator did not know.',
      source: `${EXAMPLES_DIR}/bad-spinner.tsx`,
    },
    {
      id: "good-matchedgeometry",
      kind: "good",
      title: "A skeleton in the exact geometry of the rows",
      caption: "A skeleton in the exact geometry of the rows, so nothing moves when data lands.",
      source: `${EXAMPLES_DIR}/good-matchedgeometry.tsx`,
    },
    {
      id: "bad-genericslabs",
      kind: "bad",
      title: "Generic grey slabs",
      caption:
        "Never generic grey slabs — a skeleton that lies about the layout causes the jump it was meant to prevent.",
      source: `${EXAMPLES_DIR}/bad-genericslabs.tsx`,
    },
    {
      id: "good-rowcaret",
      kind: "good",
      title: "One row refreshing in place",
      caption: "One row refreshing keeps its data and reports in place with a caret.",
      source: `${EXAMPLES_DIR}/good-rowcaret.tsx`,
    },
    {
      id: "bad-replacedata",
      kind: "bad",
      title: "Replacing data with skeletons on refresh",
      caption:
        "Never replace data already on screen with skeletons on refresh — the operator loses what they were reading.",
      source: `${EXAMPLES_DIR}/bad-replacedata.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Busy, announced once",
      body: "The region carries aria-busy while it waits and its label is announced politely a single time. The sweep itself is aria-hidden — an animation has nothing to say out loud.",
    },
    {
      title: "Phase changes are polite",
      body: "When the phase name changes the new one is announced, at most every few seconds. A label that updates per frame would make a screen reader unusable.",
    },
    {
      title: "Reduced motion",
      body: "Under prefers-reduced-motion the sweep stops travelling and the tracks hold a static amber segment; the caret stops blinking and stays lit. The information survives without the movement.",
    },
    {
      title: "Skeletons are silent",
      body: 'Skeleton bars are aria-hidden and carry no text. They exist to hold geometry, and announcing "loading" once per row would say the same thing twelve times.',
    },
  ],
  tokens: [
    { tokens: ["accent-line"], usage: "Track behind the sweep" },
    { tokens: ["accent"], usage: "Sweep gradient and caret" },
    { tokens: ["border", "border-2"], usage: "Skeleton bars" },
    { tokens: ["mute"], usage: "Phase label" },
  ],
  relationships: [
    {
      target: "progress",
      kind: "contrasts-with",
      text: "Progress reports a measured fraction of a known total. The moment you can honestly say 40%, stop using this.",
    },
    {
      target: "empty-state",
      kind: "contrasts-with",
      text: "What replaces this when the work finishes with nothing to show. Never show both, and never show empty while this is still running.",
    },
    {
      target: "table",
      kind: "composes-with",
      text: "Tables load as skeleton rows and refresh in place with a row caret — the two variants that are not the sweep stack.",
    },
  ],
  changelog: [
    {
      version: "1.2.0",
      date: "2026-08-23",
      text: "Three variants separated by what is known; spinner and full-screen overlay ruled out for good.",
    },
    {
      version: "1.1.0",
      date: "2026-08-15",
      text: "Phase label made mandatory alongside the sweep stack; reduced-motion fallback specified.",
    },
    {
      version: "1.0.0",
      date: "2026-08-07",
      text: "Sweep stack introduced at 1.8s with a 220ms stagger.",
    },
  ],
  extractionNotes: [
    'This entry replaces the draft stub LDS-024\'s Empty state ticket created only so that entry\'s own `useInstead` row ("The answer is not known yet — that is Loading") and its `relationships` row had somewhere real to point. `purpose` is unchanged from the stub\'s own text, since it was already paraphrased from this component\'s own boundary sentence rather than from Empty state\'s side.',
    'Anatomy #4\'s "11.5px in --faint" matches docs/prd.md §8.2\'s own default off-scale mapping exactly ("11.5 → Label") — snapped to `text-label` (12px) with no ambiguity, unlike most other components\' literals. The colour is kept verbatim in this prose (ADR-0009) but the shipped phase label renders in --mute, not bare --faint: axe measures --faint text on --panel at 3.53:1 in the light theme (apps/docs/e2e/loading.spec.ts), short of AA\'s 4.5:1 floor — the same gap Empty state\'s own support line and Card\'s own meta slot extractionNotes already document. --mute clears 4.5:1 in both themes. Variants\' own two token lists ("Sweep stack"/"Inline caret") and the Tokens section row for the phase label list `mute`, not `faint`, for the same reason.',
    'Anatomy #5\'s caret ("A 5×11px amber block") has no clean token on either axis. Height snaps per §8.3\'s own explicit default ("11 → 12") to Space-12 with no ambiguity. Width falls on §8.3\'s own documented tie ("5 → 4 or 6"); chosen Space-4 over Space-6 — "the smallest unit of liveness the system has" (anatomy #5\'s own words) reads truer at the tighter width, closer to a text caret than a block. Both choices recorded per §8.3\'s "choose by context and note the choice."',
    'Anatomy #2\'s track height ("A 2px hairline") and the Track/Sweep widths ("86%, 64%, 74%", and every other per-specimen width the prototype hand-tunes: 100%/66% in the Variants row demo, 86%/64%/74% in the Live demo, 86%/62% in the Do/Don\'t good pair) have no spacing-ramp or type-scale category to snap to — they are not a size, they are a drawn hairline and a deliberately irregular line length, the same family §8.3\'s own "1px gaps used to draw hairline grids are borders, not spacing, and are allowed" already carves out for the 1px case. Shipped as inline `style` (height, width) on the track and sweep spans rather than Tailwind classes, flagged the same way Empty state\'s own unsnappable "capped near 330px" support-line width was — AGENTS.md rule 1 rules out inventing a token or using arbitrary-bracket Tailwind syntax for either. The sweep-stack variant ships two fixed width presets (2 lines, 3 lines) rather than accepting arbitrary widths as a prop, since no call site in the source ever reuses the same set of widths twice — the irregularity itself is the point (anatomy #2: "because prose does not arrive in a rectangle"), not a value a consumer should be tuning.',
    'The two motion rows in the prototype\'s own `loadTokens` ("sweepline · 1.8s", "caretblink · 1s") are not carried into this entry\'s `tokens` field: `TokenUsageSchema.tokens` is a `ColorTokenNameSchema` array (packages/content/src/schema/component.ts), closed to colour tokens only — the same scope limit Motion foundation\'s own extractionNotes already flag for its own named animations. Both are referenced in prose instead (anatomy #3\'s "1.8s", anatomy #5\'s "1s step") and in the changelog.',
    '`caretblink` itself did not exist as a Tailwind animation before this ticket: the Motion foundation\'s own `motion.ts` already names it in prose ("sweepline, shimmer, ringspin and caretblink for waiting") but packages/tokens/build.mjs\'s `ANIMATIONS` array and packages/ui/src/cn.ts\'s `animate` allowlist had never wired it up, since no shipped component needed it until now. Added here with the keyframe body harvested verbatim from the prototype\'s own `@keyframes caretblink{0%,48%{opacity:1}49%,100%{opacity:.12}}` (archive/v1/Workspace Shell.dc.html line 58) and the duration/easing/iteration from every one of its own call sites ("animation:caretblink 1s steps(1,end) infinite") — not a new value, the same "wire up a named-but-unused motion token" move `shimmer` and `sweepline` themselves already went through for earlier tickets.',
    'The repo\'s existing generic reduced-motion rule (packages/tokens/build.mjs, every `[class*="animate-"]` element) freezes an animation at its own 100% keyframe, which is the wrong frame for both animations this component is the first to consume: `sweepline`\'s 100% frame is fully translated past the track (invisible, not "a static amber segment"), and `caretblink`\'s is opacity .12 (nearly invisible, not "the caret stays lit") — both phrases are the Motion foundation\'s own pre-existing accessibilityNotes promise ("Reduced motion is honoured"), not new language invented here. `sweepline` and `caretblink` now carry their own more specific reduced-motion override in `ANIMATIONS` (a `reducedMotion` field, emitted as its own rule after the generic one) rather than relying on the generic freeze — this entry\'s own "Reduced motion" accessibility note is the first to actually need the distinction.',
    'The Variants section\'s own closing paragraph ("There is no spinner in this system...") becomes `variantsNote`, the same role the field plays for Empty state\'s own closing paragraph about its omitted error/illustrated variants.',
    'Usage\'s "use something else when" row third item ("The work finished and failed — that is an inline error with a retry.") is not modeled as a `useInstead` row: like Empty state\'s own identical-shaped flagged item, no "inline error" component exists or is planned in docs/prd.md §5.1\'s inventory, and `UsageSchema.useInstead` requires a resolvable `target` id. Kept verbatim here rather than inventing one; flagged for Cory in case it becomes its own ticket.',
    'Skeleton ships as a composition primitive — a `children` slot plus an exported `LoadingSkeletonLine` bar — rather than a fixed row shape, because the Do/Don\'t contrast this entry itself draws ("A skeleton in the exact geometry of the rows" vs. "Generic grey slabs") is about matching geometry the component cannot know in advance. The same reasoning Empty state\'s own `EmptyStateIcon` extractionNotes already gave for shipping a dedicated sub-export rather than a single hardcoded shape.',
    'Relationship kinds: `progress` and `empty-state` are `contrasts-with` — Empty state\'s own existing `contrasts-with` relationship back to `loading` (LDS-024) is kept symmetric here. `table` is `composes-with`, since Table\'s own two loading presentations (skeleton rows, row-caret refresh) are this component used inside another, not a substitute for it.',
    'The Do/Don\'t grid\'s six example ids/titles ("good-namedphase", "bad-spinner", etc.) are short paraphrases of their own caption sentences — titles are not present in the source markup for this section, the same precedent Empty state\'s own Do/Don\'t example ids/titles already set.',
    '`good-rowcaret`\'s specimen ("AUT·02 // SYNCING" with a caret, data staying in place) and `bad-replacedata`\'s counter-example (rows losing their data to plain skeleton bars on refresh) are both written against the Inline caret variant\'s own documented use ("a table row mid-refresh") rather than against Table\'s own content entry, since Table (packages/content/src/entries/components/table.ts) remains a draft stub with no row anatomy of its own yet to extract from.',
  ],
});
