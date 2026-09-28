# Lairy build guide

The generic workflow (picking a ticket, implementing, reviewing) is handled by the agent skills listed in `AGENTS.md`. This guide holds what those skills can't know: how work on **this** design system is done.

Vocabulary follows `CONTEXT.md`. Decisions: `docs/prd.md` and `docs/adr/`.

---

## 1. Tickets, branches and merging

- Tickets live in GitHub Issues, titled `LDS-XXX · <title>`. Dependencies are GitHub blocking links. Never start a ticket whose blockers are open.
- Any open `ready-for-agent` ticket whose blockers are all closed can be picked up.
- One ticket per branch: `issue/LDS-XXX-short-slug`. Commits start with the ticket ID: `LDS-XXX: <what changed>`.
- Open a PR that closes the issue (`Closes #<n>`). The PR body lists what was done, each acceptance criterion checked, decisions made and anything flagged.
- **Merging:**
  - Ticket labelled `review:cory` → never merge. Stop and summarise what Cory needs to review (see §5).
  - Otherwise → merge (`gh pr merge --squash --delete-branch`) once code review is done and CI is green.
  - CI red and not fixable within the ticket → comment on the issue explaining why, and stop.
- **Bootstrap exception:** LDS-001 and LDS-002 commit directly to `main`, because CI doesn't exist yet.
- **Serial by default.** Parallel sessions are fine only for tickets with no shared files and no dependency between them.

### Scope discipline

- Something outside the ticket? Open a new issue labelled `needs-triage`, note `Found during LDS-XXX`, and keep going.
- Never edit PRD decisions or accepted ADRs. Propose changes in the PR and flag them for Cory.
- Never close a ticket with failing checks or unmet acceptance criteria.

## 2. Using the prototype

- The prototype is `archive/v1/Workspace Shell.dc.html` and its runtime `support.js`. `archive/` is read-only: never edited, imported, built or linted (ADR-0005).
- Navigate it through `reference/INDEX.md`. Read only the line ranges a ticket needs. For how the prototype's docs pages are built, read `archive/v1/NOTES.md`.
- **Never copy markup or inline styles.** Read the prototype to understand appearance and behaviour, then build fresh from tokens and the content entry.
- Any value in the prototype with no matching token: flag it in the PR. Never hard-code it.
- Compare against `reference/screenshots/` with the docs app's `/dev/compare/[entry]` route. Differences caused by `docs/prd.md` §8 corrections are expected. Unexpected differences get fixed or flagged.

## 3. Content extraction

- Copy prose **verbatim** into schema fields. Restructure, never rewrite (ADR-0009).
- **Only exception:** literal sizes and spacing values in prose become token names per `docs/prd.md` §8.2–8.3. Record every such change in the entry's `extractionNotes`.
- Ambiguous or contradictory text: keep it, flag it in the PR.
- Every "use something else" row and every Related card becomes a typed `Relationship` or `useInstead` item with its target id. If the target has no entry yet, create a stub with status `draft`.
- Use the glossary's words. If the prototype uses a term differently from `CONTEXT.md`, keep the prose verbatim and flag the conflict.

## 4. Component port procedure

Every component ticket follows this, in order:

1. **Read** the component's content entry, its `INDEX.md` slices and its baseline screenshots (both themes).
2. **Scaffold.** If the ticket names a shadcn counterpart, add it with the shadcn CLI into `packages/ui`. Otherwise build on the relevant Radix primitive or plain elements.
3. **Rewrite styling and anatomy** to match the prototype and content entry, using Lairy tokens only. No shadcn token classes may remain; the build fails if they do (ADR-0004).
4. **Variants** with cva. Variant names match the content entry's variants exactly.
5. **Accessibility** per the entry and the Accessibility foundation: focus on `:focus-visible`, the ring follows the element's radius, overlays trap and restore focus, Escape closes, no positive tabindex.
6. **Examples.** Write the entry's good, bad and demo examples as TSX files in `packages/ui/src/<component>/examples/` and reference them by id from the content entry.
7. **Tests.** Behaviour in Vitest (write the test first where the behaviour is specified); axe checks and screenshots for both themes in Playwright.
8. **Docs page** renders from the content entry, with live examples and extracted props.
9. **Registry item** for the component.
10. **Status and version** on the entry set per the ticket (default: carry over the prototype's).

## 5. Review checkpoints (`review:cory`)

Cory reviews in the docs app and the PR. When stopping at a checkpoint, the summary says:

- What decision or output needs review
- Where to look (docs route, PR link, file)
- What was flagged, with evidence
- What's blocked until approval

## 6. Commands

```bash
pnpm install
pnpm turbo run dev --filter=docs
pnpm turbo run typecheck lint test build
pnpm --filter docs exec playwright test
pnpm --filter mcp run inspect      # MCP inspector against the local server
```

Update this list when scripts change.
