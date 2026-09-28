# BUILD.md — How work gets done

This file is the process. `PRD.md` says what and why; `KANBAN.md` says what's next. Read this at the start of every session.

---

## 1. The session loop

1. **Sync.** `git checkout main && git pull`. Read `KANBAN.md`.
2. **Pick.** Take the first issue in the current milestone with status `Todo` whose `Depends on` issues are all `Done`. If an issue is `In progress` on a branch from a previous session, resume it instead.
3. **Load only what the issue lists.** Read the PRD sections and `reference/INDEX.md` entries named in the issue. Do not read the whole prototype or the whole PRD.
4. **Plan briefly.** Before writing code, state the plan in five bullets or fewer in the session. If the plan conflicts with the PRD, stop and ask.
5. **Branch.** `git checkout -b issue/LDS-XXX-short-slug`. Set the issue to `In progress` in `KANBAN.md` as the first commit on the branch.
6. **Implement** to the acceptance criteria. Nothing more.
7. **Verify locally.** `pnpm turbo run typecheck lint test build` must pass. For UI work, also run the Playwright suite for the affected entries.
8. **Update records.**
   - `KANBAN.md`: status → `In review` if the issue is flagged **Review: Cory**, otherwise → `Done`. Add a one-line result note.
   - The entry's changelog and version, if a content entry or component changed.
9. **Commit** with the issue ID: `LDS-XXX: <what changed>`. Small, logical commits are fine.
10. **Open a PR.** `gh pr create --fill --title "LDS-XXX: <title>"`. The PR body lists: what was done, acceptance criteria checked, decisions made, anything flagged.
11. **Wait for CI.** `gh pr checks --watch`.
12. **Merge or stop.**
    - **No review flag, CI green:** `gh pr merge --squash --delete-branch`, then return to step 1.
    - **Review: Cory:** do not merge. Stop the session with a summary of what to review and where (PR link, docs route, screenshots).
    - **CI red:** fix on the branch. If it can't be fixed within the issue's scope, set status `Blocked`, explain in `KANBAN.md` and the PR, and stop.

**Stop the session** at any review checkpoint, at the end of a milestone, or when blocked. Always end with a short summary: issues completed, PRs open, anything flagged.

**Bootstrap exception:** LDS-001 and LDS-002 run before CI exists. Commit them directly to `main`. The PR flow starts with LDS-003.

## 2. Scope discipline

- One issue per branch. Never fold unrelated fixes in.
- Found something outside the issue? Add a new issue to `KANBAN.md` (next free ID, in the right milestone, status `Todo`, with a `Found during LDS-XXX` note) and keep going.
- Never edit `PRD.md` decisions. Propose changes in the PR and flag them for Cory.
- Never mark an issue `Done` with failing checks or unmet acceptance criteria.
- Run issues serially. `KANBAN.md` is shared state; parallel sessions will conflict on it.

## 3. Using the prototype

- `reference/prototype/` is read-only. It is never imported, built or linted.
- Navigate it through `reference/INDEX.md`. Read only the line ranges an issue needs.
- **Never copy markup or inline styles.** Read the prototype to understand appearance and behaviour, then build fresh from tokens and the content entry.
- Any value found in the prototype with no matching token: flag it in the PR. Never hard-code it.
- Compare against `reference/screenshots/` via the docs app's `/dev/compare/[entry]` route. Differences that come from PRD §8 corrections are expected. Unexpected differences get fixed or flagged.

## 4. Content extraction rules

- Copy prose **verbatim** into schema fields. Restructure, never rewrite.
- **Only exception:** literal sizes and spacing values in prose become token names per PRD §8.2–8.3. Record every such change in the entry's `extractionNotes`.
- Ambiguous or contradictory text: keep it as is, flag it in the PR.
- Relationships: every "use something else" row and every Related card becomes a typed `Relationship` or `useInstead` item with its target id. If the target doesn't exist yet as an entry, create a stub entry with status `draft`.

## 5. Component port procedure

Every component issue follows this, in order:

1. **Read** the component's content entry, its `INDEX.md` slices and its baseline screenshots (both themes).
2. **Scaffold.** If a shadcn counterpart exists (see the issue), add it with the shadcn CLI into `packages/ui`. Otherwise build directly on the relevant Radix primitive or plain elements.
3. **Rewrite styling and anatomy** to match the prototype and content entry, using Lairy tokens only. No shadcn token classes may remain; the build fails if they do.
4. **Variants** with cva. Variant names match the content entry's variants exactly.
5. **Accessibility** per the entry and the Accessibility foundation: focus on `:focus-visible`, ring follows the element's radius, overlays trap and restore focus, Escape closes, no positive tabindex.
6. **Examples.** Write the entry's good/bad/demo examples as TSX files next to the component (`packages/ui/src/<component>/examples/`) and reference them by id from the content entry.
7. **Tests.** Behaviour tests in Vitest; axe checks and screenshots for both themes in Playwright.
8. **Docs page** renders from the content entry, with live examples and extracted props.
9. **Registry item** for the component.
10. **Status and version** on the entry set per the issue (default: carry over the prototype's).

## 6. Commands

```bash
pnpm install
pnpm turbo run dev --filter=docs
pnpm turbo run typecheck lint test build
pnpm --filter docs exec playwright test
pnpm --filter mcp run inspect      # MCP inspector against the local server
```

Update this list when scripts change.

## 7. Review checkpoints (Review: Cory)

Cory reviews in the docs app and the PR. At a checkpoint, the session summary must say:

- What decision or output needs review
- Where to look (docs route, PR link, file)
- What was flagged, with evidence
- What's blocked until approval

After Cory approves and merges, the next session picks up from the Kanban as normal.
