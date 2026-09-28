# ADR-0007: The alarm colour is identical in every theme

**Status:** Accepted
**Date:** 2026-09-28

## Context

In the prototype, `#ff8f6b` is written literally rather than as a themed variable. The Color foundation explains this is deliberate: no theme may redefine what "broken" looks like. An agent tidying tokens would naturally turn it into a themeable variable.

## Decision

The alarm colour becomes the `--alarm` token, flagged non-themeable, with the prototype's rationale attached. Its translucent variants are consolidated into a small named set, also non-themeable.

## Consequences

- Alarm has a name and a single source like every other colour, without gaining a per-theme value.
- Contrast for alarm is checked against both themes' grounds with one fixed value.
- Any future theme inherits alarm unchanged.
