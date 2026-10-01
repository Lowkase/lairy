import { Chip } from "../chip";

export function ChipToggleExample() {
  return (
    <div className="flex flex-wrap gap-8">
      <Chip variant="toggle" pressed={true}>
        FAILED
      </Chip>
      <Chip variant="toggle" pressed={false}>
        QUEUED
      </Chip>
    </div>
  );
}
