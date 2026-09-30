import { z } from "zod";
import {
  AccessibilityNoteSchema,
  ChangelogEntrySchema,
  ColorTokenNameSchema,
  MetaSchema,
  OpeningDescriptionSchema,
  RelationshipSchema,
  RuleSchema,
} from "./shared";

/** A table or scale a foundation documents, referenced by the tokens that
 * make it up rather than by re-stating their values (docs/prd.md §7.2). */
export const ScaleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  tokens: z.array(ColorTokenNameSchema).default([]),
});
export type Scale = z.infer<typeof ScaleSchema>;

/** The foundation-level equivalent of a component's Usage card
 * (CONTEXT.md "Usage": when to reach for something, when to reach for
 * something else instead). Plain prose rather than typed `useInstead`
 * rows — unlike a component's usage card, a foundation's "reach for
 * something else" line doesn't always name a single other entry by id
 * (docs/prd.md §7.2, extended for LDS-014). */
export const FoundationUsageSchema = z.object({
  useWhen: z.array(z.string().min(1)).default([]),
  useInstead: z.array(z.string().min(1)).default([]),
});
export type FoundationUsage = z.infer<typeof FoundationUsageSchema>;

export const FoundationEntrySchema = z.object({
  meta: MetaSchema,
  description: OpeningDescriptionSchema,
  usage: FoundationUsageSchema.default({ useWhen: [], useInstead: [] }),
  principles: z.array(RuleSchema).default([]),
  scales: z.array(ScaleSchema).default([]),
  /** Closing note under the scales table, when the prototype makes a
   * deliberate omission explicit (the same pattern as a component's
   * `variantsNote`, archive/v1/NOTES.md). */
  scalesNote: z.string().optional(),
  accessibilityNotes: z.array(AccessibilityNoteSchema).default([]),
  relationships: z.array(RelationshipSchema).default([]),
  changelog: z.array(ChangelogEntrySchema).default([]),
  extractionNotes: z.array(z.string().min(1)).default([]),
});
export type FoundationEntry = z.infer<typeof FoundationEntrySchema>;
