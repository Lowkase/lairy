import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/badge/examples";

/**
 * Badges, extracted from archive/v1/Workspace Shell.dc.html (template
 * 6381–6647, logic constants `badgeTones` 15704 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on "Chip" in the opening boundary sentence is dropped as
 * markup, not content. See extractionNotes for every place structured
 * metadata was added, a literal had no clean token, or the prototype's own
 * documented list and the shipped component disagree.
 */
export const badge = ComponentEntrySchema.parse({
  meta: {
    id: "badge",
    name: "Badges",
    section: "components",
    status: "stable",
    version: "1.2.0",
    updated: "2026-10-01",
  },
  purpose:
    "A small, square, system-assigned label stating a standing condition on a row. The operator cannot dismiss it.",
  description: {
    summary: "A badge is a static label that reports the state of the thing it sits beside.",
    boundary:
      "It is assigned by the system, never by the operator, and it is never clickable. The moment a badge can be pressed, filtered or dismissed it has become a Chip and belongs on that page instead. This is the one rule that keeps the two apart — everything below follows from it.",
  },
  anatomy: [
    {
      number: "1",
      name: "Container",
      description:
        "1px hairline, 2px radius, transparent fill. Never a solid block — filled badges compete with buttons.",
    },
    {
      number: "2",
      name: "Label",
      description: "10.5px, uppercase, .12em tracking. One word where possible, two at most.",
    },
    {
      number: "3",
      name: "Padding",
      description: "2px vertical, 8px horizontal. Fixed — badges never grow to fill a column.",
    },
    {
      number: "4",
      name: "Parent",
      description: "The row, card or title the badge annotates. A badge never floats free of one.",
    },
  ],
  anatomyCaption:
    "Each part takes one edge of the frame, and every leader is a single straight line landing square on the target. Positions are measured from the artifact, so the diagram stays true at any size and scales to denser components.",
  variants: [
    {
      name: "Neutral",
      tokens: ["mute", "border"],
      description: "Classification with no judgement attached — origin, type, owner.",
    },
    {
      name: "Info",
      tokens: ["accent-2", "accent-2-line"],
      description: "A fact worth noticing that needs no response.",
    },
    {
      name: "Success",
      tokens: ["accent", "accent-line"],
      description: "A good terminal state — passed, approved, running.",
    },
    {
      name: "Fail",
      tokens: ["alarm", "alarm-line"],
      description: "A bad terminal state. The only badge that may sit alone in a row.",
    },
  ],
  variantsNote:
    "There is no Warning tone. A state is either fine, notable, or broken — a fourth degree of alarm gets ignored along with the third.",
  usage: {
    useWhen: [
      "The state is assigned by the system and the operator cannot change it directly.",
      "The state belongs to something else on screen — a row, a card, a title.",
      "It matters at a glance, scanned rather than read.",
      "The vocabulary is closed: a fixed set of words, not free text.",
    ],
    useInstead: [
      {
        target: "chip",
        text: "It can be clicked, toggled or removed — that is a Chip.",
      },
      {
        target: "toast",
        text: "It announces an event that just happened — that is a Toast.",
      },
      {
        target: "progress",
        text: "It reports a quantity moving over time — that is Progress.",
      },
    ],
  },
  contentRules: [
    { text: "Uppercase, 10.5px, .12em tracking. Never sentence case." },
    {
      text: 'One word wherever the language allows. Two is the ceiling; "PENDING REVIEW" is the longest badge in the system.',
    },
    { text: 'State, not instruction. "FAILED", never "FIX THIS".' },
    {
      text: "No punctuation, no ellipsis, no counts inside the label — a count is its own component.",
    },
    {
      text: 'The same state uses the same word everywhere. "LIVE" is never also "ACTIVE" or "RUNNING".',
    },
  ],
  propGuidance: [
    {
      prop: "tone",
      note: "Match the tone to the state it reports, not to how urgent the writer feels — the same state uses the same word and tone everywhere (Content rule 5).",
    },
    {
      prop: "children",
      note: 'State, not instruction — "FAILED", never "FIX THIS" (Content rule 3).',
    },
  ],
  examples: [
    {
      id: "neutral",
      kind: "demo",
      title: "Neutral",
      source: `${EXAMPLES_DIR}/neutral.tsx`,
    },
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
      id: "fail",
      kind: "demo",
      title: "Fail",
      source: `${EXAMPLES_DIR}/fail.tsx`,
    },
    {
      id: "good-inline",
      kind: "good",
      title: "Badge beside its title",
      caption: "Badge annotates its parent, on the same baseline as the title.",
      source: `${EXAMPLES_DIR}/good-inline.tsx`,
    },
    {
      id: "bad-stack",
      kind: "bad",
      title: "Three badges stacked",
      caption: "Never stack badges — if a row needs three, the row needs a column instead.",
      source: `${EXAMPLES_DIR}/bad-stack.tsx`,
    },
    {
      id: "good-short",
      kind: "good",
      title: "One-word label",
      caption: "One word, uppercase, no punctuation.",
      source: `${EXAMPLES_DIR}/good-short.tsx`,
    },
    {
      id: "bad-long",
      kind: "bad",
      title: "A sentence as a label",
      caption: "Never a sentence. Badges are read at a glance, not parsed.",
      source: `${EXAMPLES_DIR}/bad-long.tsx`,
    },
    {
      id: "good-word",
      kind: "good",
      title: "Colour plus word",
      caption: "Colour plus word. The word carries the meaning on its own.",
      source: `${EXAMPLES_DIR}/good-word.tsx`,
    },
    {
      id: "bad-dotonly",
      kind: "bad",
      title: "Colour alone",
      caption: "Never colour alone — a bare dot is unreadable to a third of operators.",
      source: `${EXAMPLES_DIR}/bad-dotonly.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Not focusable",
      body: "A badge takes no tabindex and no role. It is text inside its parent, so a screen reader announces it as part of the row rather than as a separate stop.",
    },
    {
      title: "Never colour alone",
      body: "Every badge carries a word. Tone reinforces the word; it never replaces it. This is what keeps the four tones legible under deuteranopia.",
    },
    {
      title: "Contrast",
      body: "All four tones clear 4.5:1 against --panel in both themes. Fail is the tightest at 4.6:1 in light — do not tint it further.",
    },
    {
      title: "Reading order",
      body: 'The badge follows the title it modifies in source order, so the announcement reads "Normalize step, failed" rather than "failed, Normalize step".',
    },
  ],
  tokens: [
    { tokens: ["mute", "border"], usage: "Neutral tone" },
    { tokens: ["accent-2", "accent-2-line"], usage: "Info tone" },
    { tokens: ["accent", "accent-line"], usage: "Success tone" },
    { tokens: ["panel"], usage: "Assumed backdrop for contrast" },
  ],
  relationships: [
    {
      target: "chip",
      kind: "contrasts-with",
      text: "Interactive and user-owned. If it can be clicked, filtered or dismissed, it is a chip.",
    },
    {
      target: "toast",
      kind: "often-confused-with",
      text: "Same four intents, but transient and system-initiated. A badge persists; a toast interrupts.",
    },
    {
      target: "progress",
      kind: "alternative",
      text: "Use when the state is a quantity over time rather than a name.",
    },
  ],
  changelog: [
    {
      version: "1.2.0",
      date: "2026-08-16",
      text: "Tones realigned to the four Toast intents. Info moved to Ice.",
    },
    {
      version: "1.1.0",
      date: "2026-08-15",
      text: "Container radius locked to 2px with the system-wide sharp lock.",
    },
    {
      version: "1.0.0",
      date: "2026-08-11",
      text: "Initial release — four tones, label format only.",
    },
  ],
  extractionNotes: [
    'Relationship `kind` is new structured metadata (callout.ts set this precedent): Chip is `contrasts-with` (non-interactive vs. interactive, the one rule the whole entry opens on); Toast is `often-confused-with` per its own Related-card text ("Same four intents"); Progress is `alternative` per its own Related-card text ("Use when the state is a quantity over time"). Flagged for review.',
    "Fail's tone is the prototype's one literal colour in this entry: `col`/`tok` is the bare hex `#ff8f6b` and `bd` is `rgba(255,143,107,.45)` (badgeTones, archive/v1/Workspace Shell.dc.html:15708), not a themed CSS variable. Per docs/prd.md §8.1 and AGENTS.md rule 4 this is `--alarm`; the border alpha (.45) doesn't exactly match the consolidated `--alarm-line` (.4) but is the same role at materially the same opacity, so it maps there rather than becoming a new named alpha. The prototype's own badgeTokens \"consumed\" list (archive/v1/Workspace Shell.dc.html:15737) omits Fail/alarm entirely even though the rendered component uses it — kept as the fourth row above is missing alarm verbatim, rather than inventing a token row the prototype's own list doesn't have.",
    "Anatomy #2's \"10.5px\" and #3's \"2px vertical, 8px horizontal\" are kept verbatim in prose per ADR-0009; the shipped component (packages/ui/src/badge/badge.tsx) maps 10.5px to Micro (11px, docs/prd.md §8.2's default mapping \"10.5 → Micro\" — the hard floor AGENTS.md rule 6 sets) and 2px vertical padding, which sits below the spacing ramp's lowest step, to the ramp's floor (Space-4) rather than inventing a smaller step (AGENTS.md rule 1); 8px horizontal is already a ramp step and needed no change. Flagged for the token decisions backlog the same way button.ts's own 9px/16px padding note was.",
    'The "use something else when" row "It stands alone with nothing to annotate — it needs a parent, or it is a heading" (archive/v1/Workspace Shell.dc.html:6477) has no component to target and is dropped from `usage.useInstead`, which requires a real entry id (docs/build-guide.md §3) — captured instead by Anatomy #4 ("Parent") and the Accessibility "Reading order" note, both of which already say a badge never floats free of one.',
    "Toast and Chip stub entries use CONTEXT.md's own glossary sentence as their `purpose`, verbatim (card.ts's own extractionNotes set this precedent). Progress has no glossary entry, so its stub `purpose` is paraphrased from this entry's own Related-card sentence about it — flagged, pending Progress' own ticket.",
    "`propGuidance` (LDS-009) has no prototype counterpart — the prototype never documented a JS API. Its two notes on `tone` and `children` paraphrase this entry's own Content rules 5 and 3 rather than being extracted verbatim from anywhere.",
    "Accessibility \"Contrast\" claims all four tones clear 4.5:1 against --panel, Fail at 4.6:1 (archive/v1/Workspace Shell.dc.html:15734) — kept verbatim per ADR-0009, but not what the shipped component does: axe measures bare --alarm text at 2.03:1 against --bg in the light theme (apps/docs/e2e/badge.spec.ts), the same gap already documented in packages/content/src/entries/tokens/alarm.ts's --alarm-ink rationale and already routed around by button.tsx's Danger variant. Fail's label (packages/ui/src/badge/badge.tsx) renders in --fg instead, same fix as Danger's — the alarm-line border alone carries the tone, and the word carries the meaning regardless of its own colour (this entry's own \"Never colour alone\" note). Flagged for the token decisions backlog.",
    "Success gets the same treatment as Fail (LDS-049, #137): the prototype's Success label is bare --accent, which measures 4.42:1 on --panel in the light theme (axe, the Badge docs page), short of the 4.5:1 AA floor. The shipped label renders in --fg and the accent-line border carries the tone, with the word still carrying the meaning. Flagged for the token decisions backlog alongside the other --accent text notes (tabs.ts, main-rail.ts, subnav.ts, header.ts).",
  ],
});
