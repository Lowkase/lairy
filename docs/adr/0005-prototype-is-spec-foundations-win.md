# ADR-0005: The prototype is the spec, and its documented foundations win over its markup

**Status:** Accepted
**Date:** 2026-09-28

## Context

The prototype is a single 1.6 MB file: a 13,000-line template and a 3,500-line logic class with inline styles almost everywhere. Its Foundations pages are carefully reasoned, but its markup drifted from them: it uses around twenty font sizes against a documented scale, and common gaps (14px, 9px) that are off the documented spacing ramp.

## Decision

The prototype is a read-only reference, never imported or copied. Components are built fresh from tokens and content entries. Where the prototype's markup and its documented foundations disagree, the documented foundations win.

## Consequences

- The port looks slightly different from the prototype in places. Screenshot comparison is a review aid, not a pass/fail gate.
- Every raw value is harvested and mapped to a token or flagged, so drift is corrected deliberately rather than silently.
- Porting the markup directly was not viable: nothing in it is structurally reusable as components.
