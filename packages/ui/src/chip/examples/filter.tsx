import { Chip } from "../chip";

export function ChipFilterExample() {
  return (
    <div className="flex flex-wrap gap-8">
      <Chip variant="filter" pressed={true}>
        OPEN
      </Chip>
      <Chip variant="filter" pressed={false}>
        DONE
      </Chip>
      <Chip variant="filter" pressed={false}>
        ALL
      </Chip>
    </div>
  );
}
