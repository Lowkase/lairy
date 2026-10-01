import { Text } from "../text";

export function TextStackExample() {
  return (
    <div className="flex flex-col gap-11">
      <Text variant="eyebrow">PIPELINE / RUN 4182</Text>
      <Text variant="heading">Everything nominal</Text>
      <Text variant="body">Four stages finished inside their windows. Nothing needs an operator right now.</Text>
      <Text variant="body" emphasis>
        214 runs · 0 failures
      </Text>
      <Text variant="caption">Last checked 2m ago</Text>
    </div>
  );
}
