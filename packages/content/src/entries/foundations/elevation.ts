import { FoundationEntrySchema } from "../../schema/foundation";

/**
 * Elevation, extracted from archive/v1/Workspace Shell.dc.html (template
 * 1769–2100, logic `elevDocs()` 15010, `elevRelated()` 15045) per
 * docs/build-guide.md §3. Prose is verbatim (ADR-0009); inline `<span>`
 * colour styling in the boundary, Levels and Usage rows is dropped as
 * markup, not content. See extractionNotes for every place structured
 * metadata was added or a value was restructured rather than lifted
 * directly.
 */
export const elevation = FoundationEntrySchema.parse({
  meta: {
    id: "elevation",
    name: "Elevation",
    section: "foundations",
    status: "stable",
    version: "1.1.0",
    updated: "2026-08-26",
  },
  description: {
    summary:
      "A shadow in this system does not mean important. It means temporary — this thing has left the page and can be dismissed.",
    boundary:
      "Every surface that belongs to the layout sits flat: cards, panels, tables, rails, the header. Separation between them is a hairline, never a shadow, because a raised card promises a dismiss that is not there. The four levels below are therefore not a scale of importance — they are four distances a floating thing can be from the page, and each one is spoken for by a single kind of overlay. Depth is not decoration here; it is the only visual cue that Escape will do something.",
  },
  scales: [
    {
      name: "Flat",
      tokens: [],
      description:
        "Everything in the layout. Cards, panels, tables, the dock, the subnav, the header — all of it sits on the background with a hairline for separation. This is the default and it covers the overwhelming majority of surfaces, which is why the page reads as one plane rather than a stack of trays.",
    },
    {
      name: "Bubble",
      tokens: ["shadow-bubble"],
      description:
        "Tooltip, and nothing else. The shortest throw in the set because the bubble has to stay visually attached to the control it names — lift it any further and it starts to read as a menu you could click.",
    },
    {
      name: "Menu",
      tokens: ["shadow-menu"],
      description:
        "Anything anchored to a trigger: Select, Multi-select, Popover, the account menu, a table row's overflow. It floats free of the page but stays tied to a position on it, so it takes no scrim — the page behind is still legible and still the context. Toast takes this throw too, despite sitting at the top of the z ladder: it is pinned to a corner rather than to a trigger, but it is the same kind of small, self-dismissing thing, and giving it the overlay throw would make a passing confirmation look like a question.",
    },
    {
      name: "Overlay",
      tokens: ["shadow-overlay", "shadow-overlay-horizontal"],
      description:
        "Modal, Drawer and the command bar — the three things that take the whole screen hostage. The drawer runs the same throw on its horizontal axis, -30px 0 90px, so a panel entering from the right casts its shadow back across the page it covers rather than downward onto nothing.",
    },
    {
      name: "Chrome",
      tokens: ["z-chrome"],
      description:
        "The dock, the subnav rail and the top status bar. They are flat and they are first — everything else in the page renders below them without asking.",
    },
    {
      name: "Rail stub",
      tokens: ["z-rail-stub"],
      description:
        "The collapsed-rail handle. Above the chrome only because it has to sit on the seam between two pieces of it.",
    },
    {
      name: "Command bar",
      tokens: ["z-command-bar"],
      description: "Above the page and its chrome, below anything that could interrupt it.",
    },
    {
      name: "Modal · drawer",
      tokens: ["z-overlay"],
      description:
        "The blocking layer. Both live at the same stop because two of them are never open at once — if that is ever needed, the answer is one overlay with two steps, not a taller ladder.",
    },
    {
      name: "Toast",
      tokens: ["z-toast"],
      description:
        "The top of the ladder, so a confirmation is legible over a modal that caused it. It is also the only stop that never takes a scrim — a toast interrupts nothing — and the one place where a high z sits on the middle throw: it takes the Menu shadow, not the Overlay one.",
    },
    {
      name: "Hover",
      tokens: ["shadow-hover-lift", "shadow-hover-lift-accent"],
      description:
        "A one-pixel lift with a tight shadow. It is feedback on a control, not a change of layer — which is why the throw is a tenth of the Menu level and disappears the moment the pointer leaves. The primary button casts the same lift in amber rather than black, because a neutral shadow under a saturated fill reads as dirt.",
    },
    {
      name: "Press",
      tokens: ["shadow-press", "shadow-press-primary"],
      description:
        "The two inset shadows in the system, and both of them are presses. Press is the mirror of hover — down instead of up — so a control that lifts on hover must sink on press, or the click has no landing. The primary's inset is a hair deeper because it has to darken an already-bright fill.",
    },
  ],
  scalesNote:
    "There is no level between Menu and Overlay, and no level for a card. If a surface seems to need one, it is usually a surface that wants to be an overlay and has not committed — or a hairline that was never drawn.",
  usage: {
    useWhen: [
      "The thing appeared in response to an action and will go away again.",
      "It covers content it did not push aside, so its edges must be readable against anything.",
      "Escape or a click outside will dismiss it. Elevation is the promise; the handler is the delivery.",
      "It escapes its parent's bounds — a menu on the last table row cannot be clipped.",
    ],
    useInstead: [
      "It is part of the page and stays there — every Card and panel.",
      "You want to signal importance. That is Color's job, or a heavier border.",
      "You are separating two adjacent surfaces. A 1px hairline is the tool, and it goes first.",
      "The surface scrolls with the content. A shadow that scrolls reads as a rendering error.",
    ],
  },
  principles: [
    {
      text: "A scrim is a tinted blur of the page's own background, never a black wash. Black would flatten the amber and read as a different product; blurring the page keeps the operator's place visible while making it plainly out of reach.",
    },
    {
      text: "Five stops, wide apart on purpose: the gaps leave room for a local raise inside a component without anything needing to renegotiate with the ladder. A new value is a design decision, not a bug fix — there is no z-index 81.",
    },
    {
      text: "Neither hover nor press belongs to the level set, and neither may be reused on a surface that is not a control. The focus ring is also a box-shadow — a 2px background gap plus a 4px amber halo — but it is a ring, not a shadow: it does not move the element and it is owned by Accessibility.",
    },
  ],
  accessibilityNotes: [
    {
      title: "Depth is never the only cue",
      body: "A raised surface also has a border, a distinct background and a focus trap. Shadows are invisible in forced-colours mode and to anyone who cannot resolve a soft edge, so every overlay is legible with the shadow stripped out.",
    },
    {
      title: "Focus follows the layer",
      body: "Opening an overlay moves focus into it and traps it there; closing returns focus to the trigger. Elevation without a focus move is a visual trick — a keyboard operator would still be several tabs behind on the page underneath.",
    },
    {
      title: "Scrims keep contrast",
      body: "A scrim tints the background but never sits between the overlay and its own text. Every level was checked against both themes: overlay text keeps its full --fg contrast because the panel is opaque --bg, not a translucent sheet.",
    },
    {
      title: "Blur is not motion",
      body: "The backdrop blur is static and applied on open — it never animates, so it costs nothing to anyone with reduced-motion set and never produces the swimming effect of an animated blur.",
    },
  ],
  relationships: [
    {
      target: "radius",
      kind: "contrasts-with",
      text: "The other geometric lock. Corners stay sharp at every level, so an overlay is told apart by its shadow and its scrim rather than by a softer shape.",
    },
    {
      target: "color",
      kind: "composes-with",
      text: "Owns the tint a scrim is built from and the border that survives when the shadow does not render.",
    },
  ],
  changelog: [
    {
      version: "1.1.0",
      date: "2026-08-26",
      text: "Published four levels and the five-stop z ladder. Split hover and press out as pressure so they stop being read as a fifth and sixth level, and documented the primary button's amber lift and deeper press alongside the neutral pair.",
    },
    {
      version: "1.0.1",
      date: "2026-08-17",
      text: "Replaced the black modal wash with a tinted blur of the page background, and gave the drawer the horizontal form of the overlay throw.",
    },
    {
      version: "1.0.0",
      date: "2026-08-09",
      text: "Flattened every card and panel to none. Elevation became a property of overlays only.",
    },
  ],
  extractionNotes: [
    "`scales` combines three of this page's tables, not one: Section 01 \"Levels\" (4 rows: Flat, Bubble, Menu, Overlay), Section 03 \"The z ladder\" (`elevZ`, 5 stops) and the two Pressure specimens (Section 04's Hover and Press). Each row's long `b` field becomes the scale's `description`, verbatim, and the shadow/z-index values it names become the real token names from packages/content/src/entries/tokens/elevation.ts (LDS-013). Flat has no token (`none`), so its `tokens` is empty.",
    "Section 02 \"Scrim\" (`elevScrims`, 4 rows: Modal, Command bar, Drawer, Dock · rail) is not stored as `scales`: its recipes (\"bg 55% · blur 6px\") are not themselves tokens, only opacity/blur values applied to --bg, so there is nothing to put in a `tokens` array without inventing one (AGENTS.md rule 1). Its closing note (\"A scrim is a tinted blur...\") is folded into `principles` instead, so the rule itself isn't lost. Flagged for the token decisions backlog.",
    "The Levels table's own closing note (\"There is no level between Menu and Overlay...\") becomes `scalesNote`. The z ladder's own closing note (\"Five stops, wide apart on purpose...\") and the Pressure section's own closing paragraph (\"Neither value belongs to the level set...\") are folded into `principles` instead, since `scalesNote` only holds one string.",
    "`elevRelated()`'s three cards target Modal (a component, no entry yet), Radius and Color. Per catalogue.ts's existing scope boundary (foundation `relationships` resolve only against the foundations catalogue, LDS-014), Modal is dropped rather than left dangling; Radius and Color are kept.",
    "Section 06 \"Do and don't\" is not stored in this entry, the same as the other foundations extracted so far (docs/build-guide.md §4 step 6 — component examples, not Foundation content).",
    "Section 08 \"Tokens\" (`elevTokens`) also lists `--bg` (\"the fill of every raised surface, and the tint of every scrim\") and `--border-2` (\"the edge an overlay needs when the shadow is not rendered\") — two colour-role mentions that don't belong to any one Level, Scrim or Pressure row on their own, so they are not represented as a separate `scales` entry. Flagged rather than forced into one of the existing rows.",
  ],
});
