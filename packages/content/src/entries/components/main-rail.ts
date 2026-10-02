import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Navigation (Main) has no ticket of its own yet
 * (reference/INDEX.md: `nav`, Main rail chrome, Workspace Shell.dc.html
 * 128–154); this entry exists only so Scrollbar's (LDS-027) `contrasts-with`
 * relationship and its "use something else when" row (docs/build-guide.md
 * §3) have somewhere real to point. `name` and `id` follow CONTEXT.md's own
 * glossary term ("Main rail — ... Also called: dock, Navigation (Main)."),
 * the same precedent tabs.ts set when it named its own stub "Navigation
 * (Tabs)" rather than inventing a different id. `purpose` is paraphrased
 * from Scrollbar's own Related-card sentence about it (Scrollbar
 * extractionNotes) — flagged, pending Navigation (Main)'s own ticket.
 */
export const mainRail = ComponentEntrySchema.parse({
  meta: {
    id: "main-rail",
    name: "Navigation (Main)",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-02",
  },
  purpose: "The narrow left column of top-level modules. Hides a Scrollbar rather than shrinking it on its own 56px collapsed rail.",
});
