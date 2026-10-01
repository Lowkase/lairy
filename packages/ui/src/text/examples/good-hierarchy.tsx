import { Text } from "../text";

export function TextGoodHierarchyExample() {
  return (
    <div className="flex flex-col gap-7">
      <Text variant="caption">NODE SYNC · CELL 7</Text>
      <Text variant="heading" as="h3">
        Sync holding steady
      </Text>
      <Text variant="body">Replication lag stayed under five seconds the whole window.</Text>
    </div>
  );
}
