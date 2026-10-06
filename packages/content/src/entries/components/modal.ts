import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/modal/examples";

/**
 * Modal, extracted from archive/v1/Workspace Shell.dc.html (template
 * 11888-12197, logic `modalAnatomy`/`modalContent`/`modalA11y`/
 * `modalTokens`/`modalRelated`/`modalLog` 16433-16469, `modalSizeData()`
 * 15249-15257, `modalSizeRows`/`modalSizes` derivations 16841-16844, the
 * live "SYSTEM OVERLAYS" modal markup ~13483-13493) per docs/build-guide.md
 * §3, replacing the draft stub popover.ts's own `useInstead` row and
 * tooltip.ts's "the line against Modal" sentence created so they had
 * somewhere real to point (this ticket, LDS-040). This is the template
 * ticket for every remaining overlay (Drawer, Toast): the same path
 * Callout (LDS-005) opened for standalone content, Modal now opens for
 * overlays. Prose is verbatim (ADR-0009); inline `<span>` colour styling on
 * "Drawer"/"Popover" in the opening boundary sentence and the Usage card,
 * and on "Drawer" again in the Sizes section's own closing note, is dropped
 * as markup, not content, the same call popover.ts's own entry already made
 * for the identical pattern. See extractionNotes for every place structured
 * metadata was added or a value was restructured rather than lifted
 * directly.
 */
export const modal = ComponentEntrySchema.parse({
  meta: {
    id: "modal",
    name: "Modal",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-24",
  },
  purpose: "An overlay that must be answered before the operator can do anything else.",
  description: {
    summary: "A modal is a centred dialog that stops the workspace until the operator answers it.",
    boundary:
      "It is the most expensive surface in the system, because it takes away every other choice on the screen. That cost is the whole reason it exists: a decision that must not be missed. The line against a Drawer is whether the work behind may continue — a drawer accompanies, a modal interrupts. If the operator could reasonably ignore it for a minute and carry on, it was never a modal.",
  },
  anatomy: [
    {
      number: "1",
      name: "Scrim",
      description:
        "A dim over the whole workspace, blurred enough to say the page is out of reach but not enough to hide it. Clicking it closes a non-destructive modal and does nothing on a destructive one.",
    },
    {
      number: "2",
      name: "Dialog",
      description:
        "Centred, square-cornered, on --panel-2 with a --border-2 hairline and a soft drop shadow — one of the few surfaces in the system allowed elevation, because it genuinely floats.",
    },
    {
      number: "3",
      name: "Header",
      description:
        "The question itself, set as a question: \"Delete 'rebalance'?\". The close glyph sits opposite it and is always present except on a destructive confirm.",
    },
    {
      number: "4",
      name: "Body",
      description:
        "One or two sentences naming the consequence, in the operator's vocabulary. It never scrolls: if it would, the content was too big for a modal.",
    },
    {
      number: "5",
      name: "Footer",
      description:
        "Exactly two actions, right-aligned, primary last. The primary repeats the verb from the header so the operator can read the header and the button and nothing in between.",
    },
  ],
  anatomyCaption:
    "Each part takes one edge of the frame, and every leader is a single straight line landing square on the target. Positions are measured from the artifact, so the diagram stays true at any size.",
  variants: [
    {
      name: "SM",
      tokens: ["panel-2", "border-2", "accent"],
      description:
        "One question, two buttons, no scrolling. Use SM for destructive confirms and nothing else.",
    },
    {
      name: "MD",
      tokens: ["panel-2", "border-2", "accent"],
      description:
        "The default. Fits a short form — up to six fields — or a decision that needs a paragraph of context. If it starts to scroll, it belongs in a drawer.",
    },
    {
      name: "LG",
      tokens: ["panel-2", "border-2", "accent"],
      description:
        "For dense content that must stay modal: side-by-side comparisons, a table of affected records, a diff. Body scrolls internally; header and footer stay pinned. Past this size, use a full page.",
    },
  ],
  variantsNote:
    "There is no XL modal and no full-screen modal. Past LG the dialog stops being a decision and becomes a workspace, and a workspace that cannot be left is a trap — that content belongs in a Drawer or on a page of its own.",
  usage: {
    useWhen: [
      "The action is destructive or irreversible and deserves a deliberate pause.",
      "Nothing else on the screen makes sense until this is answered.",
      "The whole decision fits on one screen with no internal scrolling.",
      "There are exactly two ways out, and both are named.",
    ],
    useInstead: [
      {
        target: "drawer",
        text: "The work behind stays relevant — that is a Drawer.",
      },
      {
        target: "popover",
        text: "It is a few choices anchored to the control that opened it — that is a Popover.",
      },
      {
        target: "toast",
        text: "It only reports that something happened — that is a Toast.",
      },
      {
        target: "drawer",
        text: "It is a form with sections, or anything that scrolls — that is a drawer or a page.",
      },
    ],
  },
  contentRules: [
    {
      text: 'The header is the question, not the feature: "Delete \'rebalance\'?" — never "Confirm deletion" and never "Are you sure?".',
    },
    {
      text: "Name the object in quotes and the consequence in the body: what stops, what survives, and whether it can be undone.",
    },
    {
      text: 'The primary button repeats the verb — "Delete workflow", "Stop runs" — so the action is legible without reading back up.',
    },
    {
      text: 'The secondary is always the plain word "Cancel". It is not a variation and it is never styled to compete.',
    },
    {
      text: "Two actions maximum. A third option means the decision has not been framed yet, not that the footer needs another button.",
    },
  ],
  examples: [
    { id: "demo", kind: "demo", title: "Demo", source: `${EXAMPLES_DIR}/demo.tsx` },
    { id: "sm", kind: "demo", title: "SM", source: `${EXAMPLES_DIR}/sm.tsx` },
    { id: "md", kind: "demo", title: "MD", source: `${EXAMPLES_DIR}/md.tsx` },
    { id: "lg", kind: "demo", title: "LG", source: `${EXAMPLES_DIR}/lg.tsx` },
    {
      id: "good-named-verb-button",
      kind: "good",
      title: "Named object, repeated verb",
      caption: "The object is named, the consequence stated, and the button repeats the verb.",
      source: `${EXAMPLES_DIR}/good-named-verb-button.tsx`,
    },
    {
      id: "bad-are-you-sure",
      kind: "bad",
      title: '"Are you sure?" with OK',
      caption: 'Never "Are you sure?" with OK — the operator has to guess what OK agrees to.',
      source: `${EXAMPLES_DIR}/bad-are-you-sure.tsx`,
    },
    {
      id: "good-two-actions",
      kind: "good",
      title: "Two ways out",
      caption: "Two ways out, one of them primary, and no third path competing.",
      source: `${EXAMPLES_DIR}/good-two-actions.tsx`,
    },
    {
      id: "bad-four-actions",
      kind: "bad",
      title: "Four actions in a footer",
      caption: "Never four actions in a footer — a modal with a menu in it is a decision nobody can make.",
      source: `${EXAMPLES_DIR}/bad-four-actions.tsx`,
    },
    {
      id: "good-one-field",
      kind: "good",
      title: "One field",
      caption: "One field is fine — a single input is still one decision.",
      source: `${EXAMPLES_DIR}/good-one-field.tsx`,
    },
    {
      id: "bad-scrolling-form",
      kind: "bad",
      title: "A scrolling form",
      caption: "Never a scrolling form in a modal — if it needs sections, it needed a drawer.",
      source: `${EXAMPLES_DIR}/bad-scrolling-form.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Dialog and modal",
      body: 'role="dialog" with aria-modal, labelled by the header and described by the body, so the announcement carries the question and the consequence together.',
    },
    {
      title: "Focus is trapped",
      body: "Focus moves to the dialog on open and cycles inside it — this is the one place a trap is correct. On close it returns to the control that opened the modal.",
    },
    {
      title: "Escape, always",
      body: "Escape closes any modal, including destructive ones, because cancelling is never the dangerous path. The scrim click is only wired up when nothing can be lost.",
    },
    {
      title: "No default on destruct",
      body: "The primary is focused on a benign modal so Enter confirms; on a destructive one focus lands on Cancel, so a stray keystroke cannot delete anything.",
    },
  ],
  tokens: [
    { tokens: ["panel-2"], usage: "Dialog surface." },
    { tokens: ["border-2"], usage: "Dialog hairline." },
    { tokens: ["border"], usage: "Header and footer rules." },
    { tokens: ["accent"], usage: "Primary action." },
    { tokens: ["dim", "mute"], usage: "Body copy and Cancel." },
  ],
  propGuidance: [],
  relationships: [
    {
      target: "drawer",
      kind: "often-confused-with",
      text: "A drawer accompanies work that carries on; a modal stops it. Anything that scrolls belongs to the drawer.",
    },
    {
      target: "popover",
      kind: "often-confused-with",
      text: "A popover is anchored to its trigger and dismissible by looking away; a modal is centred and must be answered.",
    },
    {
      target: "toast",
      kind: "often-confused-with",
      text: "A toast reports what already happened. If no answer is needed, the modal was the wrong shape.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-23",
      text: "Footer capped at two actions; destructive modals now focus Cancel and ignore scrim clicks.",
    },
    {
      version: "1.0.2",
      date: "2026-08-18",
      text: "Internal scrolling ruled out; oversized content redirected to the drawer.",
    },
    {
      version: "1.0.0",
      date: "2026-08-10",
      text: "Modal introduced at three widths with scrim, header, body and footer.",
    },
  ],
  extractionNotes: [
    'This entry completes the draft stub modal.ts\'s own LDS-039 (popover.ts) and LDS-038 (tooltip.ts) tickets created it to point at ("modal", packages/content/src/entries/components/modal.ts) — this ticket (LDS-040) is that future ticket. `purpose` is kept unchanged from the stub (CONTEXT.md\'s own glossary line) rather than reworded to the opening sentence\'s own phrasing, the same "no paraphrase needed" call popover.ts\'s own stub-completion note already made for the identical situation.',
    'Section 02 ("Sizes", archive/v1 lines 11946-11983) is modelled as `variants` rather than a dedicated schema field: the schema has no "sizes" concept (`ComponentEntrySchema` — confirmed against packages/content/src/schema/component.ts), and SM/MD/LG are "a designed alternative form of a component, chosen by the author" (CONTEXT.md\'s own Variant definition), the same fit popover.ts\'s own entry already found for its Menu/Detail Kinds section. Each variant\'s own `tokens` array lists the same three representative colour tokens (`panel-2`/`border-2`/`accent`) rather than distinguishing ones: the three sizes share one visual treatment and differ only in width, which `ColorTokenNameSchema` has no slot for at all — flagged here as a schema gap, not fabricated as if the sizes differed chromatically. The Sizes table\'s own "WHEN" column (`modalSizeRows`\' `body`, archive/v1 line 15256 etc.) becomes each variant\'s `description`, verbatim; its own meta tagline (`modalSizeRows`\' `w`, e.g. "SM · 400px · SINGLE DECISION", archive/v1 line 16841-16842) is dropped as a redundant structural label with no schema slot — the width and the name already carry that information between them.',
    'The three widths (400px/560px/760px, `modalSizeData()` archive/v1 lines 15250-15256) have no Spacing-ramp match (ramp: 4, 6, 8, 12, 16, 18, 22, 32, 44) — added as new `--modal-width-sm`/`-md`/`-lg` tokens (packages/tokens/tokens/modal.json), the same component-specific-exception category `--popover-panel-width` already established (LDS-039) for the identical kind of gap. Applied via `style={{ width: MODAL_WIDTH[size] }}` on `ModalContent`/`ModalConfirmContent` (packages/ui/src/modal/modal.tsx), the same inline-style pattern popover.tsx\'s own `popover.panelWidth` usage already set precedent for. Flagged in the PR (LDS-040).',
    "The dialog's own `max-width:92vw` (archive/v1's live \"SYSTEM OVERLAYS\" modal markup, not the docs-page template) is carried over as a literal viewport-relative value, the same way the prototype's own live code sets it directly rather than through a token — there is no Spacing-ramp step a viewport fraction could snap to. A matching `max-height:92vh` is added (not present in the prototype's own markup, which never shows a tall enough live example to need one) so the Sizes section's own LG prose — \"Body scrolls internally; header and footer stay pinned\" — has something to actually constrain against; `ModalBody`'s own `overflow-y-auto` is what scrolls. Flagged in the PR as an addition beyond the harvested markup, made to satisfy a written rule the live demo itself never exercises.",
    "The Tokens section's own sixth row (\"Panel · 260ms\", not a colour token) is dropped from the structured `tokens` field, the same gap popover.ts's and tooltip.ts's own entries already flagged for their own non-colour Tokens rows (`ColorTokenNameSchema` is colour-only). Unlike popover.ts's own `panelIn`-duration gap, this one needs no override decision at all: the row's own \"260ms\" is already the system's `--duration-panel` default (`animate-panel-in`'s own built-in duration, packages/tokens/tokens/motion.json), so `ModalContent`/`ModalConfirmContent` use the utility unmodified — the prototype's own live modal markup's literal `animation:panelIn .22s …` (220ms) is the one site that doesn't match its own documented 260ms, kept as a flagged prototype-internal inconsistency rather than followed, the same treatment popover.ts's own entry already gave an identical mismatch (there, the shipped 260ms default against the live demo's own literal 160ms \"row menu\" duration). The scrim's own `fadeIn .18s ease` likewise already matches `--duration-control` (180ms) exactly, needing no override either.",
    'The scrim\'s own `backdrop-filter:blur(6px)` (archive/v1\'s live "SYSTEM OVERLAYS" modal markup) has no Lairy foundation or token to snap to at all — unlike colour, spacing, radius, typography, icons, motion and elevation, "Blur" has no foundation page and no token group (confirmed against packages/content/src/entries/foundations and packages/tokens/tokens). `backdrop-blur-sm` (Tailwind\'s own un-reset default scale, 8px) is used as the nearest available step: Tailwind\'s default blur scale runs 4/8/12/16/24/40/64px (`xs`/`sm`/`md`/`lg`/`xl`/`2xl`/`3xl`), and 6px sits exactly between `xs` (4) and `sm` (8) with no closer tie-break precedent to reach for — resolved toward the stronger blur so the scrim reads unambiguously "out of reach," the same direction (not closeness) `docs/prd.md §8.3`\'s own default snap-up convention already picks for an ambiguous middle value. Flagged in the PR (LDS-040) and as a `needs-triage` follow-up: a Blur foundation/token group is missing entirely, and Drawer (this ticket\'s blocker for the next overlay) will hit the identical gap at its own 4px.',
    "`packages/tokens/tokens/spacing.json` gains a `--spacing-0: 0px` entry, the one change in this PR that isn't scoped to Modal: Tailwind v4's `inset`/`top`/`right`/`bottom`/`left`/`translate` utility families look up their numeric value against the same `--spacing-*` namespace padding/margin already use, but — unlike `p-0`/`m-0`, which Tailwind special-cases to `0px` unconditionally — do not fall back to a literal zero when the exact key is missing. Confirmed by instrumenting a throwaway element: with no `--spacing-0` defined, `inset-0` resolved to `top: auto; right: auto; bottom: auto; left: auto` (and `translate-x-0` to `none`), silently collapsing `ModalContent`'s own `fixed inset-0` scrim to a 0×0 element with no visible dim or blur at all — passing every automated check (axe found nothing wrong with an invisible, correctly-labelled overlay) while being visibly broken, only caught by actually looking at a rendered screenshot. Named ramp steps (`inset-4`), fractions (`left-1/2`, `-translate-x-1/2`) and keywords (`top-full`) were all already working; only the bare zero was missing. Modal is the first component in the catalogue to need a `fixed`, viewport-anchored overlay at all (Popover's and Tooltip's own floating surfaces use anchored `absolute` positioning with no `inset-0`), so nothing hit this gap before. Flagged in the PR as a correction, not a new design decision — zero carries no designed space to choose between, the same reasoning `docs/prd.md §8.3`'s own ramp already implies by omitting it.",
    "The scrim's own `background:color-mix(in srgb,var(--bg) 55%,transparent)` becomes Tailwind's `bg-bg/55` opacity modifier, which composes the equivalent mix in the `oklab` colour space rather than `srgb` (Tailwind v4's own default interpolation space for an opacity modifier) — a technical colour-space difference from the harvested literal, not a value change, and visually negligible at this opacity. Flagged in the PR as the first component to carry this gap; popover.tsx's and tooltip.tsx's own entries never needed a translucent fill and didn't hit it.",
    'Anatomy #2\'s own elevation (`z-index:80`, archive/v1\'s live "SYSTEM OVERLAYS" modal markup) is applied as an inline `style={{ zIndex: zIndex.overlay }}` from the real `elevation.json` "z" group ("Overlay... Modal and drawer — the blocking layer", value 80) rather than a Tailwind `z-80` class: Tailwind\'s own default z-index scale stops at 50, this repo\'s `@theme` block (packages/tokens/build.mjs) never names a z-index scale at all (confirmed by grep — no `--z-*` line in `src/css/tailwind-theme.css`), and inventing a new `z-80` utility class is a themeing decision out of this ticket\'s scope (AGENTS.md rule 9 "stay in scope"). The same escape popover.tsx\'s own `style={{ width: popoverTokens.panelWidth }}` already uses for a value with no utility-class home. Flagged in the PR as a themeing gap worth a dedicated ticket: `elevation.json`\'s own "z" group is already real data (`zIndex` TS export, LDS-015) with nowhere for Tailwind consumers to reach it except this same inline-style escape, every time.',
    "Title text (anatomy #3, the live overlay markup's own `font-size:17.5px`, shared with Drawer's own title) snaps to Type style Section (17px) — 0.5px off, the closest existing step and the same \"nearest step wins\" default docs/prd.md §8.2 already sets for an off-scale literal (its own worked example snaps a 19px literal onto this same Section style). `font-heading`/`font-semibold` carry the \"Space Grotesk, 600 weight\" prose exactly as written.",
    'Usage\'s own fourth "use something else when" row ("It is a form with sections, or anything that scrolls — that is a drawer or a page.", archive/v1 line 12008) is the only one of the four not naming a single capitalised component (the other three each style one proper noun — Drawer, Popover, Toast — in `<span style="color:var(--fg)">`; this one reads "a drawer or a page" in plain lowercase prose) — `UseInsteadSchema.target` takes exactly one `EntryId`, and "page" is not a cataloguable entry at all (CONTEXT.md has no Page entry). Mapped to `drawer` a second time, since a drawer is the one real destination this line actually names; the "or a page" half is kept in the verbatim `text` but has nowhere else to point. Flagged in the PR per docs/build-guide.md §3 ("ambiguous or contradictory text: keep it, flag it").',
    "Drawer (`drawer`, packages/content/src/entries/components/drawer.ts) and Popover (`popover`) both already exist as real entries (LDS-039's own popover.ts created the Drawer stub; LDS-038/LDS-039 both already point `useInstead`/relationship rows at Modal) — this ticket is the one that finally completes the entry both were pointing at, rather than creating another stub of its own. Toast (`toast`) already exists as a full entry too (its own ticket landed separately), so all three of Modal's Related cards and `useInstead` targets resolve to real, non-draft entries with nothing left to stub.",
    'Relationship `kind` is new structured metadata the prototype\'s own Related cards carry no tag for, the same gap popover.ts\'s and tooltip.ts\'s own entries already flag. All three of Modal\'s own cards (Drawer, Popover, Toast) are modelled `often-confused-with`: each draws a boundary against a surface genuinely easy to reach for instead of Modal (the same "which overlay is this, really" question popover.ts\'s own Modal/Tooltip relationships already answered this way), not a `composes-with`/`contrasts-with`/`alternative` relationship — none of the three compose with Modal, and "contrasts-with" (popover.ts\'s own choice for its Select relationship) doesn\'t fit three boundary cases that are each a plain either/or. Flagged for Cory alongside popover.ts\'s and tooltip.ts\'s own relationship-kind calls.',
    '`aria-modal="true"` (Accessibility "Dialog and modal") is set explicitly on both `ModalContent` and `ModalConfirmContent` — confirmed against @radix-ui/react-dialog\'s own source (node_modules/.pnpm/@radix-ui+react-dialog@*/…/dist/index.js, `DialogContentImpl`) that neither Radix primitive sets it by default in the installed version, relying instead on `role="dialog"`/`"alertdialog"` plus hiding every other element via the `aria-hidden` package (`hideOthers`, `DialogContentModal`) to convey modality. Both are valid per the WAI-ARIA Dialog (Modal) Pattern, but the entry\'s own Accessibility prose names `aria-modal` explicitly, so it is set rather than left to the library\'s own choice.',
    'Radix\'s `DialogPrimitive.Root`/`AlertDialogPrimitive.Root` both default `modal` to `true` (focus-trapped, background `aria-hidden`, scroll-locked) and need no override at all — the opposite call from popover.tsx\'s own `PopoverMenu`, which explicitly overrides the same default to `false`. Modal\'s own Accessibility section ("Focus is trapped... this is the one place a trap is correct") is the first entry in the catalogue whose spec actually wants Radix\'s own default behaviour unmodified.',
'`ModalConfirmContent` adds no override of its own at all for either half of "No default on destruct": Radix\'s `AlertDialogContent` already focuses whichever `AlertDialogCancel` (this entry\'s `ModalConfirmCancel`) is rendered inside it by default, via its own internal `cancelRef` context, and already hardcodes `onPointerDownOutside`/`onInteractOutside` to `event.preventDefault()` — confirmed against @radix-ui/react-alert-dialog\'s own source (node_modules/.pnpm/@radix-ui+react-alert-dialog@*/…/src/alert-dialog.tsx): its own `AlertDialogContentProps` type doesn\'t even expose those two props to override (`Omit<DialogContentProps, "onPointerDownOutside" | "onInteractOutside">`). This is the first entry in the catalogue whose spec wants a Radix default exactly as shipped on both counts, the opposite situation from popover.tsx\'s own `modal={false}` override. `ModalContent` (the benign kind) does need its own override, since plain `DialogContent` has no equivalent built-in preference for which button gets focused: its own `onOpenAutoFocus` searches its rendered subtree for a `data-slot="modal-action"` element and focuses it (Accessibility "the primary is focused... so Enter confirms"), falling back to Radix\'s own default tab-order focus when no `ModalAction` is present (e.g. a single-button dialog) rather than throwing, and letting a consumer\'s own `onOpenAutoFocus` prop run first and call `preventDefault()` to take over entirely (e.g. focusing a form field instead — not exercised by any example here, since `good-one-field.tsx`\'s rename field already carries its own value and doesn\'t need a first keystroke, but the escape hatch exists for a future one that does).',
    'The destructive primary action ships in the ordinary `primary` Button variant (accent fill), never `danger`: the prototype\'s own live modal demo ships its "DELETE" action in the identical accent-filled style as any other primary button (archive/v1\'s live "SYSTEM OVERLAYS" markup, `class="ds btn btn-primary"` on both CANCEL\'s sibling and the confirm button alike) — the same "Never colour alone" call button.ts\'s own Danger-label note and popover.ts\'s own destructive-row note already make, here extended to say the confirm button itself isn\'t coloured for the danger either. The external trigger in `demo.tsx`/the three \'good\'/\'bad\' destructive examples does use Button\'s own `danger` variant, since that trigger is a row action (the same context button.ts\'s own Danger variant already targets), not the modal\'s own primary action.',
    '`propGuidance` is empty, the same gap popover.ts\'s own entry already flags for the identical reason: `extractProps`\'s own `propFilter` (packages/content/src/props.ts) keeps only props declared outside `node_modules`, and the one component react-docgen-typescript resolves for this id — `Modal` itself (the benign root, `ComponentProps<typeof DialogPrimitive.Root>`) — declares no props of its own at all; confirmed by running the extraction, the generated Props table for this entry is empty. `ModalConfirm` and every other named export (`ModalContent`, `ModalConfirmContent`, `ModalCancel`, `ModalAction`, …) have the same problem one level removed, the same "one component per entry" gap (LDS-009) popover.ts\'s own entry already flags for its own multi-export family — this is now the second entry to hit it. All stay documented in their own JSDoc in modal.tsx and in Accessibility above, but have no generated Props row for a guidance note to attach to. Flagged for Cory alongside popover.ts\'s own identical flag.',
  ],
});
