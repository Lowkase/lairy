# ADR-0006: Nothing in Lairy is set below 11px

**Status:** Accepted
**Date:** 2026-09-28

## Context

The prototype's most common font size is 10.5px (over a thousand uses), with scattered 8–9.5px text. Some of its own content rules name these sizes (badges are "10.5px, .12em tracking"). The project requires readable text: no tiny labels.

## Decision

Micro (11px) is the smallest type style and a hard floor. Sentence-length text is Small (13px) or larger. Off-scale prototype sizes map to the nearest style (10.5 → Micro, 11.5 → Label, 12.5 → Small, 13.5 → Body). Text inside chart SVGs is judged by its rendered size.

## Consequences

- Badges, table headers and similar markers render slightly larger than in the prototype.
- Content rules that name the old sizes are updated to style names during extraction — the one exception to verbatim extraction (ADR-0009).
- Lairy's operator-console character comes from the monospaced face and wide tracking, which are unchanged.
