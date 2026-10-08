import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/toast/examples";

/**
 * Toast, extracted from archive/v1/Workspace Shell.dc.html (template
 * 11333–11647, logic constants `toAnatomy` 16287 onward, `toastKindData()`
 * 15272, the live "SYSTEM OVERLAYS" toast markup ~13527) per
 * docs/build-guide.md §3. Replaces the draft stub Callout (LDS-005)
 * created so its `often-confused-with` relationship had a target; the stub's
 * `purpose` was CONTEXT.md's glossary sentence and still is. Prose is
 * verbatim (ADR-0009); inline `<span>` colour styling on "Modal" in the
 * opening boundary sentence and in the Usage rows is dropped as markup, not
 * content. See extractionNotes for every place structured metadata was
 * added, a literal had no clean token, or the shipped component departs
 * from the prototype.
 */
export const toast = ComponentEntrySchema.parse({
  meta: {
    id: "toast",
    name: "Toast",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-25",
  },
  purpose: "A transient message reporting that something just happened. It says so once and leaves.",
  description: {
    summary: "A toast reports what just happened, in the corner, and leaves on its own.",
    boundary:
      "It is the cheapest surface in the system: it takes no focus, blocks nothing, and asks for nothing. That is also its limit — anything the operator must read or answer cannot be a toast, because it will be gone in 3.2 seconds and it was never in their way. A decision belongs in a Modal; a standing condition belongs in the panel that owns it, not in a corner that empties itself.",
  },
  anatomy: [
    {
      number: "1",
      name: "Surface",
      description:
        "A 320px --bg card with a hairline in the intent colour, docked to the top right under the header and sliding in over 180ms. It sits on --bg rather than --panel so it reads as being in front of the workspace without a shadow doing the work.",
    },
    {
      number: "2",
      name: "Rail",
      description:
        "A 2px bar down the left edge in the intent colour. This is the intent, and the only place it is allowed to be a fill: two pixels of colour is enough to sort four kinds of message at a glance.",
    },
    {
      number: "3",
      name: "Title",
      description:
        "The outcome in 14px --fg, past tense, five to seven words: “Workflow approved”, “Run failed”. If the operator reads nothing else, this line has to be the whole message.",
    },
    {
      number: "4",
      name: "Dot",
      description:
        "A 7px disc in the intent colour beside the title, repeating what the rail says. It is deliberate redundancy: the rail is easy to miss at the edge of vision, and colour must never be the only carrier.",
    },
    {
      number: "5",
      name: "Detail",
      description:
        "One 11.5px --mute line for the consequence — counts, durations, what happens next. Optional, never more than a line, and never the place the actual news lives.",
    },
  ],
  anatomyCaption:
    "The success intent at production size. Each part takes one edge and every position is measured from the artifact.",
  variants: [
    {
      name: "Success",
      tokens: ["accent", "accent-line"],
      description:
        "Something the operator asked for finished. Amber, because success here means an action completed — this is the one report that shares the acting colour.",
    },
    {
      name: "Fail",
      tokens: ["alarm", "alarm-line"],
      description:
        "Something stopped and will not finish. It does not auto-dismiss, and it may carry one amber link to where the operator can look — never a decision.",
    },
    {
      name: "Info",
      tokens: ["accent-2", "accent-2-line"],
      description:
        "A fact the system wants on the record: a schedule, a queue position, a sweep. Ice, because it refers to something rather than acting on it.",
    },
    {
      name: "Neutral",
      tokens: ["mute", "border"],
      description:
        "A routine confirmation with no colour claim at all — saved, copied, closed. Most toasts should be this one; reaching for a colour is a decision, not a default.",
    },
  ],
  variantsNote:
    "There is no Warning intent, for the same reason there is no warning badge: a caution nobody has to act on is noise, and one they do have to act on is a failure or a modal. Intent is carried by a 2px rail and a dot — never by a filled background, which would make a corner report louder than the work behind it.",
  usage: {
    useWhen: [
      "Something finished and the operator would otherwise not know.",
      "The outcome is worth a sentence but not worth their attention.",
      "The result arrived out of band — a background run, a sync, a queue.",
      "Missing the message costs nothing, because the state is legible elsewhere.",
    ],
    useInstead: [
      { target: "modal", text: "The operator has to decide something — that is a Modal." },
      {
        target: "callout",
        text: "The message must survive being missed — that belongs in the panel that owns the state.",
      },
      { target: "badge", text: "It annotates a row or a field — that is a Badge or an inline error." },
      { target: "progress", text: "Work is still running — that is Progress, which stays until it finishes." },
    ],
  },
  contentRules: [
    {
      text: "Write the title as an outcome in the past tense — “Workflow approved”, not “Approving workflow” or “Success!”. The event already happened; that is why there is a toast.",
    },
    {
      text: "Name the object, not the operation: “3 runs exported” beats “Export complete”, because the number is what the operator was actually waiting on.",
    },
    {
      text: "Keep the detail line to one clause of consequence, and drop it entirely when the title already says everything.",
    },
    {
      text: "Never put a question, a form, or two competing actions in a toast. One link to somewhere the operator can look is the maximum.",
    },
    {
      text: "Collapse repeats of the same event into one counted message rather than firing a second toast — the count is the news the second time.",
    },
  ],
  propGuidance: [
    {
      prop: "intent",
      note: "Neutral is the default, and most toasts should be it (Variants “Neutral”). Reaching for a colour is a decision; Fail is the only intent that never auto-dismisses.",
    },
    {
      prop: "title",
      note: "The outcome in the past tense (Content rule 1), naming the object (Content rule 2).",
    },
    {
      prop: "detail",
      note: "One clause of consequence, or omit it (Content rule 3) — never the place the news lives (Anatomy “Detail”).",
    },
    {
      prop: "action",
      note: "At most one link to somewhere the operator can look (Content rule 4); a decision cannot be an action here.",
    },
  ],
  examples: [
    { id: "demo", kind: "demo", title: "Fire one", source: `${EXAMPLES_DIR}/demo.tsx` },
    { id: "variants", kind: "demo", title: "Four intents", source: `${EXAMPLES_DIR}/variants.tsx` },
    {
      id: "good-outcome-and-rail",
      kind: "good",
      title: "Outcome, consequence, rail",
      caption: "Outcome in the title, the consequence underneath, and a rail carrying the intent.",
      source: `${EXAMPLES_DIR}/good-outcome-and-rail.tsx`,
    },
    {
      id: "bad-filled-background",
      kind: "bad",
      title: "A filled surface",
      caption:
        "Never fill the surface with the intent colour — a corner report outshouting the workspace is a lie about its importance.",
      source: `${EXAMPLES_DIR}/bad-filled-background.tsx`,
    },
    {
      id: "good-failure-link",
      kind: "good",
      title: "A failure with one link",
      caption:
        "A failure may carry one amber link to where the operator can look — and it does not auto-dismiss.",
      source: `${EXAMPLES_DIR}/good-failure-link.tsx`,
    },
    {
      id: "bad-question",
      kind: "bad",
      title: "A question in a toast",
      caption:
        "Never ask a question in a toast — it takes no focus and leaves on a timer, so the answer is whatever the timeout chose.",
      source: `${EXAMPLES_DIR}/bad-question.tsx`,
    },
    {
      id: "good-collapsed-repeat",
      kind: "good",
      title: "A counted repeat",
      caption: "Repeats of the same event collapse into one counted toast rather than a stack.",
      source: `${EXAMPLES_DIR}/good-collapsed-repeat.tsx`,
    },
    {
      id: "bad-stacked-repeats",
      kind: "bad",
      title: "The same event, stacked",
      caption:
        "Never stack past three, and never repeat one event — a column of toasts is a queue nobody asked to read.",
      source: `${EXAMPLES_DIR}/bad-stacked-repeats.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Announced, never focused",
      body: "The container is an aria-live region — polite for success, info and neutral, assertive for failures — and focus never moves into it. A toast that steals focus takes the operator out of the field they were typing in.",
    },
    {
      title: "The timer is not the only way",
      body: "Auto-dismiss is 3.2s, paused on hover and on keyboard focus anywhere inside, and failures do not dismiss at all. Anything that matters after the timer is also legible in the panel that owns it.",
    },
    {
      title: "Colour is never alone",
      body: "Intent is the rail, the dot and the words together — “Run failed” says what the colour says. Salmon on --bg measures 6.2:1 and ice 5.9:1, but neither is asked to carry the meaning by itself.",
    },
    {
      title: "Dismiss is reachable",
      body: "The ✕ is a real button labelled “Dismiss”, 26px and reachable by Tab while the toast is up. Escape clears the whole stack, so a keyboard operator is never stuck waiting out a timer.",
    },
  ],
  tokens: [
    { tokens: ["bg"], usage: "Toast surface" },
    { tokens: ["accent", "accent-line"], usage: "Success rail and dot, action links" },
    { tokens: ["accent-2", "accent-2-line"], usage: "Info rail and dot" },
    { tokens: ["mute"], usage: "Neutral rail, detail line, dismiss glyph" },
    { tokens: ["border"], usage: "Neutral hairline" },
    { tokens: ["fg"], usage: "Title" },
    { tokens: ["alarm", "alarm-line"], usage: "Fail rail, dot and hairline" },
  ],
  relationships: [
    {
      target: "modal",
      kind: "often-confused-with",
      text: "Where anything that needs an answer goes. The test is simple: if the message would be a problem to miss, it was never a toast.",
    },
    {
      target: "progress",
      kind: "composes-with",
      text: "Covers the time before the toast. Progress stays while work runs; the toast is the one line that reports how it ended.",
    },
    {
      target: "badge",
      kind: "alternative",
      text: "Where a standing condition belongs. A toast reports a transition once; a badge keeps saying what is true.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-25",
      text: "Warning intent ruled out; failures no longer auto-dismiss; repeats collapse into one counted toast.",
    },
    {
      version: "1.0.1",
      date: "2026-08-20",
      text: "Filled backgrounds replaced by the 2px rail and dot; stack capped at three.",
    },
    {
      version: "1.0.0",
      date: "2026-08-13",
      text: "Toast introduced top right at 320px with a 3.2s dismiss.",
    },
  ],
  extractionNotes: [
    "Replaces the draft stub Callout (LDS-005) created. The stub's `purpose` was CONTEXT.md's own glossary sentence and is kept as `purpose`; the opening sentence of the page is `description.summary`.",
    "Usage \"use something else when\": each row becomes a typed `useInstead` item. Modal (`modal`), Badge (`badge`) and Progress (`progress`) are named in the prose. The second row (\"The message must survive being missed — that belongs in the panel that owns the state.\") names no component; it is mapped to Callout (`callout`), the component that reports a standing condition inside the panel it belongs to, so the row has a target. The text is verbatim. Flagged for review. The prototype's \"Badge\" and \"Progress\" rows say \"Badge\"/\"Progress\" while its Related cards say \"Badges\"/\"Progress\" — kept as written.",
    "Relationship `kind` is new structured metadata; the prototype's Related cards carry no tag. Modal is `often-confused-with` (the mirror of Modal's own Toast card, same call); Progress is `composes-with` (it hands off to the toast when the count reaches the total); Badge is `alternative` (\"Where a standing condition belongs\"). Callout's `often-confused-with` link to Toast is reverse-only and has no Related card here, as the prototype's three cards do not include it. Flagged for review.",
    "Variants: the prototype's intents table has a `tk` column (\"--accent rail\", \"#ff8f6b rail\") and a literal salmon hex. The `tokens` arrays carry the real token names; the hex `#ff8f6b` is `--alarm` (and its hairline `rgba(255,143,107,.45)` is `--alarm-line`, which is .4). The prototype's `tokens` rows say \"#ff8f6b\"; carried as `alarm` and `alarm-line`. Intent names follow the prototype's table (Success, Fail, Info, Neutral); the live specimen's internal id `error` for Fail is not carried.",
    "Size and spacing literals in prose are kept verbatim (ADR-0009; the same choice select-multi.ts made) and mapped to tokens in the shipped component: the 320px card → new component token `--toast-width`; the live overlay's `top: 78px` (the 52px header plus 26px) → new `--toast-top`; the 24px right offset → Space-22 (`right-22`); the card's 14px/46px/18px padding → Space-12 / Space-44 / Space-18; the 12px gap → Space-12; the 7px dot → Space-8 (a tie between 6 and 8, resolved to the stronger); its 6px nudge → Space-6; the 26px dismiss box → Space-22 and its 7px inset → Space-6 (26 is a tie between 22 and 32, resolved to 22 — so the dismiss target is smaller than the 26px the Accessibility prose names; flagged); the 2px rail is `border-l-2` on the border-width scale; the 2px title/detail gap → Space-4; the 14px title → Body (`text-body`); the 11.5px detail line → Micro (11px, the type floor); the 17px ✕ glyph → Body. The gap between stacked toasts (not specified by the prototype) is Space-8.",
    "Prose says the surface slides in \"over 180ms\"; the prototype's own live markup uses `riseIn .28s cubic-bezier(.4,0,.2,1)`, and the existing token `--animate-rise-in` already carries it as the toast entrance (280ms). The shipped component uses the token, so the entrance is 280ms, not 180ms. Contradictory text kept verbatim, flagged.",
    "The 3.2-second dismiss is a new component token `--toast-dismiss-after` (3200ms): it is a reading time, not a transition, so it has no place on the Motion scale. Proposed as-is, flagged for the token decisions backlog.",
    "Elevation: the card uses `shadow-menu` (`0 22px 60px rgba(0,0,0,.45)`), the exact shadow the prototype's live toast markup sets. The anatomy prose says the card sits on --bg \"without a shadow doing the work\"; the shadow is kept because the live specimen has it. Flagged.",
    "The Fail \"amber link\" ships as `text-accent` uppercase Micro text. Whether --accent text on the light theme's --bg clears AA at Micro size is checked by the Playwright axe test on the dev route.",
    "No shadcn `sonner` was added, though the ticket names it as the counterpart: sonner owns its own timers, ordering and markup, and could not give this spec's per-toast assertive/polite live regions, pause-on-focus-within, Escape-clears-stack, failures that never dismiss, collapse of repeats into a counted toast or a stack of exactly three without overriding most of it — build guide §4 step 3 would then replace its styling and anatomy wholesale. The component is plain elements plus a small module-level store (`toast()` / `toast.fail()` / `dismissToast()` and a `<Toaster />` mounted once). Flagged for review: if sonner is wanted regardless, that is a decision for the PR.",
    "Repeat collapse is by identical intent and title: a second `toast.success({ title: \"3 runs exported\" })` increments a visible “×N” on the existing toast and restarts its timer. The “×N” is component UI, not prototype prose; the prototype's specimen instead shows the detail line \"Grouped from 3 messages\", which the `good-collapsed-repeat` example reproduces.",
    "Accessibility “Announced, never focused”: the prototype describes one container that is an aria-live region. The shipped stack is a labelled region (`aria-label=\"Notifications\"`) holding one toast per live region — `role=\"status\"` for success, info and neutral, `role=\"alert\"` for failures — so each toast carries its own politeness, exactly as the prose requires. Focus never moves on arrival. Hover and keyboard focus anywhere inside a toast pause its timer; leaving resumes it. Escape clears the whole stack.",
    "The States section is empty: the prototype's Toast page has no States table.",
    "The prototype's Do/don't section is six tiles in three pairs. Each ✓ tile is a good example and each ✕ tile a bad one. The prototype's third-pair bad tile is three `1 run exported` rows; the second-pair bad tile is a question with DELETE/CANCEL actions; both are rendered with plain elements, since `Toast` deliberately has no way to produce them. The `variants` and `demo` examples have no Do/don't counterpart.",
    "The shipped component needs `\"use client\"` (the store hook, timers), the same precedent select.tsx set; the registry item copies the directive out verbatim.",
  ],
});
