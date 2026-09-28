# Lairy Design System

A production design system (tokens, React components, docs app, registry, MCP server) ported from the prototype in `reference/prototype/`.

## Where things are

- `CONTEXT.md` — the glossary. Use its words; don't invent synonyms.
- `docs/prd.md` — scope and decisions. Read only the sections a ticket lists.
- `docs/adr/` — architecture decisions. Don't relitigate them; propose changes in a PR.
- `docs/build-guide.md` — how work is done on this repo: tickets and merging, prototype rules, content extraction, the component port procedure, review checkpoints. **Read it before starting any ticket.**
- Tickets live in GitHub Issues, titled `LDS-XXX · <title>`.

## Non-negotiable rules

1. **Tokens only.** Every colour, size, space, radius, duration and easing comes from `@lairy/tokens`. No hex values, no px literals, no arbitrary Tailwind values (`text-[10.5px]`, `bg-[#fff]`). If a needed value has no token, flag it — never invent one.
2. **Never copy from the prototype.** It is the spec, not source. Read it to understand; build fresh. Never import, build or lint anything in `reference/`.
3. **Prose is verbatim.** Content extracted from the prototype is restructured, never rewritten. The only permitted change is replacing size and spacing literals with token names, recorded in `extractionNotes`.
4. **Alarm is non-themeable.** `--alarm` and its variants are identical in every theme by design. Do not "fix" this.
5. **The radius is locked** at 2px. Chips use the 20px shape token. Circles only for marks with no layout.
6. **No text below Micro (11px).**
7. **Accessibility is not optional.** `:focus-visible` rings that follow the element's radius, overlays that trap and restore focus, no positive tabindex, AA contrast in both themes, `prefers-reduced-motion` honoured.
8. **Tickets labelled `review:cory` are never merged by an agent.**
9. **Stay in scope.** One ticket per branch. New work becomes a new issue labelled `needs-triage`.

## Repo map

```
apps/docs               Next.js docs app, registry routes, llms.txt, /dev routes
packages/tokens         DTCG source → CSS variables, TS exports, Tailwind theme
packages/content        Zod schemas + entries (tokens, foundations, components, patterns)
packages/ui             Components, icons, examples (src/<component>/examples/)
packages/mcp            MCP server (stdio)
packages/eslint-plugin  Lairy lint rules
reference/              Prototype, INDEX.md, screenshots, harvest report — read-only
docs/                   PRD, ADRs, build guide, agent-skill config
```

The prototype is too large to read whole. Use `reference/INDEX.md` and read only the line ranges you need.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for Lowkase/lairy, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical labels, used as-is: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
