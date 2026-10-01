import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Progress has no ticket of its own yet and, like Cards, no
 * CONTEXT.md glossary entry to draw a purpose from. This entry exists only
 * so Badge's (LDS-020) `alternative` relationship and its "use something
 * else when" row (docs/build-guide.md §3) have somewhere real to point.
 * `purpose` is paraphrased from Badge's own Related-card sentence about it
 * — flagged in the PR, since it describes Progress from Badge's side, not
 * Progress' own definition, and should be replaced once Progress gets its
 * own ticket.
 */
export const progress = ComponentEntrySchema.parse({
  meta: {
    id: "progress",
    name: "Progress",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-01",
  },
  purpose: "Reports a quantity moving over time, where a Badge would otherwise name a fixed state.",
});
