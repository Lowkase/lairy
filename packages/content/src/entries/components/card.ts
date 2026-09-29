import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Cards has no ticket of its own yet (LDS-022) and, unlike
 * Toast/Modal/Badge, no CONTEXT.md glossary entry to draw a purpose from.
 * This entry exists only so Callout's `composes-with` relationship
 * (docs/build-guide.md §3) has somewhere real to point. `purpose` is
 * paraphrased from Callout's own Related-card sentence about it — flagged
 * in the PR, since it describes Cards from Callout's side, not Cards' own
 * definition, and should be replaced once LDS-022 writes the real entry.
 */
export const card = ComponentEntrySchema.parse({
  meta: {
    id: "card",
    name: "Cards",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-09-29",
  },
  purpose: "A bordered container other components, including Callout, sit inside.",
});
