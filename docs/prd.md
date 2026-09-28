# Lairy Design System — PRD

**Owner:** Cory McKinnon
**Status:** Approved for build
**Companion files:** `CLAUDE.md` (guardrails), `CONTEXT.md` (glossary), `docs/adr/` (architecture decisions), `docs/build-guide.md` (Lairy-specific build rules). Work is tracked in GitHub Issues.

This document is the stable "what and why." It changes rarely and only by Cory's decision. Vocabulary follows `CONTEXT.md`; where this document and an ADR disagree, the ADR wins.

---

## 1. Product summary

Lairy is a design system with the visual language of an operator console: dark-first, monospaced, amber-accented, with a locked 2px corner. It already exists as a single-file interactive prototype (`reference/prototype/`) that doubles as a design system docs site.

This project turns that prototype into a production design system that:

1. Ships real, accessible React components built on tokens.
2. Is documented by a standalone Next.js docs app that is itself built with Lairy.
3. Is consumable by other projects — primarily by AI agents building apps — through a component registry, an MCP server and an `llms.txt` file.

The design system is the product. Apps built with it (starting with Lairy, the personal OS) are separate, later projects.

## 2. Goals

- **One source of truth.** Every fact about the system (tokens, component guidance, relationships, status) lives once, as validated structured data. The docs site, MCP server, registry and `llms.txt` are all outputs generated from it.
- **Agent-grade context.** An agent building a Lairy app can ask what to use, why, what not to use, and how it differs from its neighbours — and gets the same answers a human reads on the docs site.
- **Enforcement, not just guidance.** Off-system values are impossible or fail a check: Tailwind has no default palette, lint catches hard-coded values, and the MCP server can validate code against the rules.
- **Faithful to the prototype's intent.** The prototype's written reasoning is carried over verbatim. Its implementation drift (off-scale sizes and spacing) is corrected toward its own documented foundations.
- **Accessible and responsive.** WCAG AA in both themes, keyboard-complete, usable from phone to wide desktop.

## 3. Non-goals

- The Lairy personal OS product itself: the home launcher, workspaces (Personal, Health, Finances, etc.), the AI-assist widget and app data. These appear in the prototype but are out of scope.
- A command bar (⌘K). Referenced in the prototype's accessibility rules but not a documented component. Backlog candidate only.
- Figma libraries or design-tool plugins.
- Remote hosting of the MCP server and public npm publishing (decided later; see §12).

## 4. Users

- **Agents** (primary): Claude Code and other coding agents building Lairy apps via MCP, registry and `llms.txt`.
- **Cory** (primary): author and reviewer of the system; reads the docs app, reviews PRs.
- **Future human collaborators** (secondary): read the docs app.

## 5. Source material

`reference/prototype/Workspace_Shell_dc.html` (+ `support.js`, its runtime) is the **spec and reference implementation**. It is never imported, built or linted. Key facts:

- Runs React 18 and Babel from a CDN; needs a network connection and must be served over HTTP.
- Navigation is internal state, not URLs. Reaching a page means clicking through the nav.
- About 13,000 lines of template and a ~3,500-line logic class. Too large to read whole; use `reference/INDEX.md`.
- Documentation prose lives in the logic class as string literals inside per-page methods (for example `calloutDocs()`, `colorDocs()`, `btnContent`, `typoContent`, and `*Related()` methods).
- Inline styles are used almost everywhere; hover states use `!important` utility classes. Nothing is structurally reusable as code.

### 5.1 Inventory

**Foundations (9):** Color, Typography, Spacing, Radius, Icons, Elevation, Motion, Visualization, Accessibility.

**Components (35):**
- Content and containers: Text, Cards, Usage card, Callout, Empty state, Loading, Progress, Scrollbar
- Actions and inputs: Buttons, Text input, Textarea, Checkbox, Radio, Switch, Select, Select (Multi), Chips
- Status: Badges, Toast
- Navigation and chrome: Navigation (Main), Navigation (Subnav), Navigation (Tabs), Header
- Overlays: Tooltip, Popover, Modal, Drawer
- Data: Table
- Charts (7): Block field, Column series, Plate stack, Ridge, Node map, Ring coverage, City grid

**Patterns (5):** Titles & descriptions, Empty states, Onboarding, Bulk actions, Search & filter. (The prototype's section card says "4 patterns"; the nav lists 5. The nav is correct.)

Each page carries status (STABLE or LOCKED), version and updated date, and most component pages share a consistent structure: anatomy, variants/tones with token mapping, usage (use when / use something else when), content rules, good/bad examples, states, related components with differentiators, accessibility, changelog.

## 6. Architecture

### 6.1 Repository

pnpm workspaces + Turborepo monorepo:

```
apps/docs            Next.js docs app; also serves the registry and llms.txt
packages/tokens      DTCG token source → CSS variables, TS exports, Tailwind theme
packages/content     Zod schemas + content entries (tokens, foundations, components, patterns)
packages/ui          React components, icons, component examples
packages/mcp         MCP server (stdio) reading packages/content
packages/eslint-plugin  Lairy lint rules (milestone M5)
reference/           Prototype, INDEX.md, baseline screenshots — never built
docs/                PRD, ADRs, build guide, agent-skill config (docs/agents/)
CONTEXT.md           Glossary
```

Dependency direction: `tokens` ← `ui` ← `docs`; `content` references token names and component/example ids but does not import `ui` at runtime; `mcp` reads `content` (and example source files as text).

### 6.2 Stack

| Concern | Choice |
|---|---|
| Package management | pnpm workspaces |
| Task orchestration | Turborepo |
| Docs app | Next.js, current stable, App Router, TypeScript strict |
| Fonts | `next/font/google`: Space Grotesk (400–700), IBM Plex Mono (400–600), self-hosted |
| Styling | Tailwind CSS v4, theme generated from tokens, **default theme removed** |
| Variants | class-variance-authority (cva) + `cn` (clsx + tailwind-merge) |
| Behaviour primitives | Radix UI |
| Component scaffolds | shadcn/ui CLI and registry format |
| Tokens | DTCG JSON compiled with Style Dictionary |
| Content validation | Zod |
| Props extraction | react-docgen-typescript |
| Unit/behaviour tests | Vitest + Testing Library |
| Visual + a11y tests | Playwright + @axe-core/playwright |
| MCP | Official TypeScript MCP SDK, stdio transport |
| CI | GitHub Actions |

### 6.3 Outputs generated from content

1. **Docs app** — renders every foundation, component and pattern page from content entries plus live examples.
2. **Registry** — shadcn-format `registry.json` and per-item JSON served from the docs app (`/r/<name>.json`).
3. **MCP server** — tools for agents (see §9).
4. **`llms.txt` / `llms-full.txt`** — flat text rendering of the whole system, served from the docs app.

## 7. Content model

TypeScript data files validated by Zod at build time. A missing field, unknown token or dangling reference fails the build.

### 7.1 Shared building blocks

- `Status`: `draft | stable | locked | deprecated`
- `Meta`: `{ id, name, section, status, version, updated }`
- `Rule`: `{ text, enforceable?: { kind: 'lint' | 'validator', id } }`
- `Relationship`: `{ target: EntryId, kind: 'alternative' | 'composes-with' | 'contrasts-with' | 'often-confused-with', text }`
- `Example`: `{ id, kind: 'good' | 'bad' | 'demo', title, caption?, source: <path to TSX file> }`
- `ChangelogEntry`: `{ version, date, text }`

### 7.2 Entry types

**Token entry:** name (CSS variable name), group/role, value per theme, `themeable` (false = identical in every theme by design), use for, never for, rationale (required when `themeable: false` or when the token is an exception).

**Foundation entry:** meta, opening description (definition + boundary rule, per the prototype's two-sentence pattern), principles/content rules, tables or scales it documents (by token reference), accessibility notes, relationships, changelog.

**Component entry:** meta, one-line purpose, opening description, anatomy (numbered parts with explanation), variants/tones (each with token mapping), states, usage (`useWhen[]`, `useInstead[]` — each "instead" row names its target component), content rules, examples (good/bad pairs + demos), accessibility notes, prop guidance (annotations on extracted props only — never hand-written prop tables), relationships, changelog.

**Pattern entry:** meta, description, when it applies, the components it composes (references), rules, examples, relationships.

### 7.3 Content extraction rules

- Prose is carried over **verbatim** from the prototype, restructured into fields only.
- **One exception:** literal type sizes and spacing values inside prose are rewritten to token names per §8 (for example "10.5px" → "Micro"). Each rewrite is listed in the entry's extraction notes for review.
- Anything ambiguous is flagged in the PR, never paraphrased away.

## 8. Foundations decisions

The prototype's documented foundations win over its markup wherever they disagree.

### 8.1 Color

- Keep the prototype's CSS variable names (`--bg`, `--panel`, `--panel-2`, `--border`, `--border-2`, `--bracket`, `--glow`, `--fg`, `--dim`, `--mute`, `--faint`, `--accent`, `--accent-soft`, `--accent-line`, `--accent-2`, `--accent-2-soft`, `--accent-2-line`). Content prose references them by name, so keeping them keeps verbatim content accurate.
- Themes: dark (default, `:root`) and light (`[data-theme="light"]`), values exactly as the prototype's `:root` blocks.
- **Alarm stays non-themeable.** `#ff8f6b` is deliberately literal in the prototype so no theme can redefine "broken." It becomes `--alarm` with `themeable: false` and the prototype's rationale attached. Its alpha variants (currently raw `rgba(255,143,107,…)` at several opacities) are harvested and consolidated into a small named set (e.g. `--alarm-soft`, `--alarm-line`), each also non-themeable. Any alpha that doesn't fit a named role is flagged.
- The prototype's JS `pal()` function duplicates colour values; it is not ported. CSS variables are the only source. JS that needs a colour reads the token export.

### 8.2 Typography

Scale in rem (base 16px), assembled from the Typography page's own rules (its `dsType()` table plus the hierarchy rule "hero 48 > doc title 34 > workspace title 28 > section title 17 > module title 13"):

| Style | Size | Family | Weight | Tracking | Leading | Use |
|---|---|---|---|---|---|---|
| Display | 48 | Space Grotesk | 600 | -.02em | 1.08 | Page hero only |
| Doc title | 34 | Space Grotesk | 600 | -.02em | 1.1 | Docs page title |
| Title | 28 | Space Grotesk | 600 | -.02em | 1.15 | Workspace name |
| Metric | 28 | Space Grotesk | 600 | -.01em | 1.1 | Numbers in stat cards |
| Section | 17 | Space Grotesk | 600 | per prototype | per prototype | Section titles |
| Body | 14 | IBM Plex Mono | 400 | 0 | 1.6 | Rows, paragraphs |
| Small | 13 | IBM Plex Mono | 400 | per prototype | 1.5 | Module titles, hints, buttons, card body |
| Label | 12 | IBM Plex Mono | 400 | .16em | 1.4 | Uppercase panel headers, chips |
| Micro | 11 | IBM Plex Mono | 400 | .2em | 1.4 | Uppercase codes, badges, table headers |

- **Hard floor: 11px (Micro).** Nothing smaller anywhere. Sentence-length text is Small (13) or larger.
- **Default mapping for off-scale markup values:** 10.5 → Micro; 11.5 → Label; 12.5 → Small; 13.5 → Body; 15 → Body; 19 → Section. 8–10px → Micro, **except** text inside chart SVGs, which renders in viewBox units: evaluate its rendered size and flag.
- Values marked "per prototype" and any size not covered by the mapping are harvested and flagged for review in the token decisions ticket.
- Tracking tokens consolidate to the prototype's working set: .06, .08, .1, .12, .14, .16, .2em (and negative display tracking). Collapse further only with review.

### 8.3 Spacing

- Ramp (from the Spacing page, each step has documented usage): **4, 6, 8, 12, 16, 18, 22, 32, 44**.
- The prototype's rule applies: anything not on the ramp is a bug.
- Default snapping: 5 → 4 or 6; 7 → 6 or 8; 9 → 8; 10 → 8 or 12; 11 → 12; 13 → 12; 20 → 18 or 22 — choose by context and note the choice.
- **14px is a review decision, not a snap.** It appears 600+ times; it may be a missing step. The token decisions ticket flags it for Cory with the evidence.
- 1px gaps used to draw hairline grids are borders, not spacing, and are allowed.

### 8.4 Radius

- `2px` everywhere (locked). Radii do not nest. Radius never scales with size.
- `20px` chip shape (a shape, not a size).
- Full circle only for marks that hold no layout.
- Focus ring inherits the element's radius.

### 8.5 Motion

- Three easing tokens harvested from the prototype: standard `cubic-bezier(.4,0,.2,1)`, symmetric `cubic-bezier(.45,0,.55,1)`, and draw `cubic-bezier(.35,0,.2,1)` (confirm names against the Motion page).
- Duration tokens harvested from the prototype's transitions and animations (e.g. .22s, .26s).
- Keyframes (panelIn, fadeIn, riseIn, drawerIn, pulse, breathe, shimmer, sweepline, drawIn, etc.) become named animations in the Tailwind theme.
- `prefers-reduced-motion` is honoured everywhere, as the prototype does.

### 8.6 Breakpoints and responsiveness

- The prototype has no media queries and a 1024px minimum width. The port is fully responsive.
- Breakpoint tokens: phone < 640, tablet 640–1023, desktop ≥ 1024, wide ≥ 1440.
- Components are responsive by construction. The phone shell layout is **new design work**: Claude Code proposes it as a working route for Cory's review before anything depends on it (phone shell proposal ticket).

### 8.7 Elevation, icons, visualization, accessibility

Harvested from their Foundations pages as written. Icons are ported as SVG React components from the prototype's hand-drawn glyphs (40-grid glyphs and 24-grid inline icons, round caps and joins, `currentColor` only). No third-party icon library.

## 9. MCP server (v0)

Stdio transport, reads `packages/content`. Tools:

- `list_entries({ section? })` — foundations, components, patterns with status and one-line purpose.
- `get_component({ id })` — full entry, extracted props, example sources, relationships resolved to names.
- `get_foundation({ id })`
- `get_pattern({ id })`
- `get_tokens({ group?, theme? })` — tokens with values, use for, never for, rationale.
- `search_guidelines({ query })` — full-text search across rules, usage and content guidance, returning entry ids and matching rules.
- `suggest_alternative({ component, situation })` — traverses relationship and `useInstead` data.

Added in M5: `validate({ code })` — runs Lairy lint rules and enforceable validators against a snippet and returns violations with the rule text.

## 10. Distribution

- **Tokens:** a versioned package, `@lairy/tokens`. Apps never edit tokens.
- **Components:** copy-in via a shadcn-format registry served by the docs app. Registry items declare their dependency on `@lairy/tokens` and on Radix packages.
- **Drift control:** tokens-only styling (no Tailwind defaults exist), Radix handling behaviour, the ESLint plugin, the MCP `validate` tool, and the shadcn CLI's diff against the registry.

## 11. Decision log

Decisions that are hard to reverse, surprising without context, and a real trade-off are recorded as ADRs in `docs/adr/`. The rest are listed here.

| # | Decision | Where |
|---|---|---|
| D1 | Standalone design system app; apps built with it are separate projects | This PRD, §1 |
| D2 | Single source of truth as structured TypeScript + Zod content; all outputs generated | ADR-0001 |
| D3 | Relationships are typed references — build rejects dangling links; MCP can traverse the graph | This PRD |
| D4 | Examples are real TSX files — they compile, so they can't go stale | This PRD |
| D5 | Props extracted from source — documented API can never disagree with the real one | This PRD |
| D6 | Rules can be tagged enforceable — one sentence serves docs, agent guidance and a failing check | This PRD |
| D7 | Tokens as a package; components as a copy-in registry | ADR-0002 |
| D8 | Tailwind v4 with the default theme removed | ADR-0003 |
| D9 | shadcn for infrastructure and scaffolds only; visuals entirely Lairy | ADR-0004 |
| D10 | Radix for behaviour primitives — focus, keyboard and ARIA are where hand-rolled components fail | This PRD |
| D11 | Prototype is the spec, never source; documented foundations win over its markup | ADR-0005 |
| D12 | 11px type floor | ADR-0006 |
| D13 | Alarm colour is non-themeable | ADR-0007 |
| D14 | Keep the prototype's CSS variable names | ADR-0008 |
| D15 | Prototype prose carried verbatim, except size/spacing literals mapped to tokens | ADR-0009 |
| D16 | Screenshot comparison is a review aid, not a gate — the port intentionally corrects sizes and spacing | This PRD |
| D17 | Knowledge layer (tokens, content, MCP) before components — useful to agents immediately | This PRD |
| D18 | Tickets in GitHub Issues; a branch and PR per ticket; tickets labelled `review:cory` wait for Cory, others merge after code review and green CI | `docs/build-guide.md` |
| D19 | Claude Code proposes the phone shell; Cory reviews before dependent work — no phone design exists to port | This PRD, §8.6 |
| D20 | Own icon set, ported from the prototype — the glyphs are part of Lairy's identity | This PRD, §8.7 |

## 12. Open questions (decide when the relevant issue arrives)

- **Q1** Is 14px a spacing step? (token decisions ticket)
- **Q2** Where do `@lairy/tokens` and future packages publish — GitHub Packages (private) or public npm? (publishing target ticket)
- **Q3** Hosting for the docs app, registry and a remote MCP endpoint. (post-M5)
- **Q4** Do Small (13) and Section (17) need their own tracking/leading values, or inherit? (token decisions ticket)

## 13. Success criteria (end of M5)

- All 9 foundations and 28 non-chart components have content entries, docs pages and registry items; both themes pass axe with no serious violations.
- A fresh Next.js app can install a Lairy component through the CLI and render it correctly with `@lairy/tokens`.
- Claude Code, connected to the MCP server, can answer "what should I use to tell someone an export failed, and why not a toast?" from content alone.
- The ESLint plugin and `validate` tool catch a hard-coded colour, an off-scale size and a second primary action in a callout.
