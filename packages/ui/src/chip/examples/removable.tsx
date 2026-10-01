import { Chip } from "../chip";

export function ChipRemovableExample() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <Chip removable>FLEET</Chip>
      <Chip removable>RESEARCH</Chip>
    </div>
  );
}
