import { Chip } from "../chip";

export function ChipGoodOntoneExample() {
  return (
    <div className="flex flex-wrap gap-8">
      <Chip pressed={true}>OPEN</Chip>
      <Chip pressed={false}>DONE</Chip>
      <Chip pressed={false}>ALL</Chip>
    </div>
  );
}
