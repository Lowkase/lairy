# ADR-0002: Tokens ship as a package; components ship through a copy-in registry

**Status:** Accepted
**Date:** 2026-09-28

## Context

Apps built with Lairy will mostly be built by agents. Agents work best when they can read and adapt the source of what they use, but the system's foundations must not vary between apps.

## Decision

`@lairy/tokens` is a versioned package that apps never edit. Components are distributed through a shadcn-format registry served by the docs app, so each app gets the component source in its own codebase.

## Consequences

- Foundations stay identical everywhere; a palette change reaches every app on its next version bump.
- Component copies can diverge. This is contained by: styling only through tokens, behaviour living in Radix, the Lairy ESLint plugin, the MCP `validate` tool and the shadcn CLI's diff against the registry.
- A fully packaged component library was considered. It gives one-command upgrades across apps but makes components a black box to agents, who then write one-off lookalikes for edge cases.
- Because the registry and a package can both be generated from `packages/ui`, publishing components as a package later needs no restructuring.
