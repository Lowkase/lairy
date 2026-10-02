import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Loading has no ticket of its own yet (LDS-025, #27, open) and
 * no CONTEXT.md glossary entry to draw a purpose from — the same situation
 * empty-state.ts's own prior stub was in for Text (LDS-024). This entry
 * exists only so Empty state's own `useInstead` row ("The answer is not
 * known yet — that is Loading") and its `relationships` row have somewhere
 * real to point (docs/build-guide.md §3). `purpose` is paraphrased from
 * Empty state's own boundary sentence about Loading, flagged in the PR, and
 * should be replaced once Loading gets its own ticket.
 */
export const loading = ComponentEntrySchema.parse({
  meta: {
    id: "loading",
    name: "Loading",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-01",
  },
  purpose: "What a region shows while it still does not know the answer.",
});
