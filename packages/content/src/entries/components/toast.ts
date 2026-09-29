import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Toast has no ticket of its own yet (LDS-044); this entry
 * exists only so Callout's `often-confused-with` relationship
 * (docs/build-guide.md §3: "if the target has no entry yet, create a stub
 * with status draft") has somewhere real to point. `purpose` is
 * CONTEXT.md's own glossary definition, verbatim.
 */
export const toast = ComponentEntrySchema.parse({
  meta: {
    id: "toast",
    name: "Toast",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-09-29",
  },
  purpose: "A transient message reporting that something just happened. It says so once and leaves.",
});
