import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Table has no ticket of its own yet and, like Cards before
 * LDS-022, no CONTEXT.md glossary entry to draw a purpose from. This entry
 * exists only so Cards' (LDS-022) `alternative` relationship and its "use
 * something else when" row (docs/build-guide.md §3) have somewhere real to
 * point. `purpose` is paraphrased from Cards' own Related-card sentence
 * about it — flagged in the PR, since it describes Table from Cards' side,
 * not Table's own definition, and should be replaced once Table gets its
 * own ticket.
 */
export const table = ComponentEntrySchema.parse({
  meta: {
    id: "table",
    name: "Table",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-01",
  },
  purpose:
    "Rows that share the same fields and want comparing, where a Card would otherwise hold one whole object on its own.",
});
