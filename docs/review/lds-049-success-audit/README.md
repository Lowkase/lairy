# LDS-049 · Success audit

Evidence for each `docs/prd.md` §13 criterion, gathered on `main` at a467ec4 plus this branch's one new spec.

## Verdict

| #   | Criterion                                                                                                          | Result                                                |
| --- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| 1a  | 9 foundations and 28 non-chart components have content entries, docs pages and registry items                      | **Met**                                               |
| 1b  | Both themes pass axe with no serious violations                                                                    | **Met** after #136, #137 and #138 were fixed (see 1b) |
| 2   | A fresh Next.js app installs a Lairy component through the CLI and renders it correctly with `@lairy/tokens`       | **Met**                                               |
| 3   | Claude Code on the MCP server answers the export-failed question from content alone                                | **Met**                                               |
| 4   | ESLint plugin and `validate` catch a hard-coded colour, an off-scale size and a second primary action in a callout | **Met** (split by design, see below)                  |

## 1a · Entries, pages, registry items

- 28 component entries in `packages/content/src/entries/components/` (the PRD §5.1 inventory of 35 minus 7 charts), all `status: stable`; 9 foundation entries in `.../foundations/`.
- `pnpm turbo run build` generates a static page per entry: `/components/[slug]` and `/foundations/[slug]`. The new spec asserts the catalogue is exactly 28 + 9 and visits every page.
- `GET /registry.json` lists **28** items; the build prerenders `/r/<name>.json` for each.

## 1b · axe, both themes

- Existing per-component specs run axe on `/dev/<component>` example routes in both themes (all 28 have one), and `foundations.spec.ts` covers the foundation pages. All 219 existing Playwright tests pass.
- Those specs do not visit the published `/components/[slug]` pages. `apps/docs/e2e/success-audit.spec.ts` (new) runs axe (serious and critical) on all 28 component and 9 foundation pages in both themes, with transitions disabled so axe never samples mid-fade.
- It found real violations on three pages, fixed in the follow-up PR (no `test.fail` markers remain; all 74 page-theme checks pass):
  - #136 Textarea bad examples were unlabelled: the two raw `<textarea>` examples now carry `aria-label`.
  - #137 Badge Success label was bare `--accent`, 4.42:1 on `--panel` in light: the label is now `text-fg`, accent-line border carries the tone (same call as Fail), recorded in `badge.ts` `extractionNotes`. `--accent` itself is unchanged; the token decision stays on the backlog.
  - #138 Tabs bad-example chip used `text-bg` on `--alarm`: now `text-alarm-ink`.

## 2 · Install test

`apps/docs/e2e/install.spec.ts` scaffolds a blank Next.js app in a temp dir, installs `@lairy/tokens@latest` **from public npm** (asserts a registry version, not a link), installs Callout, Badges and Text input through the shadcn CLI from the running registry, then screenshots them in both themes. `registry-install.spec.ts` covers the CLI path on its own. Both pass.

## 3 · MCP answers from content alone

`packages/mcp/src/server.test.ts`, "answers the PRD §13 question — export failed, why not a toast — from tool output alone": `suggest_alternative` (from Toast) returns Callout with the boundary ("persistent counterpart") and the reason Toast is gone in seconds; `get_component` returns Callout's content rule quoting "Export failed" and Toast's own boundary. It uses an in-memory MCP client over the real tool surface; no reach into `@lairy/content`. Not exercised: an actual Claude Code session over stdio (`pnpm --filter mcp run inspect` is the manual check).

## 4 · Lint and validate

- ESLint plugin (`packages/eslint-plugin`): `no-hardcoded-color`, `no-off-scale-size`, `no-off-scale-spacing`, `no-arbitrary-tailwind-value`, `no-positive-tabindex`, `no-removed-focus-outline`, with rule tests, applied to this repo. The plugin implements the content rules tagged `enforceable: lint` (checked by `rules.test.ts`).
- "A second primary action in a callout" is tagged `enforceable: validator`, so it is caught by the MCP `validate` tool, not ESLint (LDS-047/048 split it this way). `server.test.ts` covers all three: hard-coded colour, off-scale size (`10.5px`) and a second primary in a Callout (both the `<Button variant="primary">` and `actions` forms, plus the accepted shape).
- Read §13 as "ESLint + validate together catch all three". If Cory wants ESLint alone to catch the callout case, that is a scope change; say so and it becomes an issue.

## What Cory needs to decide

Sign off the criteria as above. Open question for the token backlog: light `--accent` text is under 4.5:1 on `--panel`/`--panel-2`, which is why Badge, Tabs, Main rail, Subnav and Header all keep that label on `text-fg`.
