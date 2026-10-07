import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/drawer/examples";

/**
 * Drawer, extracted from archive/v1/Workspace Shell.dc.html (template
 * 12198-12518, logic `drawerAnatomy`/`drawerContent`/`drawerA11y`/
 * `drawerTokens`/`drawerRelated`/`drawerLog` 15523-15559, `drawerSizeData()`
 * 15259-15270, `drawerSizeRows`/`drawerSizes` derivations 16855-16858, the
 * live "SYSTEM OVERLAYS" drawer markup ~13502-13525) per
 * docs/build-guide.md §3, replacing the draft stub popover.ts's own LDS-039
 * ticket created ("A side panel showing the details of one thing without
 * leaving the current view.") so its own Kinds-section closing note and
 * `useInstead` row finally have somewhere real to point. This ticket
 * (LDS-041) follows the exact path modal.ts's own entry (LDS-040) opened as
 * "the template ticket for every remaining overlay" — same anatomy shape,
 * same Sizes-as-variants modelling, same Tokens/Related/Changelog
 * structure. Prose is verbatim (ADR-0009); inline `<span>` colour styling
 * on "Modal"/"Popover"/"Toast" in the opening boundary sentence and the
 * Usage card is dropped as markup, not content, the same call modal.ts's
 * own entry already made for the identical pattern. See extractionNotes
 * for every place structured metadata was added, a value was restructured,
 * or the prototype's own internal inconsistencies were resolved one way
 * over another.
 */
export const drawer = ComponentEntrySchema.parse({
  meta: {
    id: "drawer",
    name: "Drawer",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-23",
  },
  purpose: "A side panel showing the details of one thing without leaving the current view.",
  description: {
    summary:
      "A drawer is a full-height panel that slides in from the right and sits beside the work instead of on top of it.",
    boundary:
      "It is the surface for detail, settings and editing — anything where the page behind stays relevant and the operator should still be able to read it. That is the line against a Modal: a modal interrupts and demands one answer before anything else happens, while a drawer accompanies. If the operator can safely keep looking at the table they came from, it is a drawer.",
  },
  anatomy: [
    {
      number: "1",
      name: "Scrim",
      description:
        "A dim over the work behind, never a blur strong enough to hide it. It is there to say the panel has focus, not to take the page away — a click on it closes the drawer.",
    },
    {
      number: "2",
      name: "Panel and left hairline",
      description:
        "Full height, anchored to the right, square on every corner. The 1px left hairline is the only thing separating it from the page, which is why it is the one border allowed to carry accent.",
    },
    {
      number: "3",
      name: "Header",
      description:
        "The record's name at 17.5px with a tracked meta line under it, and the close glyph in the far corner. It stays pinned so the operator always knows what they are looking at.",
    },
    {
      number: "4",
      name: "Body",
      description:
        "The only scrolling region. One column at SM and MD; labels sit above values so a long value can wrap without breaking the grid.",
    },
    {
      number: "5",
      name: "Footer",
      description:
        "Pinned to the bottom, actions right-aligned, primary last. It holds the single commit for everything in the body — nothing above it saves on its own.",
    },
  ],
  anatomyCaption:
    "Each part takes one edge of the frame, and every leader is a single straight line landing square on the target. Positions are measured from the artifact, so the diagram stays true at any size.",
  variants: [
    {
      name: "SM",
      tokens: ["bg", "border", "accent"],
      description: "360px wide. One column, labels above values, no nested panels.",
    },
    {
      name: "MD",
      tokens: ["bg", "border", "accent"],
      description:
        "480px wide, full height, 1px left hairline, no radius on the outer edge. Slides in over 260ms; the scrim dims rather than blurs the work behind it.",
    },
    {
      name: "LG",
      tokens: ["bg", "border", "accent"],
      description:
        "720px wide. Two columns are allowed at this size only; keep the primary action pinned to the footer so it survives long scrolls.",
    },
  ],
  variantsNote:
    "There is no full-screen drawer. A panel that covers the page has stopped accompanying the work and become a route of its own — at that point it is a page, and it should have a URL, a breadcrumb and a back button rather than a scrim.",
  usage: {
    useWhen: [
      "The operator is inspecting or editing one record while the list it came from stays useful.",
      "The content is longer than a modal should be — a form with sections, an activity log, a config.",
      "They will move through several records in turn, and reopening a centred dialog each time would be punishing.",
      "The work behind must remain readable for reference while the panel is open.",
    ],
    useInstead: [
      {
        target: "modal",
        text: "One decision must be made before anything else can proceed — that is a Modal.",
      },
      {
        target: "popover",
        text: "It is a short set of choices anchored to the control that opened it — that is a Popover.",
      },
      {
        target: "toast",
        text: "It is only confirming that something happened — that is a Toast.",
      },
    ],
  },
  contentRules: [
    {
      text: 'The header names the thing, not the task: "Details", "AUT·02" — never "Edit item details" repeated from the button that opened it.',
    },
    {
      text: "The meta line under the title carries the identifier and nothing else, so the operator can quote it without opening anything further.",
    },
    {
      text: "Labels are sentence case and sit above their values; a value that is empty says so in --faint rather than leaving a blank.",
    },
    {
      text: 'The footer verb states the outcome — "Save changes", "Run now" — and its neighbour is always the plain word "Cancel".',
    },
    {
      text: "If the body needs more than two headed sections, the content has outgrown a drawer and belongs on a page.",
    },
  ],
  examples: [
    { id: "demo", kind: "demo", title: "Demo", source: `${EXAMPLES_DIR}/demo.tsx` },
    { id: "sm", kind: "demo", title: "SM", source: `${EXAMPLES_DIR}/sm.tsx` },
    { id: "md", kind: "demo", title: "MD", source: `${EXAMPLES_DIR}/md.tsx` },
    { id: "lg", kind: "demo", title: "LG", source: `${EXAMPLES_DIR}/lg.tsx` },
    {
      id: "good-pinned-footer",
      kind: "good",
      title: "Pinned footer commit",
      caption: "The commit lives in a pinned footer, so it survives any length of scroll.",
      source: `${EXAMPLES_DIR}/good-pinned-footer.tsx`,
    },
    {
      id: "bad-scattered-commits",
      kind: "bad",
      title: "Commits scattered in the body",
      caption: "Never scatter commits through the body — the operator stops knowing what is saved.",
      source: `${EXAMPLES_DIR}/bad-scattered-commits.tsx`,
    },
    {
      id: "good-one-panel",
      kind: "good",
      title: "One panel",
      caption: "One panel, and the work behind it still legible through a dimming scrim.",
      source: `${EXAMPLES_DIR}/good-one-panel.tsx`,
    },
    {
      id: "bad-stacked-drawers",
      kind: "bad",
      title: "A drawer on a drawer",
      caption: "Never stack a drawer on a drawer — the second one has no way back that reads as one.",
      source: `${EXAMPLES_DIR}/bad-stacked-drawers.tsx`,
    },
    {
      id: "good-named-header",
      kind: "good",
      title: "Named header, visible close",
      caption: "A header that names the record, with the close glyph in its own corner.",
      source: `${EXAMPLES_DIR}/good-named-header.tsx`,
    },
    {
      id: "bad-no-title-no-close",
      kind: "bad",
      title: "No title, no visible close",
      caption: "Never open a drawer with no title and no visible close — the scrim is not an exit.",
      source: `${EXAMPLES_DIR}/bad-no-title-no-close.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Dialog, and modal about it",
      body: 'The panel is role="dialog" with aria-modal, labelled by its own header, so the announcement names the record rather than "dialog".',
    },
    {
      title: "Focus in, focus back",
      body: "Focus moves to the panel on open and is trapped inside it; on close it returns to the exact control that opened the drawer, never to the top of the page.",
    },
    {
      title: "Two ways out",
      body: "Escape and the close glyph both dismiss, and the scrim click is a third — but the glyph is the only one a keyboard user is required to find, so it is never hidden on hover.",
    },
    {
      title: "Reading order",
      body: "Header, then body, then footer in the DOM, matching what the eye does. The pinned footer is last in source even though it is visually fixed.",
    },
  ],
  tokens: [
    { tokens: ["bg"], usage: "Panel surface." },
    { tokens: ["border-2"], usage: "Left hairline against the page." },
    { tokens: ["border"], usage: "Header and footer rules." },
    { tokens: ["accent"], usage: "Primary commit in the footer." },
    { tokens: ["dim", "mute"], usage: "Body copy and meta line." },
  ],
  propGuidance: [],
  relationships: [
    {
      target: "modal",
      kind: "often-confused-with",
      text: "A modal interrupts and needs one answer; a drawer accompanies work that carries on around it.",
    },
    {
      target: "popover",
      kind: "often-confused-with",
      text: "A popover is anchored to its trigger and holds a few choices; a drawer is anchored to the viewport and holds a record.",
    },
    {
      target: "table",
      kind: "often-confused-with",
      text: "The table is where drawers are opened from, and the row stays highlighted while its panel is up.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-23",
      text: "Scrim changed from blur to dim so the work behind stays readable; footer commit made mandatory.",
    },
    {
      version: "1.0.1",
      date: "2026-08-19",
      text: "LG widened to 720px and allowed two columns; full-screen drawer ruled out.",
    },
    {
      version: "1.0.0",
      date: "2026-08-11",
      text: "Drawer introduced at three widths with a pinned header and footer.",
    },
  ],
  extractionNotes: [
    'This entry completes the draft stub drawer.ts\'s own LDS-039 (popover.ts) ticket created it to point at ("drawer", packages/content/src/entries/components/drawer.ts) — this ticket (LDS-041) is that future ticket, following the exact path modal.ts\'s own entry (LDS-040) already opened as "the template ticket for every remaining overlay." `purpose` is kept unchanged from the stub (CONTEXT.md\'s own glossary line) rather than reworded to the opening sentence\'s own phrasing, the same "no paraphrase needed" call modal.ts\'s own stub-completion note already made for the identical situation.',
    'Section 02 ("Sizes", archive/v1 lines 12265-12302) is modelled as `variants` rather than a dedicated schema field, the same fit modal.ts\'s own entry already found for the identical shape (the schema has no "sizes" concept — confirmed against packages/content/src/schema/component.ts). Each variant\'s own `tokens` array lists the same three representative colour tokens (`bg`/`border`/`accent`) rather than distinguishing ones: the three sizes share one visual treatment and differ only in width, the same reasoning modal.ts\'s own entry already gave for its own SM/MD/LG rows. The Sizes table\'s own "WHEN" column (`drawerSizeRows`\' own `rule`, archive/v1 line 15263 etc. — read through `drawerSizeData()`, not the docs-only `drawerSizeRows`/`drawerSizes` derivations, which exist only to reshape this same data for the table row and the live "click to open" card) becomes each variant\'s `description`, verbatim; its own meta tagline (`drawerSizeData()`\'s own `meta`, e.g. "SM · 360px", archive/v1 line 15261) is dropped as a redundant structural label with no schema slot, the same call modal.ts\'s own entry already made for its identical `modalSizeRows`\' own `w` field.',
    'The three widths (360px/480px/720px, `drawerSizeData()` archive/v1 lines 15260-15269) have no Spacing-ramp match (ramp: 4, 6, 8, 12, 16, 18, 22, 32, 44) — added as new `--drawer-width-sm`/`-md`/`-lg` tokens (packages/tokens/tokens/drawer.json), the same component-specific-exception category `--popover-panel-width` and `--modal-width-*` already established (LDS-039, LDS-040). Applied via `style={{ width: DRAWER_WIDTH[size] }}` on `DrawerContent`, the same inline-style pattern modal.tsx\'s own `MODAL_WIDTH` usage already set precedent for. Flagged in the PR (LDS-041).',
    "The panel's own `max-width:92vw` (archive/v1's live \"SYSTEM OVERLAYS\" drawer markup, line 13504) is carried over as a literal viewport-relative value the same way modal.tsx's own identical cap already does — unlike modal.ts's own entry, this one needed no *added* `max-height` cap of its own: the panel is always full viewport height (`inset-y-0`, anatomy #2 \"Full height\"), never size-variant in that dimension, so there is nothing for a height cap to constrain that the flex column's own internal `overflow-y-auto` body doesn't already handle.",
    'The Tokens section\'s own sixth row ("Panel — 260ms", not a colour token, archive/v1 line 15549) is dropped from the structured `tokens` field, the same gap modal.ts\'s, popover.ts\'s and tooltip.ts\'s own entries already flag for their own non-colour Tokens rows (`ColorTokenNameSchema` is colour-only). Unlike modal.ts\'s own `panelIn`-duration mismatch, this row needs no override decision at all: its own "260ms" already matches the live demo\'s own literal `animation:drawerIn .26s …` exactly, which in turn already matches the system\'s own `--animate-drawer-in` utility (`packages/tokens/build.mjs`\'s own `ANIMATIONS` entry, `duration: val(motion.duration.panel)` — 260ms) — the first overlay entry in the catalogue whose documented duration, live-demo literal and shipped default all agree, unlike modal.ts\'s own flagged 220ms/260ms split.',
    "The scrim's own `backdrop-filter:blur(4px)` (archive/v1's live \"SYSTEM OVERLAYS\" drawer markup, line 13503) lands exactly on Tailwind's own default blur scale (`blur-xs`, 4px) with no tie-break needed — unlike modal.tsx's own scrim, which had to break a tie between two equidistant steps for its 6px literal. `background:color-mix(in srgb,var(--bg) 45%,transparent)` becomes Tailwind's `bg-bg/45` opacity modifier, which composes the same mix in `oklab` rather than `srgb` — the same technical colour-space difference, visually negligible at this opacity, modal.tsx's own `bg-bg/55` scrim already flags for the identical reason.",
    'Anatomy #2\'s own elevation (`z-index:80`, archive/v1\'s live "SYSTEM OVERLAYS" drawer markup) and its own box-shadow (`-30px 0 90px rgba(0,0,0,.5)`) both resolve to real, already-existing tokens rather than new ones: `zIndex.overlay` (`elevation.json`\'s "z" group, "Overlay... Modal and drawer — the blocking layer. Both live at the same stop because two are never open at once") and `shadow-overlay-horizontal` (`elevation.json`\'s own "shadow" group, "Overlay, horizontal. Drawer, entering from the edge it lives on") — both already created and explicitly naming Drawer, applied in anticipation of this ticket by the Elevation foundation entry (LDS-016) before any Drawer ticket existed. Applied the same way modal.tsx\'s own `OVERLAY_Z` inline-style escape already is (no Tailwind `z-80` utility exists, ADR-0003), and `shadow-overlay-horizontal` via the ordinary `shadow-overlay-horizontal` utility class (already registered in `packages/ui/src/cn.ts`\'s own tailwind-merge `shadow` class group, confirmed by inspection — no cn.ts change needed).',
    'The panel\'s own fill colour is a genuine three-way split inside the prototype itself: the docs-page anatomy diagram\'s own illustration (archive/v1 line 12220, `data-anat="2"`) paints it `var(--panel-2)`, while both the Tokens section\'s own first row ("--bg", "Panel surface", archive/v1 line 15544) and the live "SYSTEM OVERLAYS" drawer markup (line 13504, `background:var(--bg)`) agree on `var(--bg)`. Resolved toward `--bg` (2 sources against 1), corroborated independently by the Elevation foundation entry\'s own extractionNotes (packages/content/src/entries/foundations/elevation.ts), which names `--bg` as "the fill of every raised surface, and the tint of every scrim" system-wide — a foundation-level rule the single diagram swatch doesn\'t override. The diagram\'s own `--panel-2` is treated as the one inconsistent source and flagged here rather than followed, the opposite split from the hairline\'s own (see below).',
    'The left hairline\'s own colour is the inverse three-way split: the Tokens section\'s own second row ("--border-2", "Left hairline against the page", archive/v1 line 15545) and the live "SYSTEM OVERLAYS" drawer markup (line 13504, `border-left:1px solid var(--border-2)`) both say `--border-2`, while the Anatomy section\'s own written prose — copied verbatim into this entry\'s own `anatomy[1].description` above — explicitly and specifically declares "the 1px left hairline is the only thing separating it from the page, which is why it is the one border allowed to carry accent," and the docs-page anatomy diagram\'s own illustration (archive/v1 line 12220) paints that exact border `var(--accent)`, matching the prose exactly. Resolved toward `--accent` — the opposite direction from the panel-fill call above — because here the documented, Drawer-specific written spec (not a generic foundation rule, but one sentence written about this one border) and its own matching diagram agree with each other and would visibly contradict the component if the implementation shipped `--border-2` right beside this entry\'s own Anatomy prose on the same docs page. The Tokens-row/live-demo pairing is treated as the prototype\'s own internal slip instead (plausibly the live demo\'s hand-written markup reusing Modal\'s own ordinary `--border-2` treatment by habit, the same category of live-demo/documented-spec mismatch modal.ts\'s own entry already resolved toward the documented side for its 220ms/260ms `panelIn` duration). Flagged for Cory: this is a judgment call on a genuine, evenly-split contradiction, not a clean extraction.',
    'The panel carries no `rounded-ds` (contrast modal.tsx\'s own dialog, which explicitly does): the live "SYSTEM OVERLAYS" drawer markup (archive/v1 line 13504) sets no `border-radius` at all, and the Anatomy prose\'s own wording is stronger here than Modal\'s own ("square on every corner" vs Modal\'s "square-cornered" — Modal\'s dialog still ships `rounded-ds` despite that adjective). A drawer anchored flush to three edges of the viewport has no free corner for a radius to read against, unlike a floating, fully-surrounded dialog — the same reasoning the system\'s own 2px radius lock (AGENTS.md rule 5) doesn\'t contradict, since the lock governs what value a rounded corner takes, not that every bordered surface must carry one. Flagged for Cory as a deliberate divergence from Modal\'s own precedent, not an oversight.',
    'Content rule 4\'s own "plain word \'Cancel\'" (archive/v1 line 15534) is followed over the live "SYSTEM OVERLAYS" drawer markup\'s own footer, which labels the same button "CLOSE" (archive/v1 line 13520) — the one place the live demo\'s copy disagrees with its own documented Content rule. Both the Anatomy diagram\'s own footer swatch (archive/v1 line 12235-12236) and all three "Do and don\'t" diagrams\' own footer swatches (archive/v1 lines 12361, 12378, 12411 etc.) independently show "CANCEL", a 3-against-1 majority resolved the same direction (documented spec over live-demo literal) modal.ts\'s own entry and this entry\'s own panel-fill/hairline calls above already take.',
    'Usage\'s own third "use something else when" row ("The content deserves its own address and history entry — that is a page.", archive/v1 line 12326) has no real `EntryId` to map to: unlike modal.ts\'s own fourth row ("a drawer or a page"), which had a second, real target in the same sentence to fall back on, this row names only "page" — and "page" is not a cataloguable entry at all (CONTEXT.md has no Page entry; `Entry` is defined there as "a token, foundation, component or pattern"), the same conclusion modal.ts\'s own entry already reached. With no real target to redirect to this time, the row is dropped from the structured `useInstead` array entirely rather than invented a stub for — flagged here per docs/build-guide.md §3 ("ambiguous or contradictory text: keep it, flag it"). The resulting three-item `useInstead` array (Modal, Popover, Toast) happens to line up exactly with CONTEXT.md\'s own "Easily confused components" section minus Drawer itself.',
    'Related\'s own third card ("Table", archive/v1 line 15554) is the first Related card in the overlay family (Modal, Popover, Toast, Drawer) to point at a non-overlay, non-peripheral component — Table (`table`, already a stable entry, LDS-034) — rather than another easily-confused surface. Modelled `often-confused-with` anyway for consistency with this entry\'s other two cards and modal.ts\'s/popover.ts\'s own precedent, though the relationship it describes ("the table is where drawers are opened from") reads closer to a `composes-with` in spirit; kept as `often-confused-with` since the two are genuinely never mistaken for each other, and flagged here rather than invented a looser-fitting kind.',
    'Modal (`modal`) and Popover (`popover`) both already exist as real, stable entries; Toast (`toast`) exists only as a draft stub (LDS-044, not yet landed) despite modal.ts\'s own extractionNotes claiming otherwise ("Toast... already exists as a full entry too") — that claim is stale by the time this ticket runs (confirmed by reading packages/content/src/entries/components/toast.ts directly). No action needed here: a draft stub is still a real entry for `useInstead`/relationship purposes (docs/build-guide.md §3 only requires creating one where none exists), but flagged since it means modal.ts\'s own note is now inaccurate and Toast (LDS-044) remains unbuilt.',
    '`aria-modal="true"` (Accessibility "Dialog, and modal about it") is set explicitly on `DrawerContent` — confirmed against the same @radix-ui/react-dialog source modal.ts\'s own entry already checked (`DialogContentImpl` doesn\'t set it by default in the installed version). Radix\'s `DialogPrimitive.Root` itself defaults `modal` to `true` (focus-trapped, background `aria-hidden`, scroll-locked) and needs no override — the same "wants Radix\'s own default unmodified" situation modal.ts\'s own benign `Modal` already documented.',
    "Unlike modal.tsx's own benign `ModalContent`, `DrawerContent` adds no `onOpenAutoFocus` override at all: this entry's own Accessibility (\"Focus in, focus back\": \"Focus moves to the panel on open and is trapped inside it\") makes no claim about which specific element receives that focus the way Modal's own Accessibility (\"No default on destruct\") explicitly does — Radix's own default (focusing the Content element itself when no autofocusable descendant claims it first) already satisfies the written spec as-is. The opposite situation from Modal's benign kind, the same situation modal.tsx's own `ModalConfirmContent` was already in for its own two focus defaults.",
    '`propGuidance` is empty, the same gap modal.ts\'s and popover.ts\'s own entries already flag for the identical reason: `extractProps`\'s own `propFilter` (packages/content/src/props.ts) keeps only props declared outside `node_modules`, and `Drawer` itself (the Root re-export, `ComponentProps<typeof DialogPrimitive.Root>`) declares no props of its own at all — confirmed by running the extraction, the generated Props table for this entry is empty. Every other named export (`DrawerContent`, `DrawerTrigger`, `DrawerClose`, …) has the same one-component-per-entry gap (LDS-009) modal.ts\'s own multi-export family already hits. Flagged for Cory alongside modal.ts\'s and popover.ts\'s own identical flag.',
  ],
});
