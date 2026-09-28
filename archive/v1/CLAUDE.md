# Lairy — project notes

## Anatomy section pattern (component docs)

Locked in on Badge. Reuse verbatim for every component.

**Mechanism — measured, never hand-placed.**
- Outer frame: `padding:34px; border:1px solid var(--border); background:var(--panel)`.
- Inner measuring box carries `ref="{{ anatStageRef }}"`, `position:relative`, fixed height (~216px for a small component; taller for dense ones).
- Specimen is absolutely centred inside it (`position:absolute;inset:0;display:flex;align-items:center;justify-content:center`).
- Each labelled part carries `data-anat="N"` on the real element. One element may serve two markers: `data-anat="1 3"` (lookup is `[data-anat~="N"]`). The outermost specimen element also carries `data-anat-spec="1"`.
- `anatDefs()` assigns each marker number a side: `{ i: '1', side: 'right' }` etc.
- `measureAnat()` reads every target's real rect on mount and on resize (ResizeObserver) and derives all geometry. Never write literal pixel offsets for markers.

**Rules the geometry enforces.**
- One part per edge — left, top, right, bottom — before doubling up.
- Every leader is a SINGLE STRAIGHT LINE perpendicular to its edge. No elbows, no shared channels, no diagonals.
- Leader length is fixed at `LEAD = 54px` from the target edge to the marker circle; never more than 80px. Markers sit near the artifact, not out at the frame.
- The line terminates exactly on the target edge, with a 5px amber dot at the contact point.
- Markers never overlap the artifact.
- When several parts share an edge, spread them along it (14px steps, clamped to stay on the target's own edge) — still straight.

**Marker style.** 22px filled `var(--accent)` circle, `var(--bg)` numeral, Space Grotesk 11.5px/600. Number only — words live in the legend below. Legend uses the identical 22px marker.

**Caption under the frame:** one line, `12px var(--faint)`, explaining that each part takes an edge and positions are measured.

**Dense components (e.g. Table):** split into zones — one measured stage per region — rather than one crowded figure.

## Documentation template (per component page)

Locked in on Badges. Reuse verbatim. Design-only — no code snippets. Audience is designers + engineers. Writing depth 4/5: full sentences with a point of view, never a bullet dump, never padding.

**Page header (shell-level, not in the page body).** Driven by `dsCrumbs` + `dsMeta` / `dsHasMeta` in `renderVals()` — add each newly documented page to the `dsMeta` map and it appears automatically.
- Breadcrumb trail `HOME / COMPONENTS / BADGES`: 11px, `.2em`, uppercase. Ancestors `--mute` and clickable (`open-link focus-ring`), leaf `--fg` and inert. First crumb's separator is `display:none` so the trail sits flush left. `margin-bottom:18px`.
- Title: `h3`, Space Grotesk 600, 34px, `line-height:1.1`, `-.02em`.
- Status row, `margin-top:12px`: status chip (amber border + `--accent-soft` fill), version chip (`--border`, `--mute`), then `UPDATED 16 AUG 2026` in 11px `--faint`.

**Body.** `display:flex;flex-direction:column;gap:34px;max-width:900px`.

**Opening block** (`gap:9px`): one 19px `--fg` sentence defining the component's role, then a 14px `--mute` paragraph carrying the boundary rule against its nearest neighbour — the sentence a reader could otherwise get wrong.

**Section header** (every numbered section): a row with the 2-digit number in 10.5px `--faint`, the title in Space Grotesk 600 17px, and a right-aligned `margin-left:auto` meta label in 10.5px `--faint` uppercase (e.g. `FOUR PARTS`, `THREE PAIRS`). Then `border-bottom:1px solid var(--border)`, `padding-bottom:9px`, section content below at `gap:14px`.

**The nine sections.**
- `01 Anatomy` — measured diagram per the pattern above + legend grid (`repeat(auto-fit,minmax(240px,1fr))`), each cell a 22px marker beside name and one-sentence description.
- `02 Tones` / `Variants` / `Sizes` — two-column grid, `minmax(104px,1fr) minmax(180px,2.2fr)`. Left column stacks name, live specimen, token names; right column is the WHEN sentence. Close with a `--faint` note explaining a deliberate omission (Badge: "There is no Warning tone…").
- `03 Usage` — two cards side by side. "Use when" gets the amber border + `--accent-soft` fill; "Use something else when" gets a plain `--border-2` box and names the correct component inline in `--fg`.
- `04 Content` — a bordered list of 5 rules, one per row, each a full sentence about casing, length, vocabulary, punctuation, and consistency.
- `05 Do and don't` — rendered pairs in a 2-col grid. Each cell: live specimen on `--panel` (`padding:26px 20px`, flex-grown so the pair matches height), then a caption row above a top hairline with `✓` in `--accent` or `✕` in `#ff8f6b`. Three pairs.
- `06 Accessibility` — 2-col grid of 4 cards, title in 11px `.2em` amber uppercase, body 13.5px `--dim`. Cover focus/roles, colour-never-alone, measured contrast, and reading order.
- `07 Tokens` — bordered rows, token name left in `--fg`, what it's used for right in `--mute`.
- `08 Related` — clickable cards (`repeat(auto-fit,minmax(230px,1fr))`) that navigate via `this.ds('dsPage', …)`; each says how the neighbour differs, not what it is.
- `09 Changelog` — bordered rows: version (52px), date (92px), then the change. Newest first.

**Shared type scale in docs.** Section title 17px · body 13.5px `--dim` · secondary 12.5px `--mute` · captions and meta 10.5–12px `--faint`. Specimens always use the component's real production styles, never a re-skin.

## System locks

- Radius: sharp. `.ds { border-radius: 2px !important }`. Only exceptions: chips (20px) and dots/avatars (50%).
- Accent: Amber `--accent` = act. Ice `--accent-2` = refer. Ice never appears on something clickable that amber isn't already leading.
- Density: comfortable. No playground toggles — the settings are locked in code.
- Badge vs Chip: a badge is system-assigned, static, annotates a parent. If it can be clicked, filtered or dismissed, it's a Chip.
