# ADR-0010: Build in tracer-bullet slices, not layer by layer

**Status:** Accepted — supersedes PRD decision D17
**Date:** 2026-09-28

## Context

PRD D17 ordered the build layer by layer: all tokens, then all content, then the MCP server, then components. The aim was to make agents useful before any component existed. That order puts off testing the schema, docs rendering, registry format and MCP tools until dozens of entries depend on them. The project follows Matt Pocock's skill flow, where `/to-tickets` breaks work into tracer-bullet slices, each going through every layer.

## Decision

The first build slice takes a single component, Callout, through every layer: the tokens it needs, its content entry, the component, its docs page, its registry item and the MCP tools that answer the PRD §13 question about it. Later slices widen that path. Ticket order comes from blocking links, not milestones.

## Consequences

- D17's goal still holds: agents get a working MCP answer within the first few tickets instead of waiting for every entry.
- A mistake in the schema or an output format shows up at entry one, not entry forty-nine.
- The ticket plan's milestone order is used as input for `/to-tickets`, not as the build order.
