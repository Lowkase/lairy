# Lairy — glossary

The project's own words, each with one meaning. Starter version drafted from planning; `/grill-with-docs` refines it. Where a word is marked *avoid*, use the preferred term instead.

## The system

**Lairy** — The design system: its foundations, components, patterns and the knowledge that describes them. Also the name of the personal OS product built with it; in this repo, "Lairy" means the design system unless stated otherwise.

**Operator** — The person using an interface built with Lairy. The system's writing addresses the operator, never "the user." *Avoid:* user, customer.

**Entry** — One documented unit of the system: a token, foundation, component or pattern, described as structured content.

**Foundation** — An entry defining a system-wide rule set: Color, Typography, Spacing, Radius, Icons, Elevation, Motion, Visualization, Accessibility.

**Component** — An entry for a reusable interface element with its own anatomy, variants and states.

**Pattern** — An entry describing how several components are composed to solve a recurring situation. A pattern has no code of its own.

**Content** — The structured knowledge about entries: purpose, anatomy, usage, rules, examples, relationships, status. The single source of truth for everything written about Lairy.

**Output** — Something generated from content for a consumer: the docs site, the registry, the MCP server, `llms.txt`. *Avoid:* surface (reserved for the colour role).

## Tokens and foundations

**Token** — A named design value (colour, size, space, radius, duration, easing). The only permitted source of such values.

**Role** — The job a group of colour tokens does: Ground, Surface, Line, Text, Amber, Ice, Alarm.

**Ground** — The page background, beneath every surface.

**Surface** — A fill laid over the ground as a translucent layer, never a second opaque colour: panels, cards, hover fills.

**Line** — Borders, dividers, hairlines and HUD corner brackets.

**Amber** — The primary accent. Marks the one thing that is live, alerting or the primary action in a view. *Also called:* accent.

**Ice** — The secondary accent. Marks data, chart links and informational state. *Also called:* accent-2.

**Alarm** — The colour of a broken or failed state. Identical in every theme by design.

**Theme** — A set of values for the themeable tokens: dark (the default) or light.

**Themeable** — A token whose value changes with the theme. Alarm tokens are non-themeable.

**Ramp** — The fixed sequence of permitted spacing values. Anything off the ramp is a bug.

**Lock** — A foundation rule that no component may override, such as the 2px radius.

**Type styles** — The named steps of the type scale: Display, Doc title, Title, Metric, Section, Body, Small, Label, Micro.

**Micro** — The smallest type style, and the floor: nothing in Lairy is set smaller.

**Label** — The uppercase, tracked type style used for panel headers and similar markers. Distinct from a form field's label, which is written *field label*.

## Describing a component

**Anatomy** — The numbered parts a component is made of, each with its job.

**Variant** — A designed alternative form of a component, chosen by the author: primary or secondary, compact or regular.

**Tone** — A variant that expresses the kind of state being reported: info, success, warning, alarm. Tone matches the state, never the writer's sense of urgency.

**State** — A condition a component passes through at runtime: default, hover, focus, disabled, loading, error.

**Usage** — When to use a component (*use when*) and when to reach for a named alternative instead (*use something else when*).

**Rule** — A single, short statement of how something must be done. A rule may be **enforceable**, meaning a lint rule or validator checks it.

**Relationship** — A typed link from one entry to another: *alternative*, *composes-with*, *contrasts-with* or *often-confused-with*, with a sentence saying how they differ.

**Example** — A working code sample attached to an entry: *good* (the right way), *bad* (a tempting wrong way) or *demo* (a showcase).

**Status** — An entry's lifecycle stage: draft, stable, locked or deprecated.

**Locked** — The status of an entry that is finished and changes only by explicit decision.

## Easily confused components

**Badge** — A small, square, system-assigned label stating a standing condition on a row. The operator cannot dismiss it.

**Chip** — A round-ended token representing a value the operator chose, such as a filter. The operator can dismiss it.

**Callout** — A message inside the panel it concerns, reporting a standing condition that stays true until resolved.

**Toast** — A transient message reporting that something just happened. It says so once and leaves.

**Modal** — An overlay that must be answered before the operator can do anything else.

**Drawer** — A side panel showing the details of one thing without leaving the current view.

**Popover** — A small anchored overlay holding a short action list or a few detail pairs.

**Usage card** — The paired "use when / use something else when" card on a docs page. Not an operator-facing component outside documentation.

## The shell

**Shell** — The persistent chrome around every view: main rail, subnav rail and header.

**Main rail** — The narrow left column of top-level modules. *Also called:* dock, Navigation (Main).

**Subnav rail** — The second column listing the sections and pages of the current module. *Also called:* Navigation (Subnav).

**Header** — The bar across the top naming the current module, with the date, clock and identity mark. It never shows page titles.

## The build

**Prototype** — The single-file interactive mockup in `reference/prototype/`. The spec and reference implementation, never source code.

**Baseline** — The screenshots of every prototype page, captured once, used for side-by-side review.

**Harvest** — Scanning the prototype for every raw value and mapping each to a token or flagging it.

**Extraction** — Moving the prototype's written guidance into content entries, verbatim.

**Port** — Building a component fresh from its content entry and tokens, using the prototype only as reference.

**Registry** — The published catalogue from which apps copy Lairy components into their own code.

**Knowledge layer** — Tokens, content and the outputs built from them, usable before any component exists.
