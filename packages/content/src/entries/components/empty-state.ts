import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Empty state has no ticket of its own yet and no CONTEXT.md
 * glossary entry to draw a purpose from — the same situation card.ts's stub
 * was in for Cards (LDS-018). This entry exists only so Text's `useInstead`
 * row ("There is no content to describe — that is an Empty state") has
 * somewhere real to point (docs/build-guide.md §3). `purpose` is paraphrased
 * from that row's own sentence, flagged in the PR, and should be replaced
 * once Empty state gets its own ticket.
 */
export const emptyState = ComponentEntrySchema.parse({
  meta: {
    id: "empty-state",
    name: "Empty state",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-01",
  },
  purpose: "What a panel shows in place of Text when it has no content to describe yet.",
});
