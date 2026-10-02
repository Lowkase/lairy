import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Radio has no ticket of its own yet (reference/INDEX.md:
 * `rd`); named alongside Select in Text input's (LDS-028) own "use
 * something else when" row ("The answers are a known list — that is a
 * Select or a Radio group"). That row's own structured `useInstead` target
 * is `select` (see text-input.ts's extractionNotes for why Radio, the
 * row's other named alternative, isn't a second structured target). No
 * CONTEXT.md glossary entry exists for Radio, so `purpose` is paraphrased
 * from that same sentence — flagged, pending Radio's own ticket.
 */
export const radio = ComponentEntrySchema.parse({
  meta: {
    id: "radio",
    name: "Radio",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-02",
  },
  purpose: "A known, short list of mutually exclusive answers, chosen without hiding them behind free text.",
});
