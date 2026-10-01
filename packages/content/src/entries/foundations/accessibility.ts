import { FoundationEntrySchema } from "../../schema/foundation";

/**
 * Accessibility, extracted from archive/v1/Workspace Shell.dc.html
 * (template 2618–2970, logic `a11yDocs()` 14911, `a11yRelated()` 14956) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling in the boundary sentence, Usage-style rows and specimen
 * captions is dropped as markup, not content. See extractionNotes for every
 * place structured metadata was added or a value was restructured rather
 * than lifted directly.
 */
export const accessibility = FoundationEntrySchema.parse({
  meta: {
    id: "accessibility",
    name: "Accessibility",
    section: "foundations",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-26",
  },
  description: {
    summary:
      "This page is not a checklist to be audited against later. It is the set of floors every other foundation was built on top of.",
    boundary:
      "The reasoning runs one way: the grey ramp exists because four levels of text had to clear their ratios in both themes, amber owns action because it is the one hue that holds under deuteranopia, and the loop set is two long because a third moving thing in peripheral vision is indistinguishable from an alarm. So the rules below are not additions to the system — removing any one of them would require redrawing Color, Motion or Icons. Every figure here is enforced somewhere else and cross-referenced to it.",
  },
  scales: [
    {
      name: "Focus ring",
      tokens: ["accent-line"],
      description: "Focus ring and focused field border",
    },
    {
      name: "Focus wash",
      tokens: ["accent-soft"],
      description: "3px focus wash on fields",
    },
    {
      name: "Ring gap",
      tokens: ["bg"],
      description: "The 2px gap inside the focus ring",
    },
    {
      name: "Text levels",
      tokens: ["fg", "dim", "mute"],
      description: "Text levels cleared for sentences",
    },
    {
      name: "Caption",
      tokens: ["faint"],
      description: "Captions and meta only, both themes",
    },
  ],
  principles: [
    {
      text: "Focus is never removed, only replaced. Every interactive element carries the focus-ring class and takes one of the two treatments above — there is no element in the system whose focus state is the browser default outline, and none whose outline is set to none without a replacement.",
    },
    {
      text: "Tab order follows source order, which is the reading order: dock, then header, then subnav, then content. Nothing is given a positive tabindex, so the order cannot drift out of step with the layout.",
    },
    {
      text: "Opening an overlay moves focus into it and holds it there; Escape closes it and returns focus to the trigger that opened it. A menu, popover, modal, drawer and the command bar all behave identically in this respect.",
    },
    {
      text: "The ring is drawn on :focus-visible, not :focus, so a pointer click does not leave a halo behind — but every keyboard and assistive-technology arrival does.",
    },
    {
      text: "Dock row — 40 × 39: A 22px glyph in a 40px row, pinned against shrinking so a full dock cannot compress its own targets. The row is the target whether labels are shown or not — collapsing the rail changes nothing about where you can click.",
    },
    {
      text: "Table row — 54 tall: The full-width band is the target, running well over the 44px floor: 11px of padding either side of a 32px action box. Row actions sit in a reserved column, so revealing them on hover never changes the geometry underneath the pointer.",
    },
    {
      text: "Checkbox · radio · switch — 44 tall row: The mark is 18px, or a 22px track on a switch; the row carries the hit area and the label is part of it. All three share one 44px minimum so a settings list reads as one column of equal targets — clicking the word is clicking the control.",
    },
    {
      text: "Status dot — the row, not the dot: A 7px dot is never the target on its own — it annotates a row, and the row is what responds.",
    },
    {
      text: "Icon-only control — 32 × 32: A 14–16px mark in a 32px box — table row actions and overlay close buttons. Exactly the dense floor and no more, which is why icon-only is reserved for frequent, non-destructive verbs.",
    },
    {
      text: "pulse · breathe — holds at full opacity: The dot stays lit and the status word beside it is unchanged. Live-ness was never carried by the pulse alone.",
    },
    {
      text: "sweepline — static amber segment: The track holds a fixed segment and aria-busy still says the region is working. Indeterminate waiting is announced, not mimed.",
    },
    {
      text: "shimmer — flat --panel-2 bars: Skeletons keep their geometry, which was the only job they had. They are aria-hidden either way.",
    },
    {
      text: "caretblink — stays lit: A caret that does not blink is still a caret. Position carries it.",
    },
    {
      text: "Entrances · drawIn — opacity only, or nothing: Panels and cards fade without travelling; blueprint geometry appears complete. No chart ever needed its own assembly to be legible.",
    },
    {
      text: "12px: The floor for body copy and anything in a sentence. Mono at 12px is the smallest thing an operator is asked to read in a row or a stream.",
    },
    {
      text: "10.5px: The floor for captions, meta labels and section numbers — text that is scanned rather than read, and never the only place a fact appears.",
    },
    {
      text: "10px: The floor for labels inside an SVG, measured after viewBox scaling rather than in the source. A 13px label in a chart that renders at 0.7 scale is a 9px label.",
    },
    {
      text: "--faint: Restricted by role, not size: captions and meta only, never a sentence. It clears the large-text threshold and nothing beyond it.",
    },
  ],
  accessibilityNotes: [
    {
      title: "Decorative marks are hidden",
      body: "Every glyph that repeats an adjacent label carries aria-hidden, as does every skeleton, sweep and pulse. “Graphic, wave, Signals” is worse than “Signals”, and an animation has nothing to say at all.",
    },
    {
      title: "One name per control",
      body: "A control has a text label or an accessible name, never both saying different things. The collapsed dock keeps its labels in the DOM at zero opacity rather than removing them, so the name never depends on the rail being open.",
    },
    {
      title: "Progress speaks in steps",
      body: "Determinate values are announced at coarse intervals — roughly every 10% or on each stage change — and phase names at most every few seconds. A region that speaks per frame is a region nobody can listen to.",
    },
    {
      title: "State is in the markup",
      body: "Selection, expansion, busy and current-page are expressed as aria state on the real element, not inferred from a colour. The amber rail in the nav is the visual half of aria-current, not a substitute for it.",
    },
  ],
  relationships: [
    {
      target: "color",
      kind: "composes-with",
      text: "The ramp these ratios measure. It was tuned against this table, so changing a grey is a contrast decision before it is an aesthetic one.",
    },
    {
      target: "motion",
      kind: "composes-with",
      text: "Sets the timings this page switches off. It also holds the two-loop limit, which exists for the same reason as everything here.",
    },
    {
      target: "icons",
      kind: "composes-with",
      text: "Where the stroke floor and the never-alone rule are actually spent — a mark is the one element small and quiet enough to fail all three floors at once.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-26",
      text: "Published the two focus treatments, the per-loop reduced-motion contract and a target table measured from the running product. Repaired two floor violations found while measuring: table row actions and overlay close buttons went from 25 and 26px boxes to 32, and the dock rows were pinned against flex shrink so they hold their authored 40px.",
    },
    {
      version: "1.0.1",
      date: "2026-08-21",
      text: "Made the contrast table compute from live token values in both themes and grade on the worse of the two, which moved --faint from a ratio rule to a role restriction.",
    },
    {
      version: "1.0.0",
      date: "2026-08-07",
      text: "Established the floors: visible focus on everything, 32 and 44px targets, 12px body, and colour never carrying meaning alone.",
    },
  ],
  extractionNotes: [
    "This page's own \"Contrast\" section (01, `a11yContrast`) is not stored in this entry at all: like Color's, it is explicitly computed at render time from live token values rather than authored prose (docs/prd.md §8.1), so the docs page's existing `ContrastTable` component (already built for every foundation in LDS-014) renders it directly from @lairy/tokens instead of this entry duplicating numbers.",
    "`scales` carries only the first five rows of Section 09 \"Tokens\" (`a11yTokens`) — the ones that name a single real colour token (--accent-line, --accent-soft, --bg, the --fg/--dim/--mute trio, --faint). Each row's `n`/`u` fields become the scale's `tokens`/`description`. The remaining four `a11yTokens` rows (32px · 44px target floors, the 32×32 icon-only box, the 12px · 10.5px · 10px type floors, and the alarm literal already owned by packages/content/src/entries/tokens/alarm.ts) have no single colour token to carry and are not forced into a `scales` row; they are preserved instead as the `principles` entries below. Flagged rather than guessed.",
    "`principles` is unusually long for this entry because four of this page's eleven sections have no field of their own to hold a title+body or multi-column table, and `accessibilityNotes` can only hold one such list (used for Section 06 \"Announcement\", below): Section 02 \"Focus\" (`a11yFocus`, 4 plain-string rules, carried as-is), Section 03 \"Hit targets\" (`a11yTargets`, 5 rows, each restructured to \"{mark} — {target}: {how}\"), Section 05 \"Reduced motion\" (`a11yMotion`, 5 rows, each restructured to \"{motion} — {becomes}: {carrier}\") and Section 07 \"Text floors\" (`a11yText`, 4 rows, restructured to \"{value}: {body}\"). The title/value prefix in each restructured sentence is the row's own first field, not invented text (ADR-0009 permits restructuring prose into fields).",
    "Section 06 \"Announcement\" (`a11ySr`, 4 title+body rows) becomes `accessibilityNotes` verbatim — the one section on this page whose shape already matches `AccessibilityNoteSchema` exactly, so Section 04 on the rendered docs page (itself titled \"Accessibility\") shows this page's own announcement rules. This is self-referential — the Accessibility foundation's page has an \"Accessibility\" section — but accurate: `a11ySr` genuinely is this system's screen-reader announcement rules, not a different foundation's.",
    "Section 04 \"Colour is never alone\" has no dedicated list const — its three specimens and their captions are hardcoded template prose — and is not stored in this entry; its closing note (\"Amber and ice differ in hue and in lightness...\") duplicates language already carried in the Color foundation entry's own Alarm/Ice scale descriptions (LDS-014), so it is not repeated here. Flagged as a minor content loss.",
    "`a11yRelated()`'s three cards (Color, Motion, Icons) all target existing foundations, so none are dropped — unlike every other foundation extracted in this ticket, which each had at least one component-targeting Related card removed for the catalogue's foundations-only relationship scope (LDS-014).",
    "Section 08 \"Do and don't\" is not stored in this entry, the same as the other foundations extracted so far (docs/build-guide.md §4 step 6 — component examples, not Foundation content).",
    "This page has no Usage section (no \"reach for it when / use something else when\" cards exist in the template, unlike Color, Typography, Spacing, Radius, Icons, Elevation and Motion) — `usage` is left at its schema default rather than fabricated.",
  ],
});
