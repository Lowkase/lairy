# ADR-0001: Content is the single source of truth, as TypeScript validated by Zod

**Status:** Accepted
**Date:** 2026-09-28

## Context

Lairy is consumed by people (the docs site) and by agents (MCP server, registry, `llms.txt`). If each output kept its own copy of the guidance, the copies would drift within weeks. The prototype's guidance is mostly short, structured statements (rules, usage rows, anatomy parts, relationships), not long-form prose.

## Decision

All knowledge about Lairy lives once, in `packages/content`, as TypeScript data files validated by Zod at build time. Every output is generated from it. Relationships are typed references, examples are TSX files referenced by id, and props are extracted from component source rather than written by hand.

## Consequences

- A missing field, unknown token, duplicate id or dangling reference fails the build.
- Editing content means editing `.ts` files, not Markdown pages. Acceptable because the authors are Cory and agents.
- MDX and YAML were considered. MDX suits long-form writing Lairy doesn't have; YAML reads more like documents but adds a parsing step and weaker editor support for the same schema.
