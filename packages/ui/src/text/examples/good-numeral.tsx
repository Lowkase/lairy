import { Text } from "../text";

export function TextGoodNumeralExample() {
  return (
    <div className="flex flex-col gap-5">
      <Text variant="eyebrow">LAST RUN</Text>
      <Text variant="heading" numeric>
        02:14
      </Text>
    </div>
  );
}
