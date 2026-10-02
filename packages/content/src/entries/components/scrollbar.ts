import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/scrollbar/examples";

/**
 * Scrollbar, extracted from archive/v1/Workspace Shell.dc.html (template
 * 9100–9309, logic scrollbarDocs() 16964) per docs/build-guide.md §3. Prose
 * is verbatim (ADR-0009). The ticket (LDS-027, GitHub #29) names "scroll-area"
 * as the shadcn counterpart to scaffold from, but the prototype's own
 * opening sentence is explicit: "never a custom-built replacement" — Radix's
 * ScrollArea *is* a custom-built replacement (a JS-managed virtual
 * scrollbar), which is exactly what sbA11y's own "Native, not custom" note
 * rules out. Built instead as a plain `overflow-auto` container with the
 * browser's own scrollbar restyled through its two standard hooks
 * (`::-webkit-scrollbar*`, `scrollbar-color`) — no new dependency, no
 * components.json, no Radix primitive. Flagged for Cory in case the ticket's
 * shadcn naming was meant literally; see extractionNotes for the full
 * reasoning and every token substitution.
 */
export const scrollbar = ComponentEntrySchema.parse({
  meta: {
    id: "scrollbar",
    name: "Scrollbar",
    section: "components",
    status: "stable",
    version: "1.0.0",
    updated: "2026-10-02",
  },
  purpose: "The browser's own scroll control, restyled to two greys — never a custom-built replacement.",
  description: {
    summary: "A scrollbar is the browser's own control, restyled to two greys — never a custom-built replacement.",
    boundary:
      "It exists so any pane that overflows can be scrolled without inventing a new way to do it. That is the boundary against a Progress bar or any other painted indicator: this shell is never drawn by the system, only recoloured — the browser keeps every native behaviour, and the design keeps only the two colours it is allowed to change.",
  },
  anatomy: [
    {
      number: "1",
      name: "Thumb",
      description:
        "A 4px pill inset inside the 10px lane by a 3px transparent border, so it never touches the page edge. --border-2 at rest, --mute on hover — the only two states it has.",
    },
    {
      number: "2",
      name: "Track",
      description:
        "Transparent underneath the thumb, always. It never grows a fill, a hairline, or a hover state of its own — the page edge is the only boundary it needs.",
    },
  ],
  anatomyCaption: "Two parts, one edge. Every leader is a single straight line landing square on the target, measured from the artifact.",
  states: [
    {
      name: "Default",
      description: "Present but quiet — visible enough to find, quiet enough to ignore while reading.",
    },
    {
      name: "Hover",
      description:
        "One step up the grey ramp for as long as the pointer is over the thumb or the track beside it. No transition is timed; the browser owns the swap.",
    },
  ],
  usage: {
    useWhen: ["Any pane, list, or dock column can overflow and the browser already knows how to scroll it."],
    useInstead: [
      {
        target: "progress",
        text: "The value being shown is a quantity, not a scroll position — that is Progress.",
      },
      {
        target: "main-rail",
        text: "The column is the 56px collapsed rail — MainNav hides this control there instead of shrinking it further.",
      },
    ],
  },
  contentRules: [
    {
      text: "Width is fixed at 10px everywhere — content panes, the subnav rail, modals. There is no thin or thick variant to choose between.",
    },
    {
      text: "Radius is 2px, matching the system lock. The thumb never grows a pointed or pill shape of its own.",
    },
    {
      text: "The corner where a vertical and horizontal track meet is always transparent — it never draws a swatch.",
    },
    {
      text: "Firefox gets the same two greys through scrollbar-color rather than a separate design; the two engines must always resolve to one look.",
    },
    {
      text: "The main rail's own list (.dock-scroll) hides this control entirely rather than restyling it — a 56px column has no room to spare for a lane.",
    },
  ],
  examples: [
    {
      id: "panel",
      kind: "demo",
      title: "Panel",
      source: `${EXAMPLES_DIR}/panel.tsx`,
    },
    {
      id: "good-quiet",
      kind: "good",
      title: "Thin and quiet",
      caption: "Thin, grey, and nearly invisible until the pointer is on it.",
      source: `${EXAMPLES_DIR}/good-quiet.tsx`,
    },
    {
      id: "bad-widened",
      kind: "bad",
      title: "Widened and coloured",
      caption:
        "Never widen or colour the thumb to draw attention — it competes with the content it's meant to stay out of the way of.",
      source: `${EXAMPLES_DIR}/bad-widened.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Native, not custom",
      body: "This is the browser's own scrollbar, restyled through the two standard pseudo-element and scrollbar-color hooks — never a JS-built replacement. Keyboard scrolling, wheel, trackpad and OS gestures all keep working exactly as the platform defines them.",
    },
    {
      title: "Colour never alone",
      body: "The hover state changes lightness (--border-2 to --mute), not hue, so it reads under any colour-vision deficiency and in either theme.",
    },
    {
      title: "Hit target is the OS default",
      body: "The visual thumb is 4px, but the browser's own scrollbar hit area — wider than what is painted — is untouched, so pointer users never lose the margin for error the platform already gives them.",
    },
    {
      title: "No motion to reduce",
      body: "The thumb has no transition or animation of its own; hover is an instant colour swap, so prefers-reduced-motion has nothing here to turn off.",
    },
  ],
  tokens: [
    { tokens: ["border-2"], usage: "Thumb at rest" },
    { tokens: ["mute"], usage: "Thumb on hover" },
  ],
  relationships: [
    {
      target: "table",
      kind: "composes-with",
      text: "The component most often responsible for a horizontal thumb appearing at all — a wide row set is what puts this control to work.",
    },
    {
      target: "main-rail",
      kind: "contrasts-with",
      text: "Hides this exact control on its own item list, because a 56px collapsed rail has no width left to give it.",
    },
  ],
  changelog: [
    {
      version: "1.0.0",
      date: "2026-09-20",
      text: "Documented as its own component: 10px lane, 4px inset thumb, two states, and the corner rule that keeps it out of every layout's way.",
    },
  ],
  extractionNotes: [
    'The ticket (GitHub #29) names "scroll-area" (Radix/shadcn) as the port\'s scaffolding counterpart, but the prototype\'s own opening sentence — "never a custom-built replacement" — and its own Accessibility note "Native, not custom" rule out exactly that: Radix\'s ScrollArea is a JS-managed virtual scrollbar, the kind of replacement this entry explicitly exists to reject. Built instead as a plain `overflow-auto` div restyled through the two standard native hooks (`::-webkit-scrollbar*`, `scrollbar-color`) — no Radix dependency, no components.json. Flagged for Cory in case the ticket meant something else by naming scroll-area.',
    'Anatomy #1\'s "10px lane" / "4px pill" / "3px transparent border" has no exact spacing-ramp step (docs/prd.md §8.3 ramp: 4, 6, 8, 12, 16, 18, 22, 32, 44; its own default snap: "10 → 8 or 12"). Chose Space-12 over Space-8 specifically because it lets the inset border land on the real Space-4 token too (12 − 2×4 = 4), which reproduces the spec\'s own 4px thumb exactly — picking Space-8 instead would have needed a second, unsnappable 2px border value. Decision noted per §8.3\'s "choose by context and note the choice," the same precedent progress.ts\'s own track-height decision already set. The shipped component (packages/ui/src/scrollbar/scrollbar.tsx) therefore renders a 12px lane, not the prototype\'s literal 10px — flagged for the token decisions backlog alongside badge.ts\'s and card.ts\'s own unsnapped literals.',
    "sbTokens' own third and fourth rows (\"transparent — Track and the track/track corner\", \"2px radius — Thumb corners, matching the system lock\") are not carried into this entry's structured `tokens` field: `TokenUsageSchema.tokens` is a `ColorTokenNameSchema` array, closed to real colour tokens (packages/content/src/schema/component.ts) — the same scope limit loading.ts's and progress.ts's own motion rows and text.ts's own font-family rows already flagged. Both are kept verbatim in Content rules 2–3 and Anatomy #2 instead, and the shipped component applies `rounded-ds` (the radius-lock token) and `bg-transparent`/`bg-clip-padding` directly.",
    "`often-confused-with` doesn't fit either Related-card relationship, and neither `alternative` nor the exact text reads as a real fit either: Table isn't an alternative to Scrollbar, and Main rail isn't confused with it — it deliberately omits it. `composes-with` is used for Table (the two are frequently rendered together, the same directional reading usage-card.ts's own Cards relationship already gave that kind) and `contrasts-with` for Main rail (the one documented place this component's own \"any overflowing pane\" rule doesn't hold, the same boundary-drawing use card.ts's own Modal relationship already gave that kind). Flagged for Cory as the weakest-fit relationship kinds assigned so far.",
    'The Related section\'s own "Navigation (Main)" target and the Usage section\'s own "MainNav" (in its "use something else when" row) have no entry yet; both are modeled against one new draft stub, main-rail.ts, named after CONTEXT.md\'s own glossary term ("Main rail ... Also called: dock, Navigation (Main)") rather than the prototype\'s internal state key ("MainNav") — the same precedent tabs.ts set for Navigation (Tabs).',
    "No variants exist for this entry — like usage-card.ts, the shipped component has exactly one shape (a single restyled scrollbar, no thin/thick choice per Content rule 1). Its own docs page therefore skips the Variants section entirely.",
    "The Do/don't pair's own specimens (archive/v1/Workspace Shell.dc.html ~9216–9238) render the misuse (a wide, accent-coloured thumb) with the same literal pixel anatomy as the primary diagram, not through any prop the real component exposes — Scrollbar has no width or colour prop, by design (Content rule 1, Do/don't caption). The bad example (bad-widened.tsx) is therefore built from a raw `overflow-auto` div with its own pseudo-element overrides, the same treatment usage-card.ts's own bad-single.tsx and card.ts's own bad-nestedcontrols.tsx give a misuse their real component can't produce.",
  ],
});
