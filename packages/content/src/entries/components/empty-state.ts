import { ComponentEntrySchema } from "../../schema/component";

const EXAMPLES_DIR = "packages/ui/src/empty-state/examples";

/**
 * Empty state, extracted from archive/v1/Workspace Shell.dc.html (template
 * 12519–12857, logic constants `emptyAnatomy` 15475 onward) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling on "Loading" in the opening boundary sentence and on
 * "Loading"/"Toast" inside the Usage "use something else" rows is dropped
 * as markup, not content. See extractionNotes for every place structured
 * metadata was added, a literal had no clean token, or the shipped
 * component deliberately departs from the prototype's own markup.
 */
export const emptyState = ComponentEntrySchema.parse({
  meta: {
    id: "empty-state",
    name: "Empty state",
    section: "components",
    status: "stable",
    version: "1.1.0",
    updated: "2026-10-01",
  },
  purpose: "What a region says when it has loaded successfully and has nothing to show.",
  description: {
    summary:
      "An empty state is what a region says when it has loaded successfully and has nothing to show.",
    boundary:
      "It is a statement of fact with a way forward, not an apology and not decoration. The line against Loading is certainty: loading means the answer is unknown, empty means the answer is known and it is none. Showing an empty state while a request is still in flight is the one failure mode that matters here, because it tells the operator to act on a conclusion the system has not reached.",
  },
  anatomy: [
    {
      number: "1",
      name: "Region",
      description:
        "The empty state borrows the frame it sits in and adds none of its own. No dashed box, no nested card — the panel or table already drew the boundary.",
    },
    {
      number: "2",
      name: "Mark",
      description:
        "One 22px hairline glyph in --faint, naming the kind of thing that is missing. It is the only ornament allowed, and it never carries accent — nothing here is live.",
    },
    {
      number: "3",
      name: "Headline",
      description:
        '14.5px in --dim, stating the fact in the operator’s vocabulary: "No runs in this window". Not a greeting, not an apology.',
    },
    {
      number: "4",
      name: "Support line",
      description:
        "12.5px in --faint, capped near 330px so it stays one or two lines. It says what would appear here and how it gets here — the only teaching this component does.",
    },
    {
      number: "5",
      name: "Action",
      description:
        "At most one, and only when there is genuinely a next step. Primary for a first run, ghost for undoing a filter, absent when the operator cannot act.",
    },
  ],
  anatomyCaption:
    "Each part takes one edge of the frame, and every leader is a single straight line landing square on the target. Positions are measured from the artifact, so the diagram stays true at any size.",
  variants: [
    {
      name: "First run",
      tokens: ["faint", "dim", "accent"],
      description:
        "Nothing exists yet because nothing has been made. This is the only kind that earns a primary button, because creating the first record is genuinely the next thing to do.",
    },
    {
      name: "No results",
      tokens: ["faint", "dim", "border-2"],
      description:
        "Records exist, but the operator’s own query excluded them. Name the filter that did it and offer to undo it — the way out is backwards, not forwards, so the action is a ghost.",
    },
    {
      name: "Restricted",
      tokens: ["faint", "dim"],
      description:
        "There is content, but not for this operator. Say so plainly and name who can change it. Offering a button they cannot use is worse than offering none.",
    },
  ],
  variantsNote:
    'There is no error variant and no illustrated variant. A failed request is not empty — it gets an inline error with a retry, because "nothing here" would quietly turn a broken system into a normal one. And art in place of data reads as celebration; a 22px hairline glyph is as much decoration as this system allows.',
  usage: {
    useWhen: [
      "The request finished and the result is legitimately nothing.",
      "A region would otherwise be a blank rectangle with no explanation.",
      "There is a clear next step, or a clear reason there is none.",
      "The operator’s own filter is why they see nothing, and they may not remember setting it.",
    ],
    useInstead: [
      {
        target: "loading",
        text: "The answer is not known yet — that is Loading.",
      },
      {
        target: "toast",
        text: "Something was completed and needs acknowledging — that is a Toast.",
      },
    ],
  },
  contentRules: [
    {
      text: 'The headline states what is absent, not how the system feels: "No runs in this window", never "Oops, nothing here!".',
    },
    {
      text: "Never apologise and never thank — an empty list is an ordinary condition, and treating it as a failure teaches operators to distrust it.",
    },
    {
      text: "The support line answers one question: what would be here, and what puts it here. Anything more belongs in documentation.",
    },
    {
      text: "When a filter is the cause, name the filter in the headline and say how many records it hid, so the operator can judge whether to clear it.",
    },
    {
      text: 'One action at most, verb-first and specific — "Schedule a run", never "Get started" — and no action at all rather than a disabled one.',
    },
  ],
  propGuidance: [
    {
      prop: "kind",
      note: 'Which of the three Kinds this empty state renders (Empty state Variants) — "first-run", "no-results" or "restricted". Only "restricted" takes no `action` at all, enforced at the type level, since there is never a next step for it (Empty state Content rule 5).',
    },
    {
      prop: "headline",
      note: 'The fact, in the operator’s own vocabulary — "No runs in this window", never an apology (Empty state Content rule 1, anatomy #3).',
    },
    {
      prop: "body",
      note: "What would appear here and how it gets here — the only teaching this component does (Empty state anatomy #4, Content rule 3).",
    },
    {
      prop: "action",
      note: 'At most one action, verb-first and specific (Empty state Content rule 5, anatomy #5). Rendered as a primary Button for "first-run" and a ghost Button for "no-results" (Empty state Variants) — never offered at all for "restricted".',
    },
  ],
  examples: [
    {
      id: "first-run",
      kind: "demo",
      title: "First run",
      source: `${EXAMPLES_DIR}/first-run.tsx`,
    },
    {
      id: "no-results",
      kind: "demo",
      title: "No results",
      source: `${EXAMPLES_DIR}/no-results.tsx`,
    },
    {
      id: "restricted",
      kind: "demo",
      title: "Restricted",
      source: `${EXAMPLES_DIR}/restricted.tsx`,
    },
    {
      id: "good-onewayforward",
      kind: "good",
      title: "The fact, one line, one way forward",
      caption: "The fact, one line of use, and exactly one way forward.",
      source: `${EXAMPLES_DIR}/good-onewayforward.tsx`,
    },
    {
      id: "bad-apology",
      kind: "bad",
      title: "An apology instead of a fact",
      caption: "Never apologise — the API allows only one action, so a second primary is a mistake this component can't make, but tone still can.",
      source: `${EXAMPLES_DIR}/bad-apology.tsx`,
    },
    {
      id: "good-namedfilter",
      kind: "good",
      title: "The filter stays named and undoable",
      caption: "The filter stays visible, is named in the line, and can be undone from here.",
      source: `${EXAMPLES_DIR}/good-namedfilter.tsx`,
    },
    {
      id: "bad-dashedbox",
      kind: "bad",
      title: "A dashed box around the state",
      caption: 'Never wrap an empty state in its own box, and never say "No data" without saying why — the region it sits in already drew the boundary.',
      source: `${EXAMPLES_DIR}/bad-dashedbox.tsx`,
    },
    {
      id: "good-namewhohasaccess",
      kind: "good",
      title: "Naming who has access",
      caption: "When there is no next step, name who has it instead of inventing a button.",
      source: `${EXAMPLES_DIR}/good-namewhohasaccess.tsx`,
    },
  ],
  accessibility: [
    {
      title: "Not an alert",
      body: 'The region is a plain labelled container, not role="alert". An empty result is not urgent, and announcing it as an alert interrupts whatever the operator was reading.',
    },
    {
      title: "Announced once",
      body: 'When the state replaces loaded content — after a filter change — the region is aria-live="polite" so the headline is read once, and the count in the support line is part of that sentence rather than a separate node.',
    },
    {
      title: "Decorative mark",
      body: "The glyph is aria-hidden. It repeats what the headline already says, so a screen reader hearing it twice would only add noise.",
    },
    {
      title: "Measured contrast",
      body: "--dim on --panel-2 clears 7:1 and the --faint support line clears 4.6:1 at 12.5px. Faint is the quietest token allowed to carry a sentence — below it, text becomes decoration.",
    },
  ],
  tokens: [
    { tokens: ["faint"], usage: "Mark" },
    { tokens: ["mute"], usage: "Support line" },
    { tokens: ["dim"], usage: "Headline" },
    { tokens: ["panel-2"], usage: "Surface, inherited from the region" },
    { tokens: ["accent"], usage: "Primary action — first run only" },
    { tokens: ["border-2"], usage: "Ghost action border" },
  ],
  relationships: [
    {
      target: "loading",
      kind: "contrasts-with",
      text: "Loading means the answer is unknown; empty means it is known and it is none. Never show this one while a request is in flight.",
    },
    {
      target: "table",
      kind: "composes-with",
      text: "A table’s empty state replaces the rows and keeps the header, so the columns still explain what would have been listed.",
    },
    {
      target: "card",
      kind: "composes-with",
      text: "A card body with nothing in it becomes this — the card keeps its frame and the empty state fills the inside.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-23",
      text: "Three kinds separated — first run, no results, restricted — with the primary action limited to first run. Error variant ruled out.",
    },
    {
      version: "1.0.1",
      date: "2026-08-17",
      text: "Illustration removed in favour of a single 22px hairline mark in --faint.",
    },
    {
      version: "1.0.0",
      date: "2026-08-09",
      text: "Empty state introduced with mark, headline, support line and optional action.",
    },
  ],
  extractionNotes: [
    'This entry replaces the draft stub LDS-007\'s Text ticket created only so Text\'s own `useInstead` row ("There is no content to describe — that is an Empty state") had somewhere real to point (that stub\'s own comment said as much). `purpose` is now Empty state\'s own, not paraphrased from Text\'s side.',
    'A new `loading` draft stub (packages/content/src/entries/components/loading.ts) is added, the same pattern this entry\'s own prior stub used, and the same pattern card.ts\'s `table` stub and badge.ts\'s `progress` stub used: Loading has no ticket of its own yet (LDS-025, #27, open) and no CONTEXT.md glossary entry, so its stub `purpose` is paraphrased from this entry\'s own boundary sentence about it ("loading means the answer is unknown, empty means the answer is known and it is none"), from Empty state\'s side rather than its own — flagged, pending Loading\'s own ticket.',
    'The Usage "use something else when" row\'s first and third items ("The answer is not known yet — that is Loading", "Something was completed and needs acknowledging — that is a Toast") each had their own `<span style="color:var(--fg)">` around the named component in the prototype markup, matching docs/build-guide.md §3\'s "every use something else row... becomes a typed... useInstead item" — modeled as typed rows targeting `loading` and `toast`. The second and fourth items ("The request failed — that is an inline error with a retry", "Only one field of a filled record is blank — that is an em dash in the cell, not a state") carry no such span in the source markup, unlike their neighbours — deliberately, since neither "inline error" nor "em dash in a cell" names an existing or planned Lairy component (docs/prd.md §5.1\'s inventory has no "Error" or "Inline error" entry). Both sentences are kept verbatim here in this comment rather than modeled as `useInstead` rows, since `UsageSchema`\'s `useInstead` requires a resolvable `target` id and inventing one would create a dangling or fabricated relationship; flagged for Cory in case either becomes its own ticket.',
    'Anatomy #3\'s headline ("14.5px in --dim") reuses `text-callout-title` (packages/tokens/tokens/typography.json\'s own flagged, as-is `callout-title` step) — the only 14.5px step on the type scale, named for Callout but not yet generalised (that token\'s own description: "Does not match a documented type style... pending the token decisions ticket"). Reused here rather than inventing a second 14.5px token, same token-decisions backlog as button.tsx\'s and badge.ts\'s own instances.',
    "Anatomy #4's support line (\"12.5px in --faint\") snaps to Label (12px) — a 0.5px decoupling, the same precedent chip.tsx's and card.ts's own non-exact Label-sized text already used (chosen for the size match alone, since the support line is plain prose with no tracking or uppercase transform, unlike Label's own default uppercase/.16em use).",
    "Anatomy #4's \"capped near 330px\" has no width token: the spacing ramp (docs/prd.md §8.3) runs 4–44px for gaps and padding, not reading widths, and no other token category covers a line-length cap. Kept verbatim in prose (ADR-0009) but not enforced as a max-width in the shipped component — AGENTS.md rule 1 (\"if a needed value has no token, flag it — never invent one\") rules out an arbitrary `max-w-[330px]` (packages/ui/src/lint.test.ts's own regression test confirms the build fails on that syntax regardless). The region already borrows its parent's width (anatomy #1), so in practice the support line wraps at whatever width the surrounding Card, Table or panel already constrains it to. Flagged for the token decisions backlog alongside this entry's other unsnapped literals.",
'The mark (anatomy #2) ships as a dedicated `EmptyStateIcon` (packages/ui/src/empty-state/empty-state-icon.tsx) — a plain window/table glyph (one header divider, one column divider) ported verbatim from the prototype\'s own inline SVG (viewBox 0 0 24 24, `<rect x="3.5" y="4.5" width="17" height="15">` + `<path d="M3.5 9.5h17M9 4.5v15">`) — rather than a new name added to the shared Glyph set (packages/ui/src/icons/glyph.tsx). The same precedent Callout\'s own tone icon already set (packages/ui/src/callout/callout-icon.tsx): the Icons foundation\'s own Glyph scale documents a closed, named inventory ("Twelve glyphs on the 40 grid", packages/content/src/entries/foundations/icons.ts changelog) for navigation and section identity, not a set components add their own one-off marks to. Sized at `--icon-glyph-rail` (22px, the same token Callout\'s own `--icon-callout` exception sits beside) — an exact match to this component\'s own harvested "22px hairline glyph" (anatomy #2, and the Live demo/Anatomy diagram\'s own inline `width="22" height="22"`), so no new size token was needed. Stroke is the 24-grid Inline icon family\'s own `--icon-stroke-inline` (2), not the prototype\'s own thinner 1.4 or the Glyph family\'s 40-grid 2.2 — the same borrowed-stroke precedent CalloutIcon\'s own `strokeWidth={2}` already uses for a non-Inline-icon mark on a 24-grid viewBox. Flagged as a deliberate decoupling, the same category chip.tsx\'s and card.ts\'s own stroke/size snaps already use.',
    'The Icons foundation\'s own Glyph scale description (packages/content/src/entries/foundations/icons.ts) groups "section tiles and empty states" at the 30–34px tile size — moot for this entry\'s own mark, since it ships as a dedicated, component-scoped icon (see the note above) rather than a Glyph-family instance, so it was never a candidate for that family\'s `rail`/`tile` choice in the first place. Flagged only in case a later ticket folds this mark into the shared set and has to pick a size then.',
    'Container padding: the Anatomy diagram\'s own specimen and the Do/Don\'t grid\'s specimens use 26px vertical / 20px horizontal padding, while the "LIVE — AT REAL SIZE, INSIDE A PANEL" specimen — this component\'s own canonical real-size rendering — uses 38px/20px. 38 isn\'t on the spacing ramp (4,6,8,12,16,18,22,32,44) and sits almost exactly between 32 and 44; snapped down to Space-32 (`py-32`) per docs/prd.md §8.3\'s "choose by context and note the choice" — a calmer empty state reads better inside an already-bounded region than a cavernous one. 20px horizontal snaps per §8.3\'s own named example ("20 → 18 or 22"); chosen Space-18 (`px-18`) to match Card\'s own body padding (packages/ui/src/card/card.tsx), for visual consistency between a card and the empty state that can fill it (Related: Cards).',
    "Internal gaps — mark→headline and body→action are each harvested from both specimens' own padding deltas as exactly 12px and 16px, exact ramp matches (`mb-12`, `mb-16`). Headline→body is 5px, snapped per §8.3's own \"5 → 4 or 6\" to Space-6 (`mb-6`), chosen over 4 for a touch more breathing room between the two lines of prose — noted per §8.3's own instruction to record the choice.",
    "The Do/Don't grid's own bad pairs for \"two primaries\" (the prototype's own NEW WORKFLOW + LEARN MORE pairing) and for \"a disabled action parked on Restricted\" (the prototype's own disabled REQUEST ACCESS button) are both prevented at the type level by this component's own API: `action` accepts at most one action object on `first-run`/`no-results`, and `EmptyStateRestrictedProps` carries no `action` field at all. Neither mistake can be constructed with the real, type-checked component, so neither was ported as a literal TSX reproduction — only the copy-level mistake (apologising) and the composition-level mistake (wrapping the region in its own box) remain constructible, and those are what `bad-apology.tsx` and `bad-dashedbox.tsx` demonstrate. The same \"always a real control\" precedent chip.tsx's, button.tsx's and card.ts's own extractionNotes already document for other structurally-prevented mistakes.",
    'Accessibility "Announced once" names a specific runtime trigger — the state replacing loaded content after a filter change — that this stateless, presentational component has no way to detect on its own (it does not know what was on screen before it mounted). `aria-live="polite"` is set unconditionally instead of only on that transition: harmless on first mount, and correct on every state change a parent causes by re-rendering this component with new props. Flagged as a simplification pending a consumer-level pattern for conditional live regions.',
    'Accessibility "Not an alert" is read as ruling out `role="alert"` specifically, not every ARIA role — the shipped region carries no explicit `role` at all (not even the implicit `role="status"` a bare aria-live container sometimes gets paired with elsewhere), since `aria-live="polite"` alone already gives the "announced once, politely" behaviour the note asks for.',
    'Accessibility "Measured contrast" claims the --faint support line clears 4.6:1 at 12.5px, kept verbatim (ADR-0009), but the shipped support line renders in --mute, not bare --faint: axe measures --faint text on --panel at 3.53:1 in the light theme (apps/docs/e2e/empty-state.spec.ts), short of AA\'s 4.5:1 floor — the same gap card.ts\'s own extractionNotes already document for its meta slot (packages/ui/src/card/card.tsx). --mute clears 4.5:1 in both themes. The mark keeps --faint, since it is aria-hidden and decorative, not text axe\'s contrast check applies to. Flagged for the token decisions backlog alongside Card\'s own instance of the same gap.',
    "The Variants section's own live demo chrome — `emptyLiveMeta` (\"0 RUNS\"-style counter) and `emptyKindChips` (the kind-switcher row used to flip between the three Kinds specimens in the prototype's own docs page) — is docs-page interaction for browsing this entry's own three Kinds, not part of the shipped component's anatomy (Anatomy names exactly five parts, and neither a counter nor a kind switcher is among them). Not ported into empty-state.tsx; the docs app's own generic Variants section (apps/docs/app/components/[slug]/page.tsx) already renders one demo specimen per variant without needing either.",
  ],
});
