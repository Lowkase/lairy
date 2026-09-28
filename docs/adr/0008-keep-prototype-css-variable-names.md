# ADR-0008: Keep the prototype's CSS variable names

**Status:** Accepted
**Date:** 2026-09-28

## Context

The prototype's colour tokens have short names (`--fg`, `--dim`, `--mute`, `--faint`, `--panel`, `--accent`, `--accent-2`). A port would normally rename them to a longer semantic scheme. But the prototype's written guidance refers to them by name ("a --mute line beneath", "--faint, never body").

## Decision

The token package keeps the prototype's variable names exactly. Longer semantic names are not introduced.

## Consequences

- Prose carried over verbatim stays accurate without rewriting.
- The names are terse, so each token's content entry carries its role, use for and never for.
- A rename later would mean rewriting guidance across every entry, so this is costly to reverse.
