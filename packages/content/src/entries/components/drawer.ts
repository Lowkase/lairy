import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Drawer has no ticket of its own yet; this entry exists only
 * so Popover's (LDS-039) `useInstead` row and Kinds-section closing note
 * ("the content has outgrown a peripheral surface and belongs in a
 * Drawer") have somewhere real to point, the same precedent popover.ts's
 * own stub set when Table (LDS-034) needed it. `purpose` paraphrases
 * CONTEXT.md's own glossary line ("A side panel showing the details of
 * one thing without leaving the current view"), which already exists —
 * unlike subnav's and main-rail's own stubs, this one needed no paraphrase
 * from a referencing entry's side.
 */
export const drawer = ComponentEntrySchema.parse({
  meta: {
    id: "drawer",
    name: "Drawer",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-06",
  },
  purpose: "A side panel showing the details of one thing without leaving the current view.",
});
