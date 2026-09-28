# Lairy Design System

A production design system (tokens, React components, docs app, registry, MCP server) ported from the prototype in `reference/prototype/`.

**Start every session by reading `BUILD.md`.** It defines how to pick, do and finish work from `KANBAN.md`. `PRD.md` holds scope and decisions; read only the sections an issue lists.

## Non-negotiable rules

1. **Tokens only.** Every colour, size, space, radius, duration and easing comes from `@lairy/tokens`. No hex values, no px literals, no arbitrary Tailwind values (`text-[10.5px]`, `bg-[#fff]`). If a needed value has no token, flag it — never invent one.
2. **Never copy from the prototype.** It is the spec, not source. Read it to understand; build fresh. Never import, build or lint anything in `reference/`.
3. **Prose is verbatim.** Content extracted from the prototype is restructured, never rewritten. The only permitted change is replacing size/spacing literals with token names, recorded in `extractionNotes`.
4. **Alarm is non-themeable.** `--alarm` and its variants are identical in every theme by design. Do not "fix" this.
5. **The radius is locked** at 2px. Chips use the 20px shape token. Circles only for marks with no layout.
6. **No text below Micro (11px).**
7. **Accessibility is not optional.** `:focus-visible` rings that follow the element's radius, overlays that trap and restore focus, no positive tabindex, AA contrast in both themes, `prefers-reduced-motion` honoured.
8. **Never edit PRD decisions.** Propose changes in a PR and flag them for Cory.
9. **Stay in scope.** One issue per branch. New work becomes a new Kanban issue.

## Repo map

```
apps/docs               Next.js docs app, registry routes, llms.txt, /dev routes
packages/tokens         DTCG source → CSS variables, TS exports, Tailwind theme
packages/content        Zod schemas + entries (tokens, foundations, components, patterns)
packages/ui             Components, icons, examples (src/<component>/examples/)
packages/mcp            MCP server (stdio)
packages/eslint-plugin  Lairy lint rules
reference/              Prototype, INDEX.md, screenshots, harvest report — read-only
```

## Finding things in the prototype

Use `reference/INDEX.md`. Read only the line ranges you need; the file is too large to read whole.
