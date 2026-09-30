import { FoundationEntrySchema } from "../../schema/foundation";

/**
 * Draft stub. Typography has no ticket of its own yet; this entry exists
 * only so Color's `contrasts-with` relationship (docs/build-guide.md §3:
 * "if the target has no entry yet, create a stub with status draft") has
 * somewhere real to point. `description` is the prototype's own opening
 * two-sentence block (archive/v1/Workspace Shell.dc.html:726–727),
 * verbatim — inline `<span>` colour styling on "made of" and "Text" is
 * dropped as markup, not content.
 */
export const typography = FoundationEntrySchema.parse({
  meta: {
    id: "typography",
    name: "Typography",
    section: "foundations",
    status: "draft",
    version: "0.1.0",
    updated: "2026-09-30",
  },
  description: {
    summary: "Two typefaces, six steps, and no decision left to make at the point of use.",
    boundary:
      "Space Grotesk is structure — headings, numerals, anything the eye should land on first. IBM Plex Mono is everything else, which is why the shell reads like an instrument rather than a website. This page owns the metrics: which sizes exist, how they are tracked and led, and when each one is legal. What a block of copy is made of — eyebrow, heading, body, caption — belongs to the Text component.",
  },
});
