import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/button/examples";

/**
 * Buttons, extracted from archive/v1/Workspace Shell.dc.html (template
 * 3594–3889, logic constants `btnVariants` 15652 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on "Tabs" and "Chip" in the opening boundary sentence and
 * on component names inside Usage rows is dropped as markup, not content.
 * This is the template ticket (LDS-018) every later component slice
 * copies — see extractionNotes for every place structured metadata was
 * added, a literal was replaced by a token, or a prototype value had no
 * token to map to.
 */
export const button = ComponentEntrySchema.parse({
  meta: {
    id: "button",
    name: "Buttons",
    section: "components",
    status: "stable",
    version: "1.3.0",
    updated: "2026-10-01",
  },
  purpose: "Commits an action the operator has decided to take.",
  description: {
    summary: "A button commits an action the operator has decided to take.",
    boundary:
      "It changes something — runs, saves, deletes, confirms. If the control only changes what is shown, it is Tabs or a link, not a button; if it carries a value the operator picked rather than an action, it is a Chip. Everything below assumes the click has a consequence.",
  },
  anatomy: [
    {
      number: "1",
      name: "Padding",
      description: "9px vertical, 16px horizontal on every variant, so a row of mixed buttons shares one height.",
    },
    {
      number: "2",
      name: "Label",
      description: "12.5px, 600 weight, .06em tracking, uppercase. A verb, never a noun.",
    },
    {
      number: "3",
      name: "Icon slot",
      description:
        "Optional 14px leading glyph at 8px from the label. Trailing icons are reserved for menus and links.",
    },
    {
      number: "4",
      name: "Container",
      description:
        "1px border, 2px radius, 32px minimum height. The border is present on every variant except Ghost, which draws one on hover.",
    },
  ],
  anatomyCaption:
    "Each part takes one edge of the frame, and every leader is a single straight line landing square on the target. Positions are measured from the artifact, so the diagram stays true at any size.",
  variants: [
    {
      name: "Primary",
      tokens: ["accent", "bg"],
      description:
        "The one action the screen exists for. Never two on the same view — if two things look primary, neither is.",
    },
    {
      name: "Secondary",
      tokens: ["border-2", "fg"],
      description:
        "A real alternative to the primary action: cancel, go back, pick the other path. Outlined, never filled.",
    },
    {
      name: "Ghost",
      tokens: ["dim"],
      description:
        "Tertiary and repeated actions — toolbar controls, row actions, anything that would shout if it were bordered.",
    },
    {
      name: "Danger",
      tokens: ["alarm-line", "alarm-soft", "fg"],
      description:
        "Destructive and irreversible only. Delete, revoke, purge. Never for \"remove filter\" or anything a click can undo.",
    },
  ],
  variantsNote:
    "There is no Link variant. A link navigates and belongs in prose; giving it a button shell teaches operators that the two behave alike, and then a misplaced click costs them work.",
  states: [
    { name: "Default", description: "At rest. Primary is the only variant carrying a fill." },
    { name: "Hover", description: "Fill lightens 22% and a soft lift shadow appears. 140ms." },
    {
      name: "Active",
      description:
        "Fill darkens 18%, the button drops 1px and the shadow inverts inward. No duration — it tracks the pointer.",
    },
    {
      name: "Focus",
      description: "3px --accent-soft ring plus an --accent-line border. Identical on every variant, including Danger.",
    },
    {
      name: "Disabled",
      description: "35% opacity, not-allowed cursor. Never removed from the DOM — a vanished button reads as a bug.",
    },
  ],
  usage: {
    useWhen: [
      "The click commits something — data is written, a job starts, a record is destroyed.",
      "The operator chose to act, rather than being told about something.",
      "The action can be named as a verb the operator would use out loud.",
      "It belongs to the view it sits in, not to a row inside it.",
    ],
    useInstead: [
      {
        target: "tabs",
        text: "It only changes which panel is visible — that is Navigation (Tabs).",
      },
      {
        target: "chip",
        text: "It carries a value the operator picked or can dismiss — that is a Chip.",
      },
      {
        target: "switch",
        text: "It flips one setting on or off in place — that is a Switch.",
      },
    ],
  },
  contentRules: [
    { text: 'A verb in the imperative: "Save", "Run pipeline", "Revoke access". Never a noun like "Configuration".' },
    { text: "Uppercase, 12.5px, .06em tracking. One or two words; three is the ceiling and it needs a reason." },
    { text: 'Say what happens, not what the user wants. "Delete workspace", never "OK" or "Yes".' },
    { text: "No trailing punctuation, no ellipsis unless the click opens a further dialog that still needs input." },
    {
      text: 'The same action carries the same verb everywhere. "Run" is never also "Execute" or "Start".',
    },
  ],
  propGuidance: [
    {
      prop: "variant",
      note: "Never two Primary buttons in the same view (Variants, Do and don't pair 1).",
    },
    {
      prop: "icon",
      note: "A leading glyph only — trailing icons are reserved for menus and links (Anatomy #3).",
    },
    {
      prop: "disabled",
      note: "Stays focusable as aria-disabled rather than being removed, and should be paired with explanatory text (Accessibility \"Disabled\").",
    },
  ],
  examples: [
    {
      id: "secondary",
      kind: "demo",
      title: "Secondary",
      source: `${EXAMPLES_DIR}/secondary.tsx`,
    },
    {
      id: "primary",
      kind: "demo",
      title: "Primary",
      source: `${EXAMPLES_DIR}/primary.tsx`,
    },
    {
      id: "ghost",
      kind: "demo",
      title: "Ghost",
      source: `${EXAMPLES_DIR}/ghost.tsx`,
    },
    {
      id: "danger",
      kind: "demo",
      title: "Danger",
      source: `${EXAMPLES_DIR}/danger.tsx`,
    },
    {
      id: "good-one-primary",
      kind: "good",
      title: "One primary, kept quiet alternative",
      caption: "One primary per view, with its alternative kept quiet.",
      source: `${EXAMPLES_DIR}/good-one-primary.tsx`,
    },
    {
      id: "bad-three-primary",
      kind: "bad",
      title: "Three primaries",
      caption: "Never three primaries. Everything is loud, so nothing leads.",
      source: `${EXAMPLES_DIR}/bad-three-primary.tsx`,
    },
    {
      id: "good-danger-label",
      kind: "good",
      title: "Danger names what it destroys",
      caption: "Danger names what it destroys, so the label survives being read alone.",
      source: `${EXAMPLES_DIR}/good-danger-label.tsx`,
    },
    {
      id: "bad-danger-label",
      kind: "bad",
      title: "\"OK\" on a destructive action",
      caption: 'Never "OK" on a destructive action — it tells the operator nothing about the consequence.',
      source: `${EXAMPLES_DIR}/bad-danger-label.tsx`,
    },
    {
      id: "good-mixed-height",
      kind: "good",
      title: "Mixed variants, one height",
      caption: "Mixed variants share one height, so the row keeps a single baseline.",
      source: `${EXAMPLES_DIR}/good-mixed-height.tsx`,
    },
    {
      id: "bad-resized",
      kind: "bad",
      title: "Resized for emphasis",
      caption: "Never resize a button to add emphasis — variant carries weight, size does not.",
      source: `${EXAMPLES_DIR}/bad-resized.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Focus ring",
      body: "Every button takes a 3px --accent-soft ring with an --accent-line border on keyboard focus. Focus is never suppressed and never reduced to a colour change, so it stays visible on the filled Primary as well as on Ghost.",
    },
    {
      title: "Real buttons",
      body: "Ghost and icon-only controls are still buttons: they take a tab stop, fire on Enter and Space, and expose a label. An icon-only button carries an aria-label matching its tooltip word for word.",
    },
    {
      title: "Disabled",
      body: "Disabled buttons stay in the tab order as aria-disabled rather than being removed, so a keyboard operator can find the control and read why it is unavailable from the adjacent help text.",
    },
    {
      title: "Never colour alone",
      body: "Danger is not signalled by colour alone — the label names the destruction. At 35% opacity a disabled button drops below 4.5:1, which is why disabled state is always paired with an explanatory line, never left to the eye.",
    },
  ],
  tokens: [
    { tokens: ["accent", "bg"], usage: "Primary fill and its label" },
    { tokens: ["border-2", "fg"], usage: "Secondary border and label" },
    { tokens: ["panel-2"], usage: "Hover fill on Secondary and Ghost" },
    { tokens: ["dim"], usage: "Ghost label at rest" },
    { tokens: ["accent-soft", "accent-line"], usage: "Focus ring on all variants" },
  ],
  relationships: [
    {
      target: "chip",
      kind: "often-confused-with",
      text: "Also clickable, but a chip carries a value the operator has chosen. A button carries an action.",
    },
    {
      target: "tabs",
      kind: "often-confused-with",
      text: "Tabs switch what is shown without changing anything. If nothing is committed, it is not a button.",
    },
    {
      target: "modal",
      kind: "composes-with",
      text: "Where Primary and Secondary most often appear as a pair — and where Danger is confirmed.",
    },
  ],
  changelog: [
    {
      version: "1.3.0",
      date: "2026-08-18",
      text: "Focus ring unified across variants; Ghost no longer relies on a border change alone.",
    },
    {
      version: "1.2.0",
      date: "2026-08-15",
      text: "Radius locked to 2px. Active state gained the inset press shadow.",
    },
    {
      version: "1.1.0",
      date: "2026-08-13",
      text: "Danger variant added, replacing ad-hoc red text buttons.",
    },
    {
      version: "1.0.0",
      date: "2026-08-11",
      text: "Initial release — Primary, Secondary, Ghost across five states.",
    },
  ],
  extractionNotes: [
    "The fourth \"use something else\" row (\"it navigates somewhere else — that is a link, styled as text\") names no component — there is deliberately no Link entry (see the Variants section's own \"There is no Link variant\" sentence, carried verbatim into `variantsNote`) — so it isn't a structured `useInstead` row with a `target`. The other three rows (Tabs, Chip, Switch) each point at a real or draft entry per docs/build-guide.md §3.",
    "`tabs` (Navigation (Tabs)), `chip` (Chips) and `switch` (Switch) have no ticket of their own yet and are created here as draft stubs (component.ts's `relationships`/`usage.useInstead` targets must resolve, per catalogue.ts). `chip`'s `purpose` is CONTEXT.md's own glossary definition, verbatim, the same convention badge.ts and card.ts used. `tabs` and `switch` have no CONTEXT.md entry, so their stub `purpose` is paraphrased from this entry's own Related-card / useInstead sentence about each, flagged pending their own tickets — the same thing card.ts's stub did for Card.",
    "Relationship `kind` (often-confused-with for Chips and Tabs, composes-with for Modal) is new structured metadata the prototype's Related cards carry no tag for, following the same judgment call as callout.ts: Chips and Tabs are both \"a button commits, this doesn't\" boundary confusions; Modal is where Primary/Secondary/Danger are described as appearing together, i.e. a composition. Flagged for review.",
    "The `states` field changed shape from `string[]` (its only use before this ticket) to `{ name, description }[]` (schema/component.ts's new `StateDocSchema`) so the five State rows' own prose (e.g. Hover's \"Fill lightens 22% and a soft lift shadow appears. 140ms.\") has somewhere to live verbatim — a plain string array had no room for it. apps/docs/app/components/[slug]/page.tsx and apps/docs/lib/llms.ts both gained a States section (renumbering every later section by one on the live docs page; llms.txt/llms-full.txt have no section numbers to shift). No other entry used `states` yet, so this is not a breaking change to any shipped content. Flagged for Cory as a schema decision, not just a content one.",
    "\"Fill lightens 22%\" (Hover) and \"Fill darkens 18%\" (Active) have no token — there is no lighten/darken step for --accent, --border-2's fill, or --alarm's fill anywhere in @lairy/tokens (AGENTS.md rule 1: flag rather than invent). The shipped component (packages/ui/src/button/button.tsx) uses Tailwind's standard, non-arbitrary `brightness-110` / `brightness-90` filter steps as the closest stand-in instead of inventing a new colour-mix token. Flagged for the token decisions backlog.",
    "Active's \"the button drops 1px\" transform isn't ported: after the spacing ramp (4, 6, 8, 12, 16, 18, 22, 32, 44) and Tailwind's theme-scale reset (ADR-0003), there is no 1px step to move it by without an arbitrary value. The inset press shadow (--shadow-press / --shadow-press-primary, already a named Elevation token) carries the pressed affordance alone. Flagged for the token decisions backlog.",
    "Hover's \"140ms\" duration and the hover/active transition generally have no Tailwind `duration-*` utility to read it from: packages/tokens/build.mjs only ever emitted the named `duration`/`easing` motion tokens as JS exports (for animate-* keyframe composition), never as `--duration-*` CSS variables Tailwind's `duration-*` class could read (docs/build-guide.md §6 applies to CSS, not this JS-only export). The shipped component reads `duration.instant` (\"140ms\", motion.json's own \"Hover fills, chip toggles, row highlights\" description — an exact match) and `easing.standard` directly from `@lairy/tokens` via an inline `style`, rather than inventing a bare-pixel Tailwind class for one component. Flagged for whoever wires a general `duration-*` Tailwind theme entry.",
    "That transition is scoped to `transition-shadow` (box-shadow only — the hover lift, docs/prd.md §8.7's Elevation `--shadow-hover-lift`/`--shadow-hover-lift-accent`), not `transition-colors`: an earlier draft transitioned colour too, which meant a theme toggle animated --accent/--bg through intermediate values for 140ms, and Playwright's axe check (apps/docs/e2e/button.spec.ts) caught a mid-transition frame failing AA contrast. `brightness-110`/`brightness-90` (filter, not colour) aren't covered by either transition utility and just snap instantly, which reads fine for a one-step brightness nudge.",
    "Icon anatomy #3 names a 14px glyph; the shipped component uses the already-established Icons foundation Inline icon (16px, @lairy/tokens `icon.inline`, LDS-017) instead of a new 14px size, the same kind of shipped-vs-prototype-prose gap callout.ts's extractionNotes flagged for Callout's icon. The prototype's own bespoke \"play\" triangle glyph in its anatomy diagram isn't part of the shipped Inline icon set (open/spark/gear/drain/arrow, LDS-017) and isn't ported — the Secondary example below substitutes the existing `arrow` icon (already documented as \"Shortcut · go\") for the \"Run pipeline\" demo. Flagged for the icons backlog if a dedicated run/execute glyph is wanted.",
    "Danger's `tok: '#ff8f6b'` (the prototype's own token row for this variant, folded into `variants[].tokens` as `alarm-line`/`alarm-soft`/`fg` rather than bare `alarm`) isn't rendered as literal --alarm text: bare --alarm (#ff8f6b) on the page's --bg fails AA in the light theme at 2.03:1 — caught by axe in apps/docs/e2e/button.spec.ts, and already documented as a known gap by packages/content/src/entries/tokens/alarm.ts's own --alarm-ink rationale (\"Anything not sitting on a solid --alarm fill... use --alarm-line or --alarm-soft against the ordinary text ranks instead\"). The shipped component follows that guidance: `text-fg` label, `border-alarm-line` border, `hover:bg-alarm-soft` wash — the destructive signal comes from the border colour and the verb (\"Delete workspace\"), not the label's own colour, consistent with this entry's own \"Never colour alone\" accessibility note. The prototype's own Do/Don't visual example (bare alarm-coloured text, outlined, on the page background) has the same latent bug; this is a deliberate deviation from it, not an extraction error. The Tokens section below (§08, verbatim from the prototype's own `btnTokens`) has no Danger row at all — that's the prototype's own omission, not dropped here.",
    "\"35% opacity\" (Disabled) has no dedicated opacity token either — the same gap elevation.ts's extractionNotes already flagged for scrim recipes. The shipped component uses Tailwind's bare `opacity-35` utility (a literal percentage, not bracket/arbitrary syntax, so it isn't blocked by the `tailwindcss/no-arbitrary-value` lint rule) rather than inventing a token. Flagged for the token decisions backlog.",
    "9px vertical padding maps to Space-8 and 16px horizontal maps directly onto the ramp (docs/prd.md §8.3's default snapping: \"9 → 8\"); 12.5px label size maps to Small/13px (§8.2's default mapping: \"12.5 → Small\"); 32px minimum height is already a ramp step. None of these needed a flag.",
    "Callout's action slot (packages/ui/src/callout/callout.tsx) is rebuilt on this component as part of this ticket: its hand-rolled `<button>` markup and per-tone `primaryActionClass`/`SECONDARY_ACTION_CLASS` are replaced by `<Button variant=\"primary\">`/`<Button variant=\"secondary\">`, first action primary and the rest secondary regardless of the callout's tone. This also drops the tone-coloured action fill — including the Warning/Error primary action's `--alarm`/`--alarm-ink` combination that callout.tsx's own code comment had already flagged as failing AA in the light theme — in favour of Buttons' own, already-accessible variant styling. See callout.ts's own extractionNotes for the content-entry side of this change.",
  ],
});
