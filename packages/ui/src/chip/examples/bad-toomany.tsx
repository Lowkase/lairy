import { Chip } from "../chip";

const LABELS = [
  "OPEN",
  "DONE",
  "ALL",
  "ALERTS",
  "MANUAL",
  "QUEUED",
  "ARCHIVED",
  "FAILED",
  "DRAFT",
  "SYNCED",
  "PAUSED",
];

export function ChipBadToomanyExample() {
  return (
    <div className="flex flex-wrap gap-8">
      {LABELS.map((label) => (
        <Chip key={label} pressed={false}>
          {label}
        </Chip>
      ))}
    </div>
  );
}
