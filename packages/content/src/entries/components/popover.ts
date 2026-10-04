import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Popover has no ticket of its own yet; this entry exists only
 * so Table's (LDS-034) `composes-with` relationship (its row's own overflow
 * menu "follows that component's rules") has somewhere real to point, the
 * same precedent tabs.ts's own subnav.ts stub set. `purpose` paraphrases
 * CONTEXT.md's own glossary line ("A small anchored overlay holding a short
 * action list or a few detail pairs"), which already exists — unlike
 * subnav's and main-rail's own stubs, this one needed no paraphrase from a
 * referencing entry's side.
 */
export const popover = ComponentEntrySchema.parse({
  meta: {
    id: "popover",
    name: "Popover",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-04",
  },
  purpose: "A small anchored overlay holding a short action list or a few detail pairs.",
});
