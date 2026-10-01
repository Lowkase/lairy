import { Chip } from "../chip";

export function ChipToggleExample() {
  return (
    <div className="flex flex-wrap gap-8">
      <Chip pressed={true}>FAILED</Chip>
      <Chip pressed={false}>QUEUED</Chip>
    </div>
  );
}
