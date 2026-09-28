# ADR-0003: Tailwind v4 with its default theme removed

**Status:** Accepted
**Date:** 2026-09-28

## Context

Copy-in components work best with styling inside the component file, and agents are fluent in Tailwind. But Tailwind's defaults (`bg-blue-500`, `rounded-lg`, `text-sm`) make off-system values the easiest thing to write.

## Decision

Use Tailwind v4 with a theme generated from `@lairy/tokens`, and remove Tailwind's default colours, spacing, font sizes, radii and shadows. Arbitrary values are disallowed by lint.

## Consequences

- Off-system utilities don't exist, so an agent cannot use them. Foundations are enforced by the tooling before any lint rule or validator runs.
- Class strings are long and harder for humans to scan than CSS Modules. Accepted, since agents do most of the reading and writing.
- CSS Modules with plain CSS variables were considered. They read more cleanly but split every component across two files, which complicates copy-in distribution.
