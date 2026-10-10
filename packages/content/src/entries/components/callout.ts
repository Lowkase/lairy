import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/callout/examples";

/**
 * Callout, extracted from archive/v1/Workspace Shell.dc.html (template
 * 11648–11887, logic calloutDocs() 14561) per docs/build-guide.md §3.
 * Prose is verbatim (ADR-0009); inline `<span>` colour styling on "Toast"
 * and "Modal" in the opening boundary sentence is dropped as markup, not
 * content. See extractionNotes for every place structured metadata (token
 * lists, relationship kinds) was added rather than lifted directly.
 */
export const callout = ComponentEntrySchema.parse({
  meta: {
    id: "callout",
    name: "Callout",
    section: "components",
    status: "stable",
    version: "1.0.0",
    updated: "2026-09-18",
  },
  purpose: "Reports a standing condition inside the panel or flow it belongs to.",
  description: {
    summary:
      "A Callout reports a standing condition inside the panel or flow it belongs to, and stays until the operator acts on it or clears it.",
    boundary:
      "It is Toast’s persistent counterpart: where a toast reports what just happened and leaves on its own in 3.2 seconds, a Callout stays exactly because the condition it names is still true. That is also the line against Modal — a Callout never blocks the rest of the page, and if the operator must answer before doing anything else, the message needed a modal, not a card.",
  },
  anatomy: [
    {
      number: "1",
      name: "Icon",
      description:
        "Names the tone at a glance, in the tone’s own colour. It is the fastest thing in the card to scan and the only place shape (not just colour) carries the tone — info, success, warning and error each get a distinct glyph.",
    },
    {
      number: "2",
      name: "Title",
      description:
        "One short line stating the fact or outcome. It sits beside the icon, never above or below it, so the two read as a single unit before the body is reached at all.",
    },
    {
      number: "3",
      name: "Body",
      description:
        "One to two sentences of context in --dim. This is where the detail an operator needs actually lives — the title is the headline, the body is the story.",
    },
    {
      number: "4",
      name: "Actions",
      description:
        "Zero, one or two buttons — at most one of them primary. Optional by design: an info or success callout often has nothing to do about it and should carry none.",
    },
  ],
  anatomyCaption:
    "The Success tone at production size. Each part takes one edge and every position is measured from the artifact.",
  variants: [
    {
      name: "Info",
      tokens: ["accent-2", "accent-2-line"],
      description:
        "A fact worth putting on the record — a schedule, a queue position, a setting that changed. Ice, because it refers to something rather than asking for anything.",
    },
    {
      name: "Success",
      tokens: ["accent", "accent-line", "accent-soft"],
      description:
        "A completed check or a ready result — the one tone allowed the acting colour, and only because what it reports is itself an outcome, not a pending decision.",
    },
    {
      name: "Warning",
      tokens: ["alarm", "alarm-line"],
      description:
        "Something worth knowing about that has not yet broken. The tone Toast intentionally has none of — a warning that must stay visible is exactly the case a self-dismissing corner message cannot serve.",
    },
    {
      name: "Error",
      tokens: ["alarm", "alarm-soft"],
      description:
        "Something stopped and needs a decision. The same colour as Warning, one step darker and filled — intensity carries the escalation, not a new hue.",
    },
  ],
  variantsNote:
    "There is no Neutral tone here the way Toast has one — a Callout that claims no colour at all reads as unfinished, since it always sits inside a panel that already supplies neutral chrome.",
  usage: {
    useWhen: [
      "A condition is standing, not momentary — it should still be true if the operator looks back in five minutes.",
      "The message belongs inside the panel or flow it is about, not floating over everything.",
      "Zero, one or two actions are enough to resolve or acknowledge it.",
    ],
    useInstead: [
      {
        target: "toast",
        text: "The news is transient and does not need to persist — that is a Toast.",
      },
      {
        target: "modal",
        text: "The operator must answer before doing anything else — that is a Modal.",
      },
      {
        target: "badge",
        text: "The fact is a small, permanent label on a row — that is a Badge, not a card.",
      },
    ],
  },
  contentRules: [
    { text: 'Title the fact, not the feeling — "Export failed", never "Uh oh!" or "Something went wrong."' },
    { text: "Keep the body to one or two sentences. If it needs a third, it is a panel, not a callout." },
    {
      text: 'Name what happens if the operator does nothing, when that matters — "No action required yet" is doing real work above.',
    },
    {
      text: "At most one action reads as primary. A second action, if present, is always the lesser one — dismiss, view, cancel.",
      enforceable: { kind: "validator", id: "callout-single-primary-action" },
    },
    {
      text: "Match the tone to the state, not to how urgent the writer feels — a routine reminder is Info even in a stressful week.",
    },
  ],
  propGuidance: [
    {
      prop: "tone",
      note: "Match the tone to the state, not to how urgent the writer feels (Content rule 5).",
    },
    {
      prop: "actions",
      note: "At most one action reads as primary — the first item in the array (Content rule 4).",
    },
  ],
  examples: [
    {
      id: "info",
      kind: "demo",
      title: "Info",
      source: `${EXAMPLES_DIR}/info.tsx`,
    },
    {
      id: "success",
      kind: "demo",
      title: "Success",
      source: `${EXAMPLES_DIR}/success.tsx`,
    },
    {
      id: "warning",
      kind: "demo",
      title: "Warning",
      source: `${EXAMPLES_DIR}/warning.tsx`,
    },
    {
      id: "error",
      kind: "demo",
      title: "Error",
      source: `${EXAMPLES_DIR}/error.tsx`,
    },
    {
      id: "good-title",
      kind: "good",
      title: "Fact-based title",
      caption:
        "Title states the fact plainly. An operator scanning the panel knows exactly what happened without reading the body.",
      source: `${EXAMPLES_DIR}/good-title.tsx`,
    },
    {
      id: "bad-title",
      kind: "bad",
      title: "Feelings-first title",
      caption:
        "A feelings-first title and casual body read as unfinished copy, not a system report — name the fact, not the reaction to it.",
      source: `${EXAMPLES_DIR}/bad-title.tsx`,
    },
    {
      id: "good-actions",
      kind: "good",
      title: "One action",
      caption:
        "One action, unstyled as secondary since nothing here is urgent enough to demand a primary button.",
      source: `${EXAMPLES_DIR}/good-actions.tsx`,
    },
    {
      id: "bad-actions",
      kind: "bad",
      title: "Two actions, no primary",
      caption:
        "Two actions with no clear primary compete for attention — a warning this routine should offer at most one way forward.",
      source: `${EXAMPLES_DIR}/bad-actions.tsx`,
    },
    {
      id: "good-tone",
      kind: "good",
      title: "Error tone on a failure",
      caption: "Error tone on a run that stopped and needs a decision. Colour, icon and copy all agree.",
      source: `${EXAMPLES_DIR}/good-tone.tsx`,
    },
    {
      id: "bad-tone",
      kind: "bad",
      title: "Success tone on a failure",
      caption:
        "The same failure in the Success tone — amber and a checkmark on a message that says nothing finished. Tone must match the state, not the writer’s mood.",
      source: `${EXAMPLES_DIR}/bad-tone.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Role by tone",
      body: 'Warning and Error carry role="alert" so assistive tech announces them on arrival. Info and Success carry role="status", announced politely without interrupting.',
    },
    {
      title: "Colour never alone",
      body: 'Every tone pairs its colour with a distinct icon shape and states its own severity in words — "Retry" and "no action required yet" carry the finding on their own.',
    },
    {
      title: "Focus order",
      body: "Actions are reachable by keyboard in the order shown, primary first. A dismiss control, when present, is always last in the tab order.",
    },
    {
      title: "Never auto-dismissed",
      body: "Unlike Toast, a Callout never times out on its own — if it should disappear by itself, it was a Toast to begin with.",
    },
  ],
  tokens: [
    { tokens: ["accent-2"], usage: "Info icon and title." },
    {
      tokens: ["accent", "accent-line", "accent-soft"],
      usage: "Success icon, title and fill — the one tone sharing the acting colour.",
    },
    { tokens: ["alarm", "alarm-line"], usage: "Warning icon and border at reduced opacity, no fill." },
    {
      tokens: ["alarm", "alarm-soft"],
      usage: "Error icon, border and a low-opacity fill — the same hue as Warning, one step stronger.",
    },
    { tokens: ["dim"], usage: "Body text across every tone." },
  ],
  relationships: [
    {
      target: "toast",
      kind: "often-confused-with",
      text: "The transient counterpart. Reach for Toast when the message should be gone in a few seconds on its own.",
    },
    {
      target: "modal",
      kind: "contrasts-with",
      text: "Where a Callout escalates once a decision must block everything else on the page.",
    },
    {
      target: "badge",
      kind: "alternative",
      text: "The flat alternative. A one-word status on a row is a badge before it is ever a card.",
    },
    {
      target: "card",
      kind: "composes-with",
      text: "The container a Callout usually sits inside, rather than replaces.",
    },
  ],
  changelog: [
    {
      version: "1.0.0",
      date: "2026-09-18",
      text: "First specification. Named Callout to sit next to Toast without colliding, and given a Warning tone Toast deliberately omits — built from the same accent and #ff8f6b tokens Toast already established, split into two intensities rather than a new hue, to keep the amber-and-one-other-colour rule intact.",
    },
  ],
  extractionNotes: [
    'Relationship `kind` (alternative/composes-with/contrasts-with/often-confused-with) is new structured metadata: the prototype’s Related cards carry no such tag. Toast is `often-confused-with` per the ticket (LDS-005); Badge is `alternative` per its own card text ("The flat alternative"); Modal is `contrasts-with` (blocking vs. never-blocking); Card is `composes-with` (the container Callout sits inside). Flagged for review.',
    "The Tones section's `tokens` arrays reflect the shipped component (packages/ui/src/callout/callout.tsx), not the prototype's own renderCallout(), and don't always match this entry's verbatim `tokens[].usage` / `variants[].description` prose word for word: the shipped Title is always --fg (never tone-coloured), unlike the prototype's docs-page specimens and the Info/Success token-row text (\"icon and title\"); and Warning's icon renders in full --alarm rather than the reduced intensity its token-row text describes. Prose is kept verbatim per ADR-0009; flagged here rather than silently reconciled.",
    "Toast, Modal and Badge stub entries use CONTEXT.md's own glossary sentence as their `purpose`, verbatim. Card has no glossary entry, so its stub `purpose` is paraphrased from this entry's own Related-card sentence about it — flagged, pending Card's own ticket (LDS-022).",
    "New docs-page tokens (--panel, --border, --mute, --faint; the Micro/Body/Section/Doc title type styles; two tracking steps) were added to packages/tokens for this ticket rather than invented inline. Section's leading (1.3) is a harvested, flagged value — docs/prd.md §8.2 leaves this style's leading as \"per prototype\" with no fixed figure.",
    "`propGuidance` (LDS-009) has no prototype counterpart — the prototype never documented a JS API. Its two notes are short annotations on the `tone` and `actions` props, paraphrasing this entry's own Content rules 5 and 4 rather than being extracted verbatim from anywhere; `title` and `children` are left unannotated since their extracted JSDoc descriptions (in packages/ui/src/callout/callout.tsx) already say what's needed.",
    "LDS-018 (Buttons): the Actions anatomy part now renders with the shipped Button component (`<Button variant=\"primary\">` for the first action, `variant=\"secondary\"` for the rest) instead of callout.tsx's own hand-rolled `<button>` markup and per-tone `primaryActionClass`/`SECONDARY_ACTION_CLASS`. Action colour no longer varies with the callout's tone — this also removes the Warning/Error primary action's `--alarm`/`--alarm-ink` fill this file's own code comment had flagged as failing AA in the light theme, in favour of Buttons' own accessible variant styling. `CalloutAction` and the `actions` prop's shape (`{ label, onClick? }`) are unchanged; `good-actions.tsx`/`bad-actions.tsx` and the existing Vitest/Playwright coverage of the action slot needed no changes beyond this swap, since the rendered role, text and click behaviour are identical.",
  ],
});
