import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Modal has no ticket of its own yet (LDS-040); this entry
 * exists only so Callout's `contrasts-with` relationship and its "use
 * something else when" row (docs/build-guide.md §3) have somewhere real to
 * point. `purpose` is CONTEXT.md's own glossary definition, verbatim.
 */
export const modal = ComponentEntrySchema.parse({
  meta: {
    id: "modal",
    name: "Modal",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-09-29",
  },
  purpose: "An overlay that must be answered before the operator can do anything else.",
});
