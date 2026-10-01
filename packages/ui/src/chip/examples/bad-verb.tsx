import { Chip } from "../chip";

export function ChipBadVerbExample() {
  return (
    <div className="flex flex-wrap gap-8">
      <Chip pressed={false}>RUN NOW</Chip>
      <Chip pressed={false}>DELETE</Chip>
    </div>
  );
}
