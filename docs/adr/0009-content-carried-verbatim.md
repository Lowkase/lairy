# ADR-0009: Prototype guidance is carried over verbatim

**Status:** Accepted
**Date:** 2026-09-28

## Context

Most of Lairy's value is its written guidance: usage rules, relationships between components, anatomy notes, content rules and accessibility rationale. This is Cory's voice and reasoning. Agents extracting it tend to paraphrase, and small paraphrases erode precise rules ("at most one action reads as primary") into weaker ones.

## Decision

Extraction restructures prose into content fields without rewriting it. The only permitted change is replacing literal size and spacing values with token or style names, and each such change is recorded in the entry's `extractionNotes`. Ambiguous or contradictory text is kept and flagged.

## Consequences

- The docs, MCP answers and `llms.txt` all speak in the original voice.
- Some prose will be imperfect or inconsistent; it is flagged for Cory rather than fixed by an agent.
- Extraction batches include a voice check by Cory before merging.
