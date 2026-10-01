import { Text } from "../text";

export function TextBadHierarchyExample() {
  return (
    <div className="flex flex-col gap-7">
      <Text variant="caption" emphasis>
        NODE SYNC · CELL 7
      </Text>
      <Text variant="heading" as="h3">
        Sync holding steady
      </Text>
      <Text variant="body" emphasis>
        Replication lag stayed under five seconds the whole window.
      </Text>
    </div>
  );
}
