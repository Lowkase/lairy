import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Navigation (Tabs) has no ticket of its own yet
 * (reference/INDEX.md: `tab`, 7018–7352); this entry exists only so Buttons'
 * (LDS-018) `often-confused-with` relationship and its "use something else
 * when" row (docs/build-guide.md §3) have somewhere real to point.
 * CONTEXT.md has no glossary entry for Tabs, so `purpose` is paraphrased
 * from Buttons' own Related-card sentence about it, the same way card.ts's
 * stub paraphrased Callout's Related-card text (see callout.ts's
 * extractionNotes) — flagged, pending Tabs' own ticket.
 */
export const tabs = ComponentEntrySchema.parse({
  meta: {
    id: "tabs",
    name: "Navigation (Tabs)",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-01",
  },
  purpose: "Switches what is shown without changing anything else. If nothing is committed, it is not a button.",
});
