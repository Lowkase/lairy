import type { SelectMultiOption } from "../select-multi";

export const STAGE_OPTIONS: SelectMultiOption[] = [
  { value: "ingest", label: "Ingest", meta: "12 src" },
  { value: "normalize", label: "Normalize", meta: "4 rules" },
  { value: "summarize", label: "Summarize", meta: "Agent" },
  { value: "export", label: "Export", meta: "3 dest" },
  { value: "archive", label: "Archive", meta: "Cold" },
];
