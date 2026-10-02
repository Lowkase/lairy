import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/textarea/examples";

/**
 * Textarea, extracted from archive/v1/Workspace Shell.dc.html (template
 * 4178–4460, logic constants `taAnatomy` 16333 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on "Text input" in the opening boundary sentence, and on
 * component names inside the Usage "use something else" rows, is dropped
 * as markup, not content. Like text-input.ts, this entry has no Variants
 * section at all — the prototype's own page goes Anatomy → States →
 * Usage — so `variants` stays the schema default `[]`. This was a draft
 * stub (LDS-028/text-input.ts's own `alternative` relationship target);
 * promoted to a full entry here. See extractionNotes for every place
 * structured metadata was added, a literal had no clean token, or the
 * shipped component deliberately departs from the prototype's own markup.
 */
export const textarea = ComponentEntrySchema.parse({
  meta: {
    id: "textarea",
    name: "Textarea",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-10-02",
  },
  purpose: "The text input grown tall enough to hold a sentence the operator writes in their own words.",
  description: {
    summary:
      "A textarea is the text input grown tall enough to hold a sentence the operator writes in their own words.",
    boundary:
      "Border, radius, padding and type are inherited from Text input unchanged — only the height, the line-height and the resize handle are new, which is why the two never look like different components. Reach for it when the answer is prose: a note, a reason, a description. If the value is a name, a key or a number, the taller box is a promise the content will not keep.",
  },
  anatomy: [
    {
      number: "1",
      name: "Label",
      description:
        "The same 12px --dim caps line as every other field. A textarea is often the last question in a form, which is exactly when the label matters most — it is the one the operator reads after thinking.",
    },
    {
      number: "2",
      name: "Field",
      description:
        "The input’s box with a 56px minimum height and 1.55 line-height, opening at about three lines. The height is the only promise the component makes about length, so it is set to the expected answer rather than to the maximum.",
    },
    {
      number: "3",
      name: "Handle",
      description:
        "The native corner grip, vertical only. The operator can make room for a longer answer, but the box can never get wider than the column it sits in.",
    },
    {
      number: "4",
      name: "Hint",
      description:
        "One 11px --faint line for the constraint — plain text, no formatting, what the note is for. It shares its slot with the error, so validation never moves the field.",
    },
    {
      number: "5",
      name: "Counter",
      description:
        "The live count against the limit, right-aligned on the hint row. It is present from the first keystroke wherever a limit exists, and it turns with the message when the limit is passed.",
    },
  ],
  anatomyCaption:
    "The input’s box with three lines of room, a vertical-only handle, and the same hint row underneath. Each part takes one edge and every position is measured from the artifact.",
  states: [
    {
      name: "Default",
      description:
        "Empty, three lines tall. The empty height is the component’s only cue about how much is wanted, so it is chosen deliberately rather than left at the browser default.",
    },
    {
      name: "Filled",
      description:
        "Holds prose. Line-height goes to 1.55 — the one measurement that differs from the input — because several lines of mono at 1.6 start to read as a paragraph rather than a field.",
    },
    {
      name: "Focus",
      description:
        "Being written in. Identical to the input’s focus, and the field never scrolls or grows underneath the operator while they type.",
    },
    {
      name: "Error",
      description:
        "Over the limit or missing when required. The counter turns with the border and the message says how much to cut, since “too long” without a number is not actionable.",
    },
    {
      name: "Disabled",
      description:
        "Not editable now. The handle goes with it — a box that can still be resized but not typed into reads as a bug rather than a restriction.",
    },
  ],
  statesNote:
    "The handle is vertical only, and there is no auto-growing variant. A box that resizes itself while the operator types moves the buttons under their cursor, and a box that resizes horizontally breaks the one column of boxes every form here is built on.",
  usage: {
    useWhen: [
      "The answer is a sentence or two in the operator’s own words.",
      "Line breaks are part of the meaning — a note, a list, a pasted log.",
      "What is written will be read back later, by a person.",
      "The operator may want to see the whole answer at once before submitting.",
    ],
    useInstead: [
      {
        target: "text-input",
        text: "The answer is a value on one line — that is a Text input.",
      },
      {
        target: "select",
        text: "The answers are a known list — that is a Select.",
      },
    ],
  },
  contentRules: [
    {
      text: "Set the opening height to the answer you expect, about three lines. A taller box asks for an essay; a one-line box tells the operator to be brief when they should not be.",
    },
    {
      text: "Write the placeholder as an example of a useful note, never as the label repeated — and never as the only statement of what the field is for.",
    },
    {
      text: "Show the counter from the first keystroke wherever a limit exists, counting up to the limit, and never let the limit arrive as a surprise.",
    },
    {
      text: "Say what the note is for in the hint — who reads it, whether it is kept — because prose is only worth writing if the operator knows where it goes.",
    },
    {
      text: "Never accept formatting the field cannot render. If markdown or headings are needed, the answer is an editor and not a taller box.",
    },
  ],
  propGuidance: [
    {
      prop: "limit",
      note: 'The soft character limit the live counter counts against (anatomy #5, Content rule 3) — never the native `maxLength`, which blocks typing past it with no feedback (Do and don\'t "Never swallow keystrokes at the limit with no counter"). Typing is always allowed past it; the counter and an auto-generated "N characters — trim M" message turn with it instead (Do and don\'t "Over the limit, the counter turns with the message").',
    },
    {
      prop: "error",
      note: "Overrides the auto-generated over-limit message when set, for a semantic validation failure the caller owns (e.g. required but empty) rather than a length one.",
    },
    {
      prop: "rows",
      note: 'Defaults to 3 — "opening at about three lines" (anatomy #2). Native, so any value the caller passes is honoured.',
    },
  ],
  examples: [
    {
      id: "why-it-was-skipped",
      kind: "demo",
      title: "Why it was skipped",
      source: `${EXAMPLES_DIR}/why-it-was-skipped.tsx`,
    },
    {
      id: "good-three-lines",
      kind: "good",
      title: "Three lines of room",
      caption: "Three lines of room for a two-line answer, with the limit shown from the start.",
      source: `${EXAMPLES_DIR}/good-three-lines.tsx`,
    },
    {
      id: "bad-one-line",
      kind: "bad",
      title: "A one-line textarea",
      caption: "Never ship a one-line textarea — if the answer will not fit, the operator writes less than they meant to.",
      source: `${EXAMPLES_DIR}/bad-one-line.tsx`,
    },
    {
      id: "good-vertical-handle",
      kind: "good",
      title: "A vertical-only handle",
      caption: "A vertical-only handle in the corner: the operator can make room, and the column stays intact.",
      source: `${EXAMPLES_DIR}/good-vertical-handle.tsx`,
    },
    {
      id: "bad-horizontal-resize",
      kind: "bad",
      title: "Resized wider than the form",
      caption: "Never allow horizontal resize — one box wider than the rest breaks the column every form is read down.",
      source: `${EXAMPLES_DIR}/bad-horizontal-resize.tsx`,
    },
    {
      id: "good-counter-over-limit",
      kind: "good",
      title: "The counter turns over the limit",
      caption: "Over the limit, the counter turns with the message and says how much to cut.",
      source: `${EXAMPLES_DIR}/good-counter-over-limit.tsx`,
    },
    {
      id: "bad-swallowed-keystrokes",
      kind: "bad",
      title: "Keystrokes swallowed at the limit",
      caption: "Never swallow keystrokes at the limit with no counter — the operator thinks the field is broken.",
      source: `${EXAMPLES_DIR}/bad-swallowed-keystrokes.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Labelled like any field",
      body: "A real <label for> and an aria-describedby pointing at the hint or error, exactly as the text input does. The taller box does not change the contract, and the label is never a placeholder.",
    },
    {
      title: "The counter is spoken",
      body: "The count is a polite live region, so an operator who cannot see it hears how much room is left rather than discovering the limit when keystrokes stop landing.",
    },
    {
      title: "Tab leaves the field",
      body: "Tab moves to the next control and Enter inserts a newline — the reverse of the input, and the reason a textarea is never the last thing before an implicit submit.",
    },
    {
      title: "Resize is not the only way",
      body: "The handle is a convenience: the field scrolls its content and the value is never truncated visually without the counter saying so, so nothing depends on a drag a keyboard cannot perform.",
    },
  ],
  tokens: [
    { tokens: ["border"], usage: "Resting field border" },
    { tokens: ["accent-line"], usage: "Field border while focused" },
    { tokens: ["accent-soft"], usage: "Focus ring" },
    { tokens: ["bg"], usage: "Field fill" },
    { tokens: ["border-2"], usage: "Resize handle grip" },
    { tokens: ["faint"], usage: "Disabled value" },
    { tokens: ["mute"], usage: "Hint and counter" },
    { tokens: ["alarm-line"], usage: "Error border" },
  ],
  relationships: [
    {
      target: "text-input",
      kind: "composes-with",
      text: "The box this inherits. Everything except height, line-height and the handle is documented there, and any change to the input changes this too.",
    },
    {
      target: "modal",
      kind: "composes-with",
      text: "Where a long note usually belongs. A textarea inline in a dense panel is a hint the task deserved its own surface.",
    },
    {
      target: "button",
      kind: "composes-with",
      text: "What commits the note. Enter is a newline here, so the submit has to be a real button rather than an implicit one.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-25",
      text: "Resize locked to vertical; auto-grow ruled out; counter required wherever a limit exists.",
    },
    {
      version: "1.0.1",
      date: "2026-08-17",
      text: "Minimum height set to 56px and line-height to 1.55; disabled state now disables the handle.",
    },
    {
      version: "1.0.0",
      date: "2026-08-11",
      text: "Textarea introduced as the text input with three lines of room.",
    },
  ],
  extractionNotes: [
    "Promoted from a draft stub (created by text-input.ts/LDS-028 so its own `alternative` relationship and \"use something else\" row had somewhere real to point) to a full entry here. `select`, `button` and `modal` already exist (`select`/`checkbox`/`radio` were likewise created as stubs by text-input.ts; `modal` predates both).",
    "Relationship `kind`: all three are `composes-with` — Text input, because this entry's own boundary sentence says the box is inherited and \"any change to the input changes this too\" (a tighter coupling than `alternative`, which the Usage section's own `text-input` row already covers separately); Modal and Button, matching the exact `composes-with` kind text-input.ts's own relationships of the same targets already used, for the same reasoning (where the two are described appearing together). Flagged for review as three same-kind rows in one entry — the weakest-fit is Text input's, since \"inherits from\" has no clean match among the four kinds CONTEXT.md defines (alternative, composes-with, contrasts-with, often-confused-with).",
    "The Usage section's 3rd and 4th \"use something else\" rows — \"the content needs formatting, headings or links — that is an editor, not a field\" and \"it is a query that runs as it is typed — that is the command bar\" — name no Lairy entry (an editor and the command bar are both out of this design system's current component set), the same shape of omission text-input.ts's own fourth row (\"the command bar, not a form field\") and button.ts's \"a link, styled as text\" row already hit. Not structured `useInstead` rows; quoted here verbatim for the record.",
    "Anatomy #1's label and anatomy #4's hint/counter are byte-identical in size and colour role to text-input.ts's own anatomy #1/#3/#4 (12px --dim label, 11px --faint hint/counter) — no new snap needed, same reasoning already recorded there (12px lands exactly on Label, 11px exactly on Micro). The shipped component (packages/ui/src/textarea/textarea.tsx) reuses the identical `text-label`/`text-micro` classes for exactly that reason: this entry's own boundary sentence says the two fields must never look like different components.",
    "Anatomy #2's \"56px minimum height\" has no spacing-ramp match (4, 6, 8, 12, 16, 18, 22, 32, 44) and isn't close enough to any single step for docs/prd.md §8.3's default snap table to apply. Rather than invent an arbitrary height value (AGENTS.md rule 1), the shipped component uses the native `rows` attribute, defaulted to 3, to express \"opening at about three lines\" (this entry's own anatomy #2 and anatomy caption) directly — `rows` is the semantically correct HTML mechanism for this exact promise (\"the height is the only promise the component makes about length\") and needs no pixel figure or token at all. Flagged for the token decisions backlog alongside every other unsnapped literal (scrollbar.ts's 10px lane, text-input.ts's 74px retry field).",
    "The Field state's own \"1.55\" line-height (States 'Filled': \"Line-height goes to 1.55 — the one measurement that differs from the input\") has no token: `packages/tokens/src/css/tailwind-theme.css` sets `--leading-*: initial` (ADR-0003, the same theme-removal text.tsx's own extractionNotes already document), and only paired per-type-style line-heights exist (`--text-body--line-height: 1.6`, etc.) — there is no standalone `--leading-*` scale to pull 1.55 from, and Body's own baked-in value is 1.6, not 1.55. The shipped component applies `style={{ lineHeight: 1.55 }}` directly, the same inline-style technique button.tsx's own `transitionDuration`/`transitionTimingFunction` already established for a token-sourced value with no corresponding Tailwind utility. Flagged for the token decisions backlog — a `leading-155`-equivalent utility, or a dedicated non-themeable typography token, would let this become a class instead.",
    "Anatomy #3's handle and inTokens' own `--border-2 | Resize handle grip` row are kept verbatim, but the shipped component does not restyle the native resize grip's colour: cross-browser, only WebKit/Blink expose any hook at all (`::-webkit-resizer`), Firefox has none, and even WebKit's hook only swaps a background colour behind the browser's own fixed glyph — a much narrower surface than scrollbar.ts's own `::-webkit-scrollbar*`/`scrollbar-color` pair, which covers every major engine. Left fully native rather than a one-engine-only partial restyle. The `tokens` row stays in the entry (the prototype's own stated intent) but is flagged as not reproduced in the shipped component, the same class of gap sbTokens' own transparent/radius rows got in scrollbar.ts's extractionNotes.",
    "`limit` (not `maxLength`) is a deliberate, differently-named prop from text-input.ts's own `TextInputProps.maxLength`: the Do/don't section's own bad example 6 — \"Never swallow keystrokes at the limit with no counter — the operator thinks the field is broken\" — is a direct description of what the native HTML `maxlength` attribute does (it silently stops accepting input at the limit). `TextareaProps` omits `maxLength` from `ComponentProps<\"textarea\">` entirely so it can't be passed through by accident, and typing is never blocked; `limit` only drives the counter and an auto-generated \"`{length} characters — trim {over}`\" message once `length` exceeds it (matching the Do/don't 'good' specimen's own literal \"528 characters — trim 16\" wording exactly: 528 − 512 = 16). This also means `limit` alone shows the counter — there is no separate `showCounter` boolean the way text-input.ts's `TextInputProps` has one — because Content rule 3 says the counter is \"present from the first keystroke wherever a limit exists,\" unconditionally, unlike Text input's own independently-toggleable counter. Flagged for review as an intentional API asymmetry between the two components, not an inconsistency.",
    "The auto-generated over-limit message takes over the hint/error slot and recolours the counter the same way an explicit `error` does (Error state: \"the counter turns with the border\") — both are driven by one `effectiveError` value (`error ?? overflowMessage`), so an explicit `error` the caller passes always wins over the computed one. This differs from text-input.ts's own \"Validation waits its turn\" (blur/submit only): here the overflow signal is deliberately live, on every keystroke, because Content rule 3 itself says the counter must never let the limit \"arrive as a surprise\" — a live, mechanical overflow count is a different kind of feedback from a semantic validation error, and this entry's own Accessibility list has no \"waits its turn\" note of its own (unlike text-input.ts's). Flagged for review as the one place this entry's validation timing diverges from Text input's.",
    "Anatomy #3's and #4's own \"--faint\" (hint, counter) repeats the exact contrast gap already fixed and documented in text-input.ts's own extractionNotes: axe-measured --faint text at Micro (11px) on the light theme's --bg fails AA (3.69:1, apps/docs/e2e/text-input.spec.ts). The shipped component renders both in `text-mute` instead, for the same reason and with the same `tokens` row split (`faint` → \"Disabled value\", new `mute` row → \"Hint and counter\") text-input.ts's own fix made — not a new finding, carried forward directly rather than re-flagged as if freshly discovered.",
    "inTokens' own `#ff8f6b | Error border, counter and message` repeats text-input.ts's own alarm-contrast gap (~1.9:1 on the light theme's --bg, well under AA) for the same reason: the shipped component borders the field with `border-alarm-line` and renders the error/counter text in `text-fg`, not bare `#ff8f6b`/`text-alarm`. The `tokens` row is shortened to \"Error border\" to match, the same edit text-input.ts's own equivalent row already made.",
    "`disabled:resize-none` (States 'Disabled': \"The handle goes with it\") needs no new token — `resize-*` is a plain CSS keyword utility with no theme scale behind it, unaffected by ADR-0003's theme removal, so `resize-y`/`disabled:resize-none` need no flag.",
    "Exactly one `demo` example (`why-it-was-skipped`), the same \"no Variants section, so no per-variant demo slot\" reasoning text-input.ts's own extractionNotes already give — it reproduces the anatomy diagram's own specimen (label \"Why it was skipped\", the same prose value, hint \"Plain text, no formatting\", `limit=512`).",
    "`bad-one-line` and `good-counter-over-limit` are both produced by the real component (`rows={1}`; a `defaultValue` already past `limit`) — the misuse is a prop choice, not something the component structurally prevents. `bad-horizontal-resize` and `bad-swallowed-keystrokes` are not: the shipped component only ever renders `resize-y` (never exposes horizontal resize) and never wires a native `maxLength` (so keystrokes are never silently swallowed) — both bad examples are built from a raw `<textarea>` outside the component, the same \"misuse the real component can't produce\" treatment scrollbar.ts's and text-input.ts's own bad examples already use.",
  ],
});
