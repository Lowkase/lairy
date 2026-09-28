# Prototype index

Maps every Foundation, Component and Pattern page in `archive/v1/Workspace Shell.dc.html` to where it lives, so a ticket can read only the line ranges it needs. Never read the file whole — use this index, then `sed -n '<start>,<end>p'` the ranges you need.

`archive/v1/support.js` is **not** indexed here: it is `dc-runtime`, the generic template engine (parses `<x-dc>`, evaluates `{{ }}` bindings, `<sc-if>`/`<sc-for>`), not app content. Every line of Lairy-specific markup and logic lives in `Workspace Shell.dc.html`.

## 1. How to find things

**File shape.** One file, two halves:
- **Template** (lines 9–13569): the `<x-dc>…</x-dc>` element. Static HTML with `{{ expr }}` bindings, `<sc-if value="{{ cond }}">`/`<sc-for list="{{ arr }}" as="x">` control tags. This is where doc-page **prose** is written verbatim — most of it is hardcoded markup, not generated from JS.
- **Logic class** (lines 13571–17202): `<script type="text/x-dc" data-dc-script>`, `class Component extends DCLogic`. Supplies every `{{ }}` binding via `state` and getter methods. Structured/repeated data (tables, computed chart geometry, anatomy legends fed through `<sc-for>`) lives here as `const` blocks or methods; one-off prose does not.

**Finding a page's template block.** Every Foundation and Component page is one `<sc-if value="{{ pgXxx }}">` (components) or `<sc-if value="{{ fdXxx }}">` (foundations) block, sibling blocks back-to-back in `compPages()`/`fdPages()` order. Grep `sc-if value="{{ pgTable`, or jump straight to the range in §4/§5 below. Patterns other than "Titles & descriptions" have no page of their own — see §6.

**HTML comment markers.** Above page-level (`pgXxx`/`fdXxx`), the template also carries plain `<!-- LABEL -->` comments at the section and shell-chrome level — `<!-- FOUNDATIONS -->` (449), `<!-- COMPONENTS -->` (2971), `<!-- PATTERNS: Titles & descriptions -->` (13210), `<!-- PATTERNS: placeholders -->` (13366), `<!-- left dock -->` (128), `<!-- sub nav rail -->` (155), `<!-- top status bar -->` (179), `<!-- SYSTEM OVERLAYS -->` (13482), `<!-- COMMAND BAR -->` (13539), plus view-level ones (`<!-- HOME / LAUNCHER -->` 250, `<!-- WORKSPACE -->` 303) and a few nested ones inside the workspace view (`<!-- metric row -->` 341, `<!-- focus grid -->` 13408, `<!-- AI-assist widget -->` 13450). There is no comment per individual page — only per section/region — so use these to find the right neighbourhood, then the `pgXxx`/`fdXxx` sc-if for the exact page. `grep -n '<!--'` on the file lists all of them at once; §3 below is built from that list.

**Finding a page's logic.** Two conventions, by page type:
- **Foundations**: `<key>Docs()` method (e.g. `colorDocs()`, `motDocs()`) holding `Content`/`Tokens` as local `const`s, plus a **separate** top-level `<key>Related()` method (e.g. `colorRelated()`, `a11yRelated()`) — Related is never inlined for foundations.
- **Charts** (the 7 Visualization components) and **Callout / Scrollbar / Usage card**: one self-contained `<key>Docs()` method per page (e.g. `blockDocs()`, `calloutDocs()`) holding `Anatomy`/`Data`/`Tokens`/`Related`/`A11y`/`Log` as local `const`s — everything for that page in one place.
- **All other 25 components** (Buttons, inputs, status, nav/chrome, overlays, Table): no dedicated method. Their content is a run of short-prefixed `const`s (e.g. `btnAnatomy`, `btnContent`, `btnTokens`, `btnRelated` — the ticket's `btnContent` example) inside the single ~1600-line `dsVals()` method (15280–16887). Grep the prefix (`grep -n 'btn[A-Z]' …`) to pull every const for that component; they sit within ~40–70 lines of each other. §5's tables give the first anchor line per component — read on from there.
- The 4 "other" Patterns (Empty states, Onboarding, Bulk actions, Search & filter) have no dedicated content at all — see §6.

**Shared per-page helpers**, used by every Foundation/Component page: `anatDefs()` (14670) — anatomy-marker side/position per page, keyed by page name; `dsMeta` (in `renderVals()`, 16670–16716) — status/version/updated-date per page; `compPages()` (14788) and `fdPages()` (14074) — the canonical key→display-name lists. `renderVals()` (17054–end) is the single method that assembles every `{{ }}` binding the template reads; when a binding's source isn't obvious from this index, grep its name there first.

**Naming abbreviations used below**: `bk`=Block field, `ct`=City grid, `rgc`=Ring coverage, `nd`=Node map, `rg`=Ridge, `pt`=Plate stack, `cs`=Column series, `vz`=Visualization (foundation), `co`=Callout, `sb`=Scrollbar, `uc`=Usage card, `btn`=Buttons, `in`=Text input, `ta`=Textarea, `cb`=Checkbox, `rd`=Radio, `sw`=Switch, `sel`=Select, `mt`=Select (Multi), `chip`=Chips, `badge`=Badges, `to`=Toast, `nav`=Navigation (Main), `subnav`=Navigation (Subnav), `tab`=Navigation (Tabs), `header`=Header, `tip`=Tooltip, `pop`=Popover, `modal`=Modal, `drawer`=Drawer, `empty`=Empty state, `load`=Loading, `tb`=Table, `tx`=Text, `card`=Cards.

For the doc-page template pattern itself (9 numbered sections, anatomy-diagram mechanics, type scale) see `archive/v1/NOTES.md` — that file is spec too.

## 2. Tokens & global CSS

All in the `<style>` block, lines 12–120.

| What | Lines |
|---|---|
| `:root` (dark theme tokens) | 17–24 |
| `[data-theme="light"]` (light theme tokens) | 26–33 |
| `@keyframes` (15 total: gridDrift, panelIn, fadeIn, widgetIn, pulse, breathe, ringspin, sweep, drawIn, drawerIn, riseIn, shimmer, sweepline, caretblink, glowdrift) | 45–59 |
| `.ds` radius lock, focus ring, hover/active utility classes | 60–120 |

Color foundation's token catalog (all groups, both theme values) is generated, not hardcoded in `<style>`: see `dsTokens()`, §5.

## 3. Shell chrome

The persistent chrome around every view (`Shell`/`Main rail`/`Subnav rail`/`Header` per `CONTEXT.md`). Comment-marked in the template:

| Region | Lines |
|---|---|
| Main rail ("left dock") | 128–154 |
| Subnav rail ("sub nav rail") | 155–178 |
| Header ("top status bar") | 179–249 |
| Home / launcher view | 250–302 |
| Workspace view | 303–422 |
| **Design System root** (wraps §4–§6) | 423–13481 |
| System overlays (live Modal/Drawer/Toast/Tooltip when triggered, distinct from their doc pages) | 13482–13538 |
| Command bar (⌘K — PRD non-goal, referenced only) | 13539–13569 |

Logic: `dockIcon()` (16944), `_tick()`/clock (16930), lifecycle (`componentDidMount` 16901, `componentDidUpdate` 16893, `componentWillUnmount` 16928). Nav data: `dockRaw`/`dockItems` (17065–17078), `railGroups` (15410), `dsNav` (15388) drives the subnav rail per top-level section.

## 4. Nav / inventory lists

| List | What it returns | Line |
|---|---|---|
| `fdPages()` | 9 Foundation keys, in display order | 14074 |
| `compPages()` | 35 `[key, displayName]` pairs, sorted for the subnav | 14788 |
| `patternPages` (local const) | 5 Pattern display names | 15386 |
| `dsNav` (local const) | builds the subnav rail rows for whichever of Foundations/Components/Patterns is active | 15388 |
| `dsMeta` | status/version/updated per Foundation+Component page | 16670 (in `renderVals()`) |

## 5. Foundations (9)

Each is one `<sc-if value="{{ fdXxx }}">` block. All nine have a `<key>Docs()` method (Content + Tokens as local consts) plus a separate `<key>Related()` method — see §1's convention note.

| Page | Template | `Docs()` | `Related()` | Shared helpers |
|---|---|---|---|---|
| Color | 453–721 | `colorDocs()` 14600 (`colorContent` 14610) | `colorRelated()` 14532 | `dsTokens()` 14796 — full token catalog table; `contrast()` 14629, `a11yContrast()` 14641 |
| Typography | 722–985 | `typoDocs()` 15178 (`typoContent` 15184, `typoTokens` 15195) | `typoRelated()` 14897 | `dsType()` 14887 — type scale table |
| Spacing | 986–1248 | `spacingDocs()` 15135 (`spacingContent` 15153, `spacingTokens` 15164) | `spacingRelated()` 15128 | — |
| Radius | 1249–1496 | `radiusDocs()` 15103 (`radiusContent` 15105, `radiusTokens` 15116) | `radiusRelated()` 14904 | — |
| Icons | 1497–1768 | `icoDocs()` 15052 (`icoTokens` 15082) | `icoRelated()` 15096 | `icon()` 13973, `glyph()` 13587 (icon draw fns, shared) |
| Elevation | 1769–2100 | `elevDocs()` 15010 (`elevTokens` 15028) | `elevRelated()` 15045 | — |
| Motion | 2101–2448 | `motDocs()` 14963 (`motTokens` 14983) | `motRelated()` 15003 | `dsMotion()` 15211 — live demo widget data |
| Visualization | 2449–2617 | `vizDocs()` 14485 (`vzForms` 14486, `vzReading` 14496, `vzA11y` 14503, `vzTokens` 14509, `vzLog` 14517) | `vzRelated` 14521 (inline const, not a method — exception to the convention) | Shared chart primitives: `viz()` 13659, `stage()` 13652, `box()` 13618, `iso()` 13605, `draw()` 13611 |
| Accessibility | 2618–2970 | `a11yDocs()` 14911 (`a11yTokens` 14940) | `a11yRelated()` 14956 | `a11yRules()` 14658, `a11yContrast()` 14641, `contrast()` 14629 |

## 6. Components (35)

Grouped per `docs/prd.md` §5.1. **Template** is the `pgXxx` block from §1's convention. **Logic** lists the first anchor line for each named `const` inside `dsVals()` (15280–16887) — read ~40–70 lines from the first to get the rest — except where a page has its own method (noted).

### Content and containers

| Page | Key | Template | Logic (`const`s in `dsVals()`, or own method) |
|---|---|---|---|
| Text | `tx` | 2975–3326 | `txAnatomy` 16206, `txContent` 16213, `txTokens` 16226, `txRelatedGo` 16234 (uses `txLog` 16428 further down) |
| Cards | `card` | 3327–3593 | `cardAnatomy` 15609, `cardKinds` 15615, `cardContent` 15622, `cardA11y` 15629, `cardTokens` 15635, `cardRelated` 15642, `cardLog` 15647 |
| Usage card | `uc` | 9310–9470 | own method: `usageCardDocs()` 17023 (`ucAnatomy` 17024, `ucContent` 17029, `ucA11y` 17035, `ucTokens` 17040, `ucRelated` 17046, `ucLog` 17049) |
| Callout | `co` | 11648–11887 | own method: `calloutDocs()` 14561 (`coAnatomy` 14562, `coTones` 14568, `coUsage` 14574, `coContent` 14578); `renderCallout()` 14548, `calloutIcon()` 14539 |
| Empty state | `empty` | 12519–12857 | `emptyAnatomy` 15475, `emptyContent` 15482, `emptyA11y` 15489, `emptyTokens` 15495, `emptyRelated` 15502, `emptyLog` 15507, `emptyKinds`/`emptyKind` 15512/15521 |
| Loading | `load` | 12858–13209 | `loadAnatomy` 16471, `loadContent` 16478, `loadA11y` 16485, `loadTokens` 16491, `loadRelated` 16499, `loadLog` 16504, `loadPhases`/`loadPhase` 16509/16513 |
| Progress | `prog` | 6648–7017 | `progAnatomy` 15925, `progRules` 15932, `progContent` 15938, `progA11y` 15945, `progTokens` 15951, `progRelated` 15959, `progLog` 15964 |
| Scrollbar | `sb` | 9100–9309 | own method: `scrollbarDocs()` 16964 (`sbAnatomy` 16965, `sbStates` 16968, `sbContent` 16971, `sbA11y` 16977, `sbTokens` 16982, `sbRelated` 16987, `sbLog` 16990) |

### Actions and inputs

| Page | Key | Template | Logic (`const`s in `dsVals()`) |
|---|---|---|---|
| Buttons | `btn` | 3594–3889 | `btnVariants` 15652, `btnAnatomy` 15658, `btnStateDocs` 15664, `btnContent` 15671, `btnA11y` 15678, `btnTokens` 15684, `btnRelated` 15691, `btnLog` 15696, `btnDoSpec` 15702 |
| Text input | `in` | 3890–4177 | `inAnatomy` 16380, `inStates` 16387, `inContent` 16394, `inA11y` 16401, `inTokens` 16407, `inRelatedGo` 16417, `inLog` 16423 |
| Textarea | `ta` | 4178–4460 | `taAnatomy` 16333, `taStates` 16340, `taContent` 16347, `taA11y` 16354, `taTokens` 16360, `taRelatedGo` 16369, `taLog` 16375 |
| Checkbox | `cb` | 4461–4747 | `cbAnatomy` 15566, `cbStates` 15572, `cbContent` 15579, `cbA11y` 15586, `cbTokens` 15592, `cbRelated` 15599, `cbLog` 15604 |
| Radio | `rd` | 4748–5092 | `rdAnatomy` 15969, `rdRules` 15976, `rdContent` 15982, `rdA11y` 15989, `rdTokens` 15995, `rdRelated` 16003, `rdLog` 16008 |
| Switch | `sw` | 5093–5393 | `swAnatomy` 16110, `swStates` 16117, `swContent` 16125, `swA11y` 16132, `swTokens` 16138, `swRelatedGo` 16146, `swLog` 16152 |
| Select | `sel` | 5394–5717 | `selAnatomy` 16013, `selStates` 16021, `selContent` 16030, `selA11y` 16037, `selTokens` 16043, `selRelatedGo` 16052, `selLog` 16058 |
| Select (Multi) | `mt` | 5718–6084 | `mtAnatomy` 16063, `mtStates` 16070, `mtContent` 16077, `mtA11y` 16084, `mtTokens` 16090, `mtRelatedGo` 16099, `mtLog` 16105; render-state helpers `multiTokens`/`multiMatrix` 16616/16623 |
| Chips | `chip` | 6085–6380 | `chipAnatomy` 15438, `chipVariants` 15444, `chipContent` 15450, `chipA11y` 15457, `chipTokens` 15463, `chipRelated` 15470, `chipLog` 15561 |

### Status

| Page | Key | Template | Logic (`const`s in `dsVals()`) |
|---|---|---|---|
| Badges | `badge` | 6381–6647 | `badgeTones` 15704, `badgeAnatomy` 15710, `badgeDo` 15716, `badgeContent` 15724, `badgeA11y` 15731, `badgeTokens` 15737, `badgeRelated` 15741, `badgeLog` 15746 |
| Toast | `to` | 11333–11647 | `toAnatomy` 16287, `toIntents` 16294, `toContent` 16300, `toA11y` 16307, `toTokens` 16313, `toRelatedGo` 16322, `toLog` 16328 |

### Navigation and chrome (doc pages — not the live shell, see §3)

| Page | Key | Template | Logic (`const`s in `dsVals()`) |
|---|---|---|---|
| Navigation (Main) | `nav` | 10209–10592 | `navAnatomy` 15751, `navContent` 15759, `navA11y` 15766, `navTokens` 15772, `navRelated` 15780, `navLog` 15786; `mainNavRules` 16561 |
| Navigation (Subnav) | `subnav` | 10593–10959 | `subnavAnatomy` 15793, `subnavRules` 15800, `subnavContent` 15806, `subnavA11y` 15813, `subnavTokens` 15819, `subnavRelated` 15827, `subnavLog` 15832 |
| Navigation (Tabs) | `tab` | 7018–7352 | `tabAnatomy` 15837, `tabRules` 15844, `tabContent` 15850, `tabA11y` 15857, `tabTokens` 15863, `tabRelated` 15871, `tabLog` 15876 |
| Header | `header` | 9838–10208 | `headerAnatomy` 16515, `headerContent` 16522, `headerA11y` 16529, `headerTokens` 16535, `headerRelated` 16543, `headerLog` 16548, `headerRules` 16555 |

### Overlays

| Page | Key | Template | Logic (`const`s in `dsVals()`) |
|---|---|---|---|
| Tooltip | `tip` | 8809–9099 | `tipAnatomy` 16240, `tipRules` 16246, `tipContent` 16254, `tipA11y` 16261, `tipTokens` 16267, `tipRelatedGo` 16274, `tipLog` 16281 |
| Popover | `pop` | 9471–9837 | `popAnatomy` 15881, `popRules` 15888, `popContent` 15894, `popA11y` 15901, `popTokens` 15907, `popRelated` 15915, `popLog` 15920 |
| Modal | `modal` | 11888–12197 | `modalAnatomy` 16433, `modalContent` 16440, `modalA11y` 16447, `modalTokens` 16453, `modalRelated` 16461, `modalLog` 16466; `modalSizeData()` 15249 (own method, sizes demo) |
| Drawer | `drawer` | 12198–12518 | `drawerAnatomy` 15523, `drawerContent` 15530, `drawerA11y` 15537, `drawerTokens` 15543, `drawerRelated` 15551, `drawerLog` 15556; `drawerSizeData()` 15259 (own method, sizes demo) |

### Data

| Page | Key | Template | Logic (`const`s in `dsVals()`) |
|---|---|---|---|
| Table | `tb` | 10960–11332 | `tbAnatomy` 16157, `tbZones` 16164 (per NOTES.md's "split into zones" rule for dense components), `tbContent` 16172, `tbA11y` 16179, `tbTokens` 16185, `tbRelatedGo` 16195, `tbLog` 16201; demo data `tableData()` 14821, `tblIcon()` 14831, `tableVals()` 14844 |

### Charts (7) — Visualization foundation's components

Each is one self-contained `<key>Docs()` method: `Anatomy`/`Data`/`Reading`/`A11y`/`Tokens`/`Log`/`Related` all as local consts in that one method. Shared chart-drawing primitives (`viz()`, `stage()`, `box()`, `iso()`, `mono()`, `draw()`, `textW()`, `hit()`, `callout()`) sit just above them, 13605–13973.

| Page | Key | Template | `Docs()` method |
|---|---|---|---|
| Block field | `bk` | 7353–7560 | `blockDocs()` 14078 (`bkAnatomy` 14079, `bkData` 14085, `bkReading` 14092, `bkA11y` 14098, `bkTokens` 14104, `bkLog` 14111, `bkRelated` 14115) |
| Column series | `cs` | 7561–7768 | `columnDocs()` 14430 (`csAnatomy` 14431 … `csRelated` 14467) |
| Plate stack | `pt` | 7769–7976 | `plateDocs()` 14372 (`ptAnatomy` 14373 … `ptRelated` 14411) |
| Ridge | `rg` | 7977–8184 | `ridgeDocs()` 14322 (`rgAnatomy` 14323 … `rgRelated` 14358) |
| Node map | `nd` | 8185–8392 | `nodeDocs()` 14257 (`ndAnatomy` 14258 … `ndRelated` 14293) |
| Ring coverage | `rgc` | 8393–8600 | `ringDocs()` 14194 (`rgcAnatomy` 14195 … `rgcRelated` 14231) |
| City grid | `ct` | 8601–8808 | `cityDocs()` 14136 (`ctAnatomy` 14137 … `ctRelated` 14172) |

## 7. Patterns (5)

Only one of the five has real content in the prototype; the rest render a shared placeholder. Flagged per `docs/build-guide.md` §3 (ambiguous/absent source gets flagged, not invented).

| Page | Template | Content |
|---|---|---|
| Titles & descriptions | 13211–13365 (`isTitlesPattern`) | Prose is inline in the template (verbatim, not generated). Possibly related: `typoPatternDocs()` 16996 (`tpUsed` 16997, `tpRules` 17003, `tpTokens` 17009, `tpRelated` 17017) — content and naming overlap with this page but the connection isn't asserted by any binding found; confirm before treating it as this page's source. |
| Empty states | 13367–13401 (`isOtherPattern`, shared with the 3 below) | No dedicated content — the prototype renders a generic placeholder for all four. |
| Onboarding | 13367–13401 (`isOtherPattern`) | Same placeholder as above. |
| Bulk actions | 13367–13401 (`isOtherPattern`) | Same placeholder as above. |
| Search & filter | 13367–13401 (`isOtherPattern`) | Same placeholder as above. Note: a listbox-pattern label exists elsewhere in Select's template (line 5654) but is not this pattern's content. |

`patternPages` (15386) lists the 5 display names; `S.dsSection === 'Patterns'` + `S.patternPage` (15387) select which renders.
