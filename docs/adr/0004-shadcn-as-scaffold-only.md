# ADR-0004: shadcn provides infrastructure and scaffolds; Lairy provides every visual

**Status:** Accepted
**Date:** 2026-09-28

## Context

About 20 of Lairy's components have shadcn counterparts. shadcn has already solved the Radix wiring, ref forwarding and state-to-style mapping. Its visual defaults look nothing like Lairy, and partial restyles tend to leave shadcn token classes (`bg-background`, `text-muted-foreground`) behind.

## Decision

Adopt shadcn's registry format, CLI and conventions fully. Use its components only as starting scaffolds; rewrite every style and anatomy detail against the prototype and the content entry.

## Consequences

- Because Lairy's Tailwind theme contains only Lairy tokens (ADR-0003), any leftover shadcn class fails the build. A half-converted component cannot ship.
- Building everything directly on Radix was considered. It gives no more distinctive result, since the distinctiveness is in the styling layer that is rewritten anyway, and costs time on Select, Popover, Modal and Toast.
