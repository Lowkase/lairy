import { z } from "zod";
import {
  ChangelogEntrySchema,
  EntryIdSchema,
  ExampleSchema,
  MetaSchema,
  RelationshipSchema,
  RuleSchema,
} from "./shared";

export const PatternEntrySchema = z.object({
  meta: MetaSchema,
  description: z.string().min(1),
  whenItApplies: z.array(z.string().min(1)).default([]),
  /** The components this pattern composes, by id — checked against the
   * catalogue like a relationship target (catalogue.ts). */
  composes: z.array(EntryIdSchema).default([]),
  rules: z.array(RuleSchema).default([]),
  examples: z.array(ExampleSchema).default([]),
  relationships: z.array(RelationshipSchema).default([]),
  changelog: z.array(ChangelogEntrySchema).default([]),
  extractionNotes: z.array(z.string().min(1)).default([]),
});
export type PatternEntry = z.infer<typeof PatternEntrySchema>;
