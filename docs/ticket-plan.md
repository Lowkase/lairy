# Ticket plan — input for `/to-tickets`

This is a **one-time input**, not a tracker. It holds the sequencing, dependencies and acceptance criteria worked out during planning. Once `/to-tickets` has published these to GitHub Issues, GitHub is the only source of status and this file is deleted in the same commit.

**Instructions for `/to-tickets`:**
- Publish one GitHub issue per ticket below, keeping the `LDS-XXX` ID at the start of the title so references survive.
- Create one GitHub milestone per `M` section and assign each issue to it.
- Record dependencies in each issue body as `Blocked by: #<issue>` using the published issue numbers.
- Apply `ready-for-agent` to every ticket. Also apply `review:cory` where the ticket says **Review: Cory** — those PRs wait for Cory instead of merging on green.
- Carry the acceptance criteria and context references into the issue body verbatim.

Vocabulary follows `CONTEXT.md`. Scope and decisions: `docs/prd.md` and `docs/adr/`. Build rules: `docs/build-guide.md`.

---

## Board summary

| Milestone | Goal | Issues |
|---|---|---|
| M0 Setup | Repo, CI, prototype indexed and captured | LDS-001 – 004 |
| M1 Knowledge layer | Tokens, content, MCP, llms.txt — useful to agents before any component exists | LDS-005 – 016 |
| M2 Docs shell | Docs app wearing its own system; phone shell proposed | LDS-017 – 024 |
| M3 Core components | 17 non-overlay components | LDS-025 – 041 |
| M4 Overlays | 7 overlay and selection components | LDS-042 – 048 |
| M5 Distribution & enforcement | Registry, install test, lint, validate | LDS-049 – 054 |
| M6 Charts | 7 chart components | LDS-055 – 061 |
| M7 Patterns | 5 patterns | LDS-062 – 066 |

---

## M0 — Setup

### LDS-001 · Repo scaffold
- **Depends on:** —
- **Review:** No — bootstrap: commit directly to `main` (no CI yet)
- **Context:** docs/prd.md §6.1, §6.2
- **Acceptance:**
  - Git repo exists with its GitHub remote (`Lowkase/lairy`, already set up).
  - pnpm workspace and Turborepo configured; `typecheck`, `lint`, `test`, `build`, `dev` pipelines defined.
  - Shared `tsconfig` (strict), ESLint and Prettier config at the root.
  - Empty packages created with `package.json` and entry files: `packages/tokens`, `packages/content`, `packages/ui`, `packages/mcp`.
  - `apps/docs` is a Next.js App Router app (current stable) that renders a placeholder page.
  - The prototype moved with `git mv` from `archive/v1/` to `reference/prototype/`: `Workspace Shell.dc.html` renamed to `Workspace_Shell_dc.html`, and `support.js`.
  - `reference/README.md` states: the prototype is the spec, never imported/built/linted; known deviations are in docs/prd.md §8.
  - `reference/` is excluded from lint, typecheck and build.
  - Existing `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md` and `docs/` are left intact (the scaffold adds to them, never overwrites).
  - `pnpm turbo run typecheck lint test build` passes.

### LDS-002 · CI
- **Depends on:** LDS-001
- **Review:** No — bootstrap: commit directly to `main` (no CI yet)
- **Context:** docs/prd.md §6.2
- **Acceptance:**
  - GitHub Actions workflow runs install, typecheck, lint, test and build on every PR and on `main`, with pnpm and Turborepo caching.
  - Workflow passes on `main`.
  - Session summary reminds Cory to enable branch protection on `main` requiring this check.

### LDS-003 · Prototype index
- **Depends on:** LDS-001
- **Review:** No
- **Context:** docs/prd.md §5, build guide §2
- **Acceptance:**
  - `reference/INDEX.md` maps every Foundation (9), Component (35) and Pattern (5) page to: its template line range(s), its logic-class methods (e.g. `calloutDocs()`, `btnContent`, `*Related()`), and any demo data methods.
  - Also indexes: the `:root` / `[data-theme="light"]` token blocks, keyframes, the shell chrome (dock, header, subnav), `dsTokens()`, `dsType()`, `fdPages()`, and the nav lists.
  - Includes a short "how to find things" section (HTML comment markers, method naming conventions).

### LDS-004 · Baseline screenshots
- **Depends on:** LDS-001
- **Review:** No
- **Context:** docs/prd.md §5, build guide §2
- **Acceptance:**
  - A Playwright script in `reference/scripts/` serves the prototype over HTTP, clicks through the design system nav, and captures every Foundation, Component and Pattern page in dark and light themes at 1440px width (full-page).
  - Screenshots saved to `reference/screenshots/<section>/<entry>--<theme>.png`, committed.
  - README notes the script needs network access (CDN React/Babel) and is run manually, not in CI.

---

## M1 — Knowledge layer

### LDS-005 · Content schema
- **Depends on:** LDS-001
- **Review:** Cory — schema shape and the Callout sample entry
- **Context:** docs/prd.md §7, INDEX: Callout
- **Acceptance:**
  - Zod schemas for all building blocks and the four entry types in docs/prd.md §7 in `packages/content`.
  - Build-time validation: unknown token names, dangling relationship targets, missing required fields and duplicate ids fail the build with a clear message.
  - Registry of entries exported for consumers (docs, MCP).
  - One complete, hand-extracted entry — **Callout** — following build guide §3, including relationships (with stubs), examples referenced by id (stub TSX files acceptable at this stage) and extraction notes.
  - PR includes a rendered-as-JSON dump of the Callout entry for easy review.

### LDS-006 · Token harvest report
- **Depends on:** LDS-003
- **Review:** No
- **Context:** docs/prd.md §8
- **Acceptance:**
  - Script scans the prototype for every colour, font size, letter-spacing, line-height, gap/padding/margin, radius, duration and easing value, with frequencies.
  - `reference/token-harvest.md` lists each value, its count, its proposed token per docs/prd.md §8 mapping rules, and flags anything unmapped (including all alarm alpha variants, 14px spacing, and chart SVG text sizes).

### LDS-007 · Tokens package
- **Depends on:** LDS-006
- **Review:** No
- **Context:** docs/prd.md §8, §10
- **Acceptance:**
  - DTCG JSON source for colour (both themes, prototype variable names), alarm (non-themeable), typography scale, tracking, spacing ramp, radius, motion (easings, durations), breakpoints, elevation.
  - Style Dictionary build outputs: CSS variables (`:root` dark, `[data-theme="light"]`), typed TS exports.
  - Values follow docs/prd.md §8; unresolved items use the proposed value and are listed in the PR for LDS-009.

### LDS-008 · Tailwind theme from tokens
- **Depends on:** LDS-007
- **Review:** No
- **Context:** docs/prd.md §6.2, D9
- **Acceptance:**
  - Tailwind v4 configured in `apps/docs` and `packages/ui` with a theme generated from `@lairy/tokens`; Tailwind's default colours, spacing, font sizes, radii and shadows removed.
  - Fonts loaded via `next/font/google` and mapped to theme font families.
  - A test proves off-system utilities (e.g. `bg-blue-500`, `text-[10.5px]`, `rounded-lg`) produce no CSS or fail lint.
  - Theme switching via `data-theme` works on a test page.

### LDS-009 · Token decisions review
- **Depends on:** LDS-008
- **Review:** Cory — PRD Q1 and Q4, type scale, alarm set, tracking set
- **Context:** docs/prd.md §8, `reference/token-harvest.md`
- **Acceptance:**
  - Dev route `/dev/tokens` renders every token in both themes: type scale with sample text, spacing ramp, radius, motion demos, colour pairings with contrast ratios.
  - A "decisions needed" section shows each open item with evidence (frequency, where used, prototype screenshot excerpt) and a recommendation: 14px spacing, Section/Small tracking and leading, alarm alpha set, tracking consolidation, chart SVG text.
  - After Cory's decisions, tokens updated in the same PR before merge.

### LDS-010 · Token content entries
- **Depends on:** LDS-005, LDS-009
- **Review:** No
- **Context:** docs/prd.md §7.2, INDEX: Color, `dsTokens()`
- **Acceptance:** Every token has an entry with group, per-theme values (from the tokens package, not duplicated), use for, never for, and rationale where required. Alarm entries carry the prototype's rationale verbatim.

### LDS-011 · Foundations content
- **Depends on:** LDS-010
- **Review:** No
- **Context:** docs/prd.md §7, build guide §3, INDEX: all Foundations
- **Acceptance:** All 9 foundation entries extracted per build guide §3, validating, with extraction notes.

### LDS-012 · Component content — batch A
- **Depends on:** LDS-005, LDS-011
- **Review:** Cory — voice check on extracted prose
- **Context:** build guide §3, INDEX: listed components
- **Scope:** Text, Cards, Usage card, Empty state, Loading, Progress, Scrollbar, Buttons, Text input, Textarea, Checkbox, Radio, Switch, Chips, Badges
- **Acceptance:** Entries extracted per build guide §3, validating; PR lists every size/spacing literal rewritten and every flag.

### LDS-013 · Component content — batch B
- **Depends on:** LDS-012
- **Review:** No
- **Scope:** Select, Select (Multi), Navigation (Tabs), Tooltip, Popover, Navigation (Subnav), Navigation (Main), Header, Table, Toast, Modal, Drawer (Callout done in LDS-005)
- **Acceptance:** As LDS-012.

### LDS-014 · Chart and pattern content
- **Depends on:** LDS-013
- **Review:** No
- **Scope:** 7 chart components, 5 patterns
- **Acceptance:** As LDS-012. No `draft` stub entries remain except those for genuinely missing components (listed in the PR).

### LDS-015 · MCP server v0
- **Depends on:** LDS-014
- **Review:** No
- **Context:** docs/prd.md §9
- **Acceptance:**
  - Stdio MCP server in `packages/mcp` with the v0 tools in docs/prd.md §9, reading `packages/content` and token exports.
  - Example sources returned as text by id.
  - Project-scoped `.mcp.json` at the repo root registers the server for Claude Code.
  - Tests cover each tool; `pnpm --filter mcp run inspect` launches the MCP inspector.
  - Demonstrated in the PR: the answer to "what should I use to tell someone an export failed, and why not a toast?" using only tool output.

### LDS-016 · llms.txt
- **Depends on:** LDS-014
- **Review:** No
- **Acceptance:** Docs app serves `/llms.txt` (index with one-line summaries and links) and `/llms-full.txt` (full rendering of all entries and token tables), generated at build from content.

---

## M2 — Docs shell

### LDS-017 · Icons
- **Depends on:** LDS-008
- **Review:** No
- **Context:** docs/prd.md §8.7, INDEX: Icons foundation, glyph and inline icon functions
- **Acceptance:** Both families ported as typed React SVG components in `packages/ui/src/icons` following the Icons foundation construction rules (`currentColor` only, round caps/joins, stroke rules). Icon gallery on `/dev/icons`.

### LDS-018 · Text component
- **Depends on:** LDS-008, LDS-012
- **Review:** No
- **Context:** build guide §4, INDEX: Text
- **Acceptance:** Text component(s) per the content entry (eyebrow, heading, body, caption; tabular numerals) via the port procedure (build guide §4) steps 1–7. Docs page and registry deferred to LDS-022 and LDS-049.

### LDS-019 · Props extraction
- **Depends on:** LDS-018
- **Review:** No
- **Acceptance:** react-docgen-typescript pipeline produces props JSON for every `packages/ui` component at build; content prop guidance is merged in; unknown prop names in guidance fail the build.

### LDS-020 · Shell components (desktop)
- **Depends on:** LDS-017, LDS-018
- **Review:** No
- **Context:** build guide §4, INDEX: MainNav, Subnav, Header, shell chrome
- **shadcn:** none — build directly
- **Acceptance:** Navigation (Main), Navigation (Subnav) and Header built per the port procedure (build guide §4) steps 1–7 at tablet and desktop widths, keyboard-complete, both themes.

### LDS-021 · Phone shell proposal
- **Depends on:** LDS-020
- **Review:** Cory — layout decision (PRD D20)
- **Acceptance:**
  - Working route `/dev/shell-mobile` with one recommended phone layout (and at most one alternative) for dock, subnav rail, header and content, in Lairy's visual language.
  - Covers: primary navigation, reaching subnav pages, header content at narrow width, safe areas, keyboard and screen reader order.
  - PR includes screenshots at 390px in both themes and a short rationale per choice.

### LDS-022 · Docs app routing and foundation pages
- **Depends on:** LDS-011, LDS-019, LDS-020
- **Review:** No
- **Acceptance:**
  - Docs app uses the shell components; routes `/foundations/[id]`, `/components/[id]`, `/patterns/[id]` generated from content.
  - A single page template renders any entry: title, opening description, sections per schema, live examples, props, relationships, changelog, status/version.
  - All 9 foundation pages render fully; component and pattern pages render content with placeholders where components don't exist yet.
  - Theme toggle; axe passes on foundation pages in both themes.

### LDS-023 · Compare route
- **Depends on:** LDS-022, LDS-004
- **Review:** No
- **Acceptance:** Dev-only `/dev/compare/[entry]` shows the baseline screenshot beside the live page, per theme, with an overlay/opacity toggle. Excluded from production builds.

### LDS-024 · Apply phone shell
- **Depends on:** LDS-021 (approved), LDS-022
- **Review:** No
- **Acceptance:** Approved phone layout implemented in the shell components; docs app usable at 390px; Playwright screenshots at phone, tablet and desktop widths.

---

## M3 — Core components

All follow the component port procedure in `docs/build-guide.md`. All depend on M2 complete. **LDS-025 is the template for every component after it** — all later component issues depend on it.

| ID | Component | shadcn counterpart | Depends on | Review |
|---|---|---|---|---|
| LDS-025 | Buttons | button | LDS-024 | **Cory** — template for all components |
| LDS-026 | Badges | badge | LDS-025 | No |
| LDS-027 | Chips | none | LDS-025 | No |
| LDS-028 | Cards | card | LDS-025 | No |
| LDS-029 | Usage card | none | LDS-028 | No |
| LDS-030 | Callout | alert | LDS-025 | No |
| LDS-031 | Empty state | check registry | LDS-025 | No |
| LDS-032 | Loading | skeleton (partial) | LDS-025 | No |
| LDS-033 | Progress | progress | LDS-032 | No |
| LDS-034 | Scrollbar | scroll-area | LDS-025 | No |
| LDS-035 | Text input | input | LDS-025 | No |
| LDS-036 | Textarea | textarea | LDS-035 | No |
| LDS-037 | Checkbox | checkbox | LDS-025 | No |
| LDS-038 | Radio | radio-group | LDS-037 | No |
| LDS-039 | Switch | switch | LDS-037 | No |
| LDS-040 | Navigation (Tabs) | tabs | LDS-025 | No |
| LDS-041 | Table | table | LDS-026, LDS-037 | No |

---

## M4 — Overlays

Overlays must meet the Accessibility foundation's focus rules: focus moves in, is held, Escape closes, focus returns to the trigger.

| ID | Component | shadcn counterpart | Depends on | Review |
|---|---|---|---|---|
| LDS-042 | Tooltip | tooltip | M3 | No |
| LDS-043 | Popover | popover; dropdown-menu for action rows | LDS-042 | No |
| LDS-044 | Modal | dialog; alert-dialog for destructive confirms | LDS-043 | **Cory** — overlay template |
| LDS-045 | Drawer | sheet (right side) | LDS-044 | No |
| LDS-046 | Select | select | LDS-043 | No |
| LDS-047 | Select (Multi) | none — popover + listbox | LDS-046 | No |
| LDS-048 | Toast | sonner | LDS-044 | No |

---

## M5 — Distribution & enforcement

### LDS-049 · Registry
- **Depends on:** M4 · **Review:** No
- **Acceptance:** Docs app serves a shadcn-format `registry.json` and `/r/<name>.json` for every built component, generated from `packages/ui` and content; items declare dependencies on `@lairy/tokens`, Radix packages and other Lairy items.

### LDS-050 · Package publishing target
- **Depends on:** LDS-049 · **Review:** Cory — PRD Q2
- **Acceptance:** PR presents GitHub Packages (private) vs public npm for `@lairy/tokens` with setup steps and trade-offs; after the decision, publishing is configured and `@lairy/tokens` v0.1.0 is published.

### LDS-051 · Scratch-app install test
- **Depends on:** LDS-050 · **Review:** No
- **Acceptance:** Automated test creates a fresh Next.js app, installs `@lairy/tokens`, adds three components through the shadcn CLI from the local registry, and renders them correctly in both themes (Playwright screenshot).

### LDS-052 · ESLint plugin
- **Depends on:** LDS-049 · **Review:** No
- **Acceptance:** `packages/eslint-plugin` implements every rule tagged `enforceable: lint` in content (at minimum: no hard-coded colours, no off-scale sizes or spacing, no arbitrary Tailwind values, no removed focus outline). Rule messages quote the content rule text. Applied to this repo.

### LDS-053 · MCP `validate` tool
- **Depends on:** LDS-052, LDS-015 · **Review:** No
- **Acceptance:** `validate({ code })` runs the lint rules and `enforceable: validator` checks (e.g. at most one primary action in a Callout) against a snippet and returns violations with rule text and entry id.

### LDS-054 · M5 success audit
- **Depends on:** LDS-051, LDS-053 · **Review:** Cory
- **Acceptance:** PR demonstrates each docs/prd.md §13 success criterion with evidence, and lists gaps as new issues.

---

## M6 — Charts

All follow the port procedure in `docs/build-guide.md`, built on SVG with the Visualization foundation's rules. Depend on M5.

| ID | Component | Depends on | Review |
|---|---|---|---|
| LDS-055 | Chart (Block field) | M5 | **Cory** — chart template |
| LDS-056 | Chart (Column series) | LDS-055 | No |
| LDS-057 | Chart (Plate stack) | LDS-055 | No |
| LDS-058 | Chart (Ridge) | LDS-055 | No |
| LDS-059 | Chart (Node map) | LDS-055 | No |
| LDS-060 | Chart (Ring coverage) | LDS-055 | No |
| LDS-061 | Chart (City grid) | LDS-055 | No |

---

## M7 — Patterns

Pattern pages composed from built components, with live examples.

| ID | Pattern | Depends on | Review |
|---|---|---|---|
| LDS-062 | Titles & descriptions | M6 | No |
| LDS-063 | Empty states | M6 | No |
| LDS-064 | Onboarding | M6 | No |
| LDS-065 | Bulk actions | M6 | No |
| LDS-066 | Search & filter | M6 | No |

---

