import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Badge has no ticket of its own yet (LDS-020); this entry
 * exists only so Callout's `alternative` relationship and its "use
 * something else when" row (docs/build-guide.md §3) have somewhere real to
 * point. `purpose` is CONTEXT.md's own glossary definition, verbatim.
 */
export const badge = ComponentEntrySchema.parse({
  meta: {
    id: "badge",
    name: "Badges",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-09-29",
  },
  purpose: "A small, square, system-assigned label stating a standing condition on a row. The operator cannot dismiss it.",
});
