import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/text-input/examples";

/**
 * Text input, extracted from archive/v1/Workspace Shell.dc.html (template
 * 3890–4177, logic constants `inAnatomy` 16380 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on "Textarea" in the opening boundary sentence, and on
 * component names inside the Usage "use something else" rows and the
 * Related cards, is dropped as markup, not content. This entry has no
 * Variants section at all — unlike Buttons/Chips, the prototype's own page
 * goes straight from Anatomy (01) to States (02) to Usage (03), so
 * `variants` stays the schema default `[]` and the docs page skips that
 * section entirely, the same way scrollbar.ts's and usage-card.ts's single-
 * shape entries already do. See extractionNotes for every place structured
 * metadata was added, a literal had no clean token, or the shipped
 * component deliberately departs from the prototype's own markup.
 */
export const textInput = ComponentEntrySchema.parse({
  meta: {
    id: "text-input",
    name: "Text input",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-10-02",
  },
  purpose:
    "One line the operator types into, and the box every other field in the system is measured against.",
  description: {
    summary:
      "A text input is one line the operator types into, and the box every other field in the system is measured against.",
    boundary:
      "Select, multi-select and textarea all inherit its border, radius, padding and height, so a form of mixed controls reads as one column of boxes rather than a collection of parts. It holds a value the operator authors, which is the line against every picker: if the legal answers are known in advance, hiding them behind free text is a trap. Anything longer than a line is a Textarea.",
  },
  anatomy: [
    {
      number: "1",
      name: "Label",
      description:
        "A 12px --dim caps line at .16em, always above the field and always present. It is never replaced by the placeholder, because the label has to survive the first keystroke.",
    },
    {
      number: "2",
      name: "Field",
      description:
        "The reference box for the whole system: 10px/13px padding, 1px --border, 2px corner, --bg fill, 14px mono. Select, multi-select and textarea are this box with something added, never a box of their own.",
    },
    {
      number: "3",
      name: "Hint",
      description:
        "One 11px --faint line stating the constraint before it is broken — casing, format, allowed characters. It occupies the same slot the error will, so the layout does not jump when validation fails.",
    },
    {
      number: "4",
      name: "Counter",
      description:
        "An optional --faint count on the right of the hint row, shown only where a real limit exists. It counts up to the limit rather than down from it, so the number means the same thing as the value.",
    },
    {
      number: "5",
      name: "Error",
      description:
        "Replaces the hint in #ff8f6b, naming what is wrong and what to type instead. The border turns with it, but the words are what the operator acts on — the colour is a locator.",
    },
  ],
  anatomyCaption:
    "One field with everything it is allowed to carry, and the same field failing validation below it. Each part takes one edge and every position is measured from the artifact.",
  states: [
    {
      name: "Default",
      description:
        "Empty and waiting. The placeholder is an example or an instruction in --mute, and it is never the only place the field says what it is.",
    },
    {
      name: "Filled",
      description:
        "Holds a value. The border does not change on filling — only the text colour does, so a column of filled and empty fields still reads as one grid.",
    },
    {
      name: "Focus",
      description:
        "Being typed into. The amber border plus the soft ring is the system focus treatment, and it is the one moment a field is allowed to be amber.",
    },
    {
      name: "Error",
      description:
        "Failed validation, and only ever after the operator has finished — never while they are still typing the value that will pass.",
    },
    {
      name: "Disabled",
      description:
        "Not editable now. The value stays readable and something adjacent says why; a field that cannot be typed into without explanation reads as broken.",
    },
  ],
  statesNote:
    "There is no success state and no read-only variant distinct from disabled. A field that validated is simply a field with a value in it — a green tick on every correct answer teaches the operator to ignore the one that is wrong.",
  usage: {
    useWhen: [
      "The operator authors the value and only they know it — a name, a key, a query.",
      "The answer is short enough to read back in one line.",
      "The legal answers cannot be listed in advance.",
      "Typing is genuinely faster than choosing, as it is in search.",
    ],
    useInstead: [
      {
        target: "select",
        text: "The answers are a known list — that is a Select or a Radio group.",
      },
      {
        target: "textarea",
        text: "The value runs past one line — that is a Textarea.",
      },
      {
        target: "checkbox",
        text: "The answer is yes or no — that is a Checkbox or a Switch.",
      },
    ],
  },
  contentRules: [
    {
      text: "Label every field with the noun it collects, in tracked caps above the box — and never let the placeholder take that job.",
    },
    {
      text: 'Write the placeholder as an example of a good answer, not a repeat of the label: "nightly-ingest" beats "Enter pipeline name".',
    },
    {
      text: "State constraints in the hint before the operator types, so the error is a reminder rather than news.",
    },
    {
      text: 'Write errors as a fact plus a fix — "Spaces are not allowed — try nightly-ingest" — and never as "Invalid input".',
    },
    {
      text: "Size the field to the answer: a retry count is 74px wide, a name is the column. The width is the first thing the operator reads.",
    },
  ],
  propGuidance: [
    {
      prop: "label",
      note: "Always present and never replaced by the placeholder (anatomy #1, Content rule 1) — there is no labelless variant.",
    },
    {
      prop: "hint",
      note: 'States the constraint before the operator types (anatomy #3, Content rule 3); replaced by `error`, never shown alongside it.',
    },
    {
      prop: "error",
      note: 'A fact plus a fix, never "Invalid input" (Content rule 4). Set only once the operator has finished, not on every keystroke (Accessibility "Validation waits its turn").',
    },
    {
      prop: "showCounter",
      note: "Counts up to `maxLength` rather than down from it, and only where `maxLength` is set (anatomy #4) — a real limit, not decoration.",
    },
  ],
  examples: [
    {
      id: "pipeline-name",
      kind: "demo",
      title: "Pipeline name",
      source: `${EXAMPLES_DIR}/pipeline-name.tsx`,
    },
    {
      id: "good-label-above",
      kind: "good",
      title: "Persistent label and a stated constraint",
      caption: "A persistent label above and the constraint stated before the operator types.",
      source: `${EXAMPLES_DIR}/good-label-above.tsx`,
    },
    {
      id: "bad-placeholder-as-label",
      kind: "bad",
      title: "Placeholder standing in for the label",
      caption:
        "Never use the placeholder as the label — the first keystroke deletes the only clue what the field is.",
      source: `${EXAMPLES_DIR}/bad-placeholder-as-label.tsx`,
    },
    {
      id: "good-error-with-fix",
      kind: "good",
      title: "An error with a fix",
      caption: "An error names what is wrong and offers the fix, in the same place the hint was.",
      source: `${EXAMPLES_DIR}/good-error-with-fix.tsx`,
    },
    {
      id: "bad-vague-error",
      kind: "bad",
      title: '"Invalid input"',
      caption:
        'Never write an error the operator cannot act on — "Invalid input" is the border saying nothing twice.',
      source: `${EXAMPLES_DIR}/bad-vague-error.tsx`,
    },
    {
      id: "good-width-tracks-answer",
      kind: "good",
      title: "Field width tracks the answer",
      caption: "Field width tracks the length of the answer, so the box itself says how much is expected.",
      source: `${EXAMPLES_DIR}/good-width-tracks-answer.tsx`,
    },
    {
      id: "bad-stretched-field",
      kind: "bad",
      title: "A one-character field at form width",
      caption:
        "Never stretch a one-character field to the form width — the box promises an essay and gets a digit.",
      source: `${EXAMPLES_DIR}/bad-stretched-field.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Always a real label",
      body: "Every field has a <label for> pointing at it — not an aria-label standing in for one, and never a placeholder doing the job. The visible label and the accessible name are the same words.",
    },
    {
      title: "Hints and errors are tied",
      body: "The hint and the error are the same element, referenced by aria-describedby, so the constraint and the failure are announced with the field. On failure the input takes aria-invalid.",
    },
    {
      title: "Validation waits its turn",
      body: "Validation runs on blur or submit rather than on every keystroke, because a field that announces an error mid-word talks over the operator typing the value that would have passed.",
    },
    {
      title: "Focus is visible and quiet",
      body: "The soft amber ring measures 3px and is drawn outside the border, so it never shifts the layout. Amber on --bg reads 7.4:1, and the ring is present for pointer focus too — there is no focus-visible-only hiding here.",
    },
  ],
  tokens: [
    { tokens: ["border"], usage: "Resting field border" },
    { tokens: ["accent-line"], usage: "Field border while focused" },
    { tokens: ["accent-soft"], usage: "Focus ring" },
    { tokens: ["bg"], usage: "Field fill" },
    { tokens: ["fg"], usage: "Entered value" },
    { tokens: ["mute"], usage: "Placeholder text" },
    { tokens: ["faint"], usage: "Disabled value" },
    { tokens: ["mute"], usage: "Hint and counter" },
    { tokens: ["alarm-line"], usage: "Error border" },
  ],
  relationships: [
    {
      target: "textarea",
      kind: "alternative",
      text: "The same box grown a line taller and resizable vertically. Use it the moment the answer is a sentence rather than a value.",
    },
    {
      target: "select",
      kind: "alternative",
      text: "Inherits this box exactly. If the legal answers are a known list, hiding them behind free text turns typing into guessing.",
    },
    {
      target: "button",
      kind: "composes-with",
      text: "What commits the field. A text input never acts on its own — Enter submits the form, it does not run anything by itself.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-25",
      text: "Hint and error share one slot so validation never shifts the layout; success state ruled out; field width tied to answer length.",
    },
    {
      version: "1.0.1",
      date: "2026-08-17",
      text: "Validation moved to blur and submit; disabled value lightened to --faint at 55%.",
    },
    {
      version: "1.0.0",
      date: "2026-08-11",
      text: "Text input introduced as the reference box — 10px/13px padding, 2px corner, 14px mono.",
    },
  ],
  extractionNotes: [
    'The Usage "use something else when" rows name two alternatives apiece — "a Select or a Radio group" and "a Checkbox or a Switch" — but `UseInsteadSchema` holds one `target` per row. Each row keeps its sentence verbatim (ADR-0009) and resolves to the first-named target (`select`, `checkbox`); the second name in each sentence (`radio`, `switch`) is not given a second, identically-texted row of its own, which would duplicate the same sentence twice in the rendered Usage card. Both still get draft stubs (`radio.ts` new here; `switch.ts` already exists from button.ts/LDS-018) so the words resolve to a real entry per docs/build-guide.md §3, the same stub-eagerness card.ts and button.ts already showed. Flagged for review as the weakest-fit target choice in this entry.',
    'The fourth "use something else" row — "the typing filters what is on screen right now — that is the command bar, not a form field" — names no Lairy component (the command bar is a shell feature, not an entry), the same shape of omission button.ts\'s own fourth row ("a link, styled as text") hit for Buttons. Per that precedent it is not a structured `useInstead` row; quoted here verbatim for the record rather than force-fit into a field it has no target for.',
    "`textarea`, `select`, `checkbox` and `radio` are new draft stubs (packages/content/src/entries/components/{textarea,select,checkbox,radio}.ts), the same pattern switch.ts/tabs.ts/chip.ts used from button.ts: none has a ticket or CONTEXT.md glossary entry yet, so each stub's `purpose` is paraphrased from this entry's own prose about it, flagged pending each one's own ticket. `select` is distinct from the already-existing `select-multi` stub (LDS-021/chip.ts) — Select (Multi) is the multi-value menu Chips' Removable variant carries tokens for; Select here is the single-value picker this entry's own boundary and Usage rows name.",
    'Relationship `kind`: Textarea and Select are both `alternative` (their own Related-card text offers each as a direct substitute — "use it the moment…", the same reading chip.ts\'s own `select-multi` relationship already gave "the option list is long enough"); Buttons is `composes-with` (the Related card describes where the two appear together — a field plus the control that commits it — the same directional reading button.ts\'s own Modal relationship and scrollbar.ts\'s own Table relationship already used for "appears alongside"). Flagged for review.',
    "Anatomy #1's label size (\"12px\") needs no snap: it lands exactly on Typography's own Label step (docs/prd.md §8.2: 12px, IBM Plex Mono, .16em tracking) with no deviation, so the shipped component (packages/ui/src/text-input/text-input.tsx) uses `text-label` bare — `text-label`'s own default tracking is already .16em (confirmed against button.tsx's `text-small`/chip.tsx's `tracking-tight-10` override precedent: chip overrides Label's default tracking because its own spec wants .1em, not .16em; this entry's own spec wants exactly the default, so no override is added). Anatomy #2's field text (\"14px mono\") is the one literal that needed no mapping at all: 14px mono is Typography's own Body step verbatim (§8.2: 14, IBM Plex Mono, 400, 1.6) — not the usual §8.2 'review decision, not a snap' flag that literal 14px values elsewhere get, because here it names the family (mono) and the exact Body size together, a clean 1:1 match rather than an off-scale value guessed at. The hint, counter and error text (\"11px\") land exactly on Micro (11px, the type floor, ADR-0006) with the same no-deviation reasoning.",
    'Anatomy #2\'s "10px/13px padding" is the one spacing literal needing a §8.3 snap. 13px → Space-12 is explicit in the ramp\'s own default table ("13 → 12"). 10px has no single default (§8.3: "10 → 8 or 12") — chosen as Space-8 (the tighter of the two) over Space-12, kept deliberately narrower than the horizontal 12px pad so the field reads closer to the prototype\'s own near-square corner proportions than doubling both paddings to 12 would. The field\'s own internal vertical rhythm (label → field → hint row) and the hint/counter row\'s own baseline gap both needed no snap at all: the prototype\'s own measured specimen (`data-anat-spec="1"`, archive/v1/Workspace Shell.dc.html:3907) already uses `gap:6px` and the hint row (:3910) already uses `gap:12px` — both exact ramp steps (Space-6, Space-12) with nothing to flag.',
    "Content rule 5's own \"74px\" (illustrating a narrow retry-count field against \"the column\" for a name) is prose, not a literal the shipped component enforces — Text input takes no `width` prop of its own, by design (the same \"no variant, consumer's className decides\" precedent card.ts's and scrollbar.ts's single-shape entries already set). Kept verbatim in the rule's own sentence per ADR-0009 (AGENTS.md rule 1: flag, never invent, when no token exists) — 74 is well outside the spacing ramp (4, 6, 8, 12, 16, 18, 22, 32, 44) and the default snap table only covers values close to a ramp step, not a gap this size. The Do/don't \"good-width-tracks-answer\" example approximates it with `w-44` (the ramp's own ceiling) on the narrow field's own wrapper instead of the prototype's literal 74 — the closest token-backed step available, illustrating the pattern rather than reproducing the exact width. Flagged for the token decisions backlog alongside badge.ts's, card.ts's and scrollbar.ts's own unsnapped literals.",
    "Anatomy #5's and inTokens' own `#ff8f6b` (\"Replaces the hint in #ff8f6b\" / \"Error border and message\") is kept verbatim in the anatomy prose (ADR-0009) but not carried as a literal colour or as bare `--alarm`/`text-alarm` into the shipped component or this entry's own `tokens` row, the same class of deviation button.ts's Danger variant and chip.ts's Active state already made: `--alarm` (#ff8f6b) text over the light theme's `--bg` (#f3f4f5) measures roughly 1.9:1 by the same WCAG relative-luminance formula alarm.ts's own `--alarm-ink` rationale cites for its own 2.03:1 figure — well under AA for text, and under even the 3:1 floor for non-text UI component boundaries. The shipped component borders the field with `border-alarm-line` (40% alpha, the same non-text-contrast role button.tsx's Danger border already plays) and renders the error message itself in `text-fg` — the entry's own \"Validation waits its turn\" and `aria-invalid`/`aria-describedby` wiring (Accessibility \"Hints and errors are tied\") carry the semantic signal, the colour is a locator only, consistent with this entry's own anatomy #5 sentence (\"the words are what the operator acts on — the colour is a locator\"). The `tokens` row's own usage text is shortened from the prototype's literal \"Error border and message\" to \"Error border\" to match — flagged for the token decisions backlog alongside button.ts's and chip.ts's own alarm-contrast deviations.",
    'Anatomy #3\'s and #4\'s own "--faint" (hint, counter) is kept verbatim in prose (ADR-0009) but not carried as bare `text-faint` into the shipped component\'s hint/counter text: axe measured it at Micro (11px) against the light theme\'s --bg at 3.69:1 (apps/docs/e2e/text-input.spec.ts), short of AA\'s 4.5:1 — the same gap empty-state.ts\'s own support line and card.ts\'s own meta slot already document for --faint text elsewhere. The shipped component (packages/ui/src/text-input/text-input.tsx) renders both in `text-mute` instead, which clears 4.5:1 in both themes, the same substitution empty-state.ts\'s own fix made. The Disabled state\'s own value keeps `text-faint` unchanged — WCAG 1.4.3 explicitly exempts an inactive UI component\'s own text from the contrast requirement, so a disabled field\'s value has nothing to fix. The `tokens` section\'s own "Hint, counter, disabled value" row is split in two to match: `faint` → "Disabled value", a new `mute` row → "Hint and counter". Flagged for the token decisions backlog alongside empty-state.ts\'s and card.ts\'s own instances of the same gap.',
    "Accessibility \"Focus is visible and quiet\" is carried verbatim including its own closing clause (\"there is no focus-visible-only hiding here\") — read literally as the entry's own instruction, the shipped component's focus ring uses plain `:focus` (Tailwind's `focus:`), not `:focus-visible`, the one deliberate divergence from button.tsx's and chip.tsx's own `focus-visible:`-only pattern (both of which suppress the ring on a mouse click deliberately). A text field benefits from showing where the cursor landed on every focus event, pointer or keyboard alike — the entry's own prose already says so directly, so this isn't flagged as a gap, only noted as the reason the two components' focus-ring techniques differ.",
    "`disabled:opacity-55` (inStates' own Disabled row: `op: .55`) is a bare Tailwind opacity utility, not arbitrary-value syntax, the same non-arbitrary bare-numeric precedent button.tsx's own `opacity-35` already set (its own extractionNotes) — not blocked by `tailwindcss/no-arbitrary-value` (packages/ui/src/lint.test.ts covers the rule itself, not every bare value it allows).",
    "`showCounter`/`maxLength` (anatomy #4: \"shown only where a real limit exists… counts up to the limit rather than down from it\") is implemented by reading the live input length directly from the `value` prop when the field is controlled, falling back to component-local state (seeded from `defaultValue`) only when it is not — so the counter stays correct either way without the component ever owning the field's actual value. Not named in the prototype's own `inAnatomy`/`inTokens` rows beyond the counter's existence; this is a propGuidance addition, not a content deviation.",
    'The shipped component (packages/ui/src/text-input/text-input.tsx) is the first in `packages/ui` to need a `"use client"` directive: `useId`/`useState` (for the uncontrolled counter and the generated label/field id pairing) are Client Component-only APIs, and apps/docs/app/components/[slug]/page.tsx and its dev routes are Server Components by default (Next.js App Router) — Turbopack\'s build fails without it ("You\'re importing a module that depends on `useState` into a React Server Component module"). Every earlier component (Button, Chip, Callout, …) is a plain function with no hooks, so none needed this before. Flagged for review as a precedent, not a deviation: the registry item (apps/docs/lib/registry.ts\'s `buildTextInputItem`) copies the directive out verbatim along with the rest of the source, so a consuming app\'s own copy keeps it.',
    'Exactly one `demo` example (`pipeline-name`), not one per state: unlike button.ts/card.ts/badge.ts, whose demo count matches their own Variants grid 1:1 (each demo is looked up by title from apps/docs/app/components/[slug]/page.tsx\'s Variants section), this entry has no Variants section at all, so there is no grid for a second demo to fill a slot in — the same "one demo, serving only as the Anatomy specimen" shape scrollbar.ts\'s (`panel`) and usage-card.ts\'s single-shape entries already use. `pipeline-name` reproduces the anatomy diagram\'s own specimen almost exactly (label "Pipeline name", value "Nightly ingest" — 14 characters, matching the diagram\'s own "14/60" counter — hint "Lowercase, no spaces", `maxLength=60`), so it doubles as that specimen image. Focus, Error and Disabled are still exercised directly (not as named content examples) on the component\'s /dev route and in its Playwright spec, the same way button.tsx\'s own dev page adds an extra disabled instance beyond its four named demos.',
    "`states`' prototype source (`inStates`) carries a `tk` column per row (e.g. Default's \"--border · --mute text\", Focus's \"ring + --accent-line\") that `StateDocSchema` has no field for — the same scope limit button.ts's own `states` shape change didn't need to solve, because Buttons' states table had no such column. Not reintroduced as a new schema field here: every token named in each row's `tk` already appears in this entry's own `tokens` section (§08) with its own usage sentence, so nothing is lost, only not duplicated per-state. Flagged for review in case a future ticket wants it structured per-state instead.",
    "The States section's own closing line (\"There is no success state and no read-only variant distinct from disabled…\") has no home in the existing schema — `StateDocSchema` has no slot for prose that follows the whole table, unlike Variants' own `variantsNote` (`archive/v1/NOTES.md`'s documented \"close with a --faint note explaining a deliberate omission\" pattern, which Variants already had a field for). Added `statesNote` (packages/content/src/schema/component.ts) as that same pattern's States-side counterpart, rendered by apps/docs/app/components/[slug]/page.tsx's States section and apps/docs/lib/llms.ts the same way `variantsNote` already is. No other entry has used `states` with a closing note before, so this is additive, not breaking — flagged for Cory as a schema decision, the same class of flag button.ts's own `states` shape change got.",
  ],
});
