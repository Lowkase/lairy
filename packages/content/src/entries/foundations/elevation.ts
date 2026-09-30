import { FoundationEntrySchema } from "../../schema/foundation";

/**
 * Draft stub. Elevation has no ticket of its own yet; this entry exists
 * only so Color's `contrasts-with` relationship (docs/build-guide.md §3:
 * "if the target has no entry yet, create a stub with status draft") has
 * somewhere real to point. `description` is the prototype's own opening
 * two-sentence block (archive/v1/Workspace Shell.dc.html:1773–1774),
 * verbatim — inline `<span>` colour styling on "Escape" is dropped as
 * markup, not content.
 */
export const elevation = FoundationEntrySchema.parse({
  meta: {
    id: "elevation",
    name: "Elevation",
    section: "foundations",
    status: "draft",
    version: "0.1.0",
    updated: "2026-09-30",
  },
  description: {
    summary:
      "A shadow in this system does not mean important. It means temporary — this thing has left the page and can be dismissed.",
    boundary:
      "Every surface that belongs to the layout sits flat: cards, panels, tables, rails, the header. Separation between them is a hairline, never a shadow, because a raised card promises a dismiss that is not there. The four levels below are therefore not a scale of importance — they are four distances a floating thing can be from the page, and each one is spoken for by a single kind of overlay. Depth is not decoration here; it is the only visual cue that Escape will do something.",
  },
});
