import { z } from "zod";
import {
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

export const FoundationEntrySchema = z.object({
  meta: MetaSchema,
  description: OpeningDescriptionSchema,
  principles: z.array(RuleSchema).default([]),
  scales: z.array(ScaleSchema).default([]),
  accessibilityNotes: z.array(z.string().min(1)).default([]),
  relationships: z.array(RelationshipSchema).default([]),
  changelog: z.array(ChangelogEntrySchema).default([]),
  extractionNotes: z.array(z.string().min(1)).default([]),
});
export type FoundationEntry = z.infer<typeof FoundationEntrySchema>;
