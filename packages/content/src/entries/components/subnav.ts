import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Navigation (Subnav) has no ticket of its own yet
 * (reference/INDEX.md: `subnav`, second-column chrome,
 * Workspace Shell.dc.html 155–178); this entry exists only so Tabs'
 * (LDS-033) `often-confused-with` relationship and its "use something else
 * when" row (docs/build-guide.md §3) have somewhere real to point. `name`
 * and `id` follow CONTEXT.md's own glossary term ("Subnav rail — ... Also
 * called: Navigation (Subnav)."), the same precedent main-rail.ts set for
 * Navigation (Main). `purpose` is paraphrased from Tabs' own Related-card
 * sentence about it (tabs.ts extractionNotes) — flagged, pending Navigation
 * (Subnav)'s own ticket.
 */
export const subnav = ComponentEntrySchema.parse({
  meta: {
    id: "subnav",
    name: "Navigation (Subnav)",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-04",
  },
  purpose:
    "Loads a different page, rather than re-dressing the one already open. The column lists the sections and pages of the current module.",
});
