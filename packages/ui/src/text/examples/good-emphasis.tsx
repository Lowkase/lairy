import { Text } from "../text";

export function TextGoodEmphasisExample() {
  return (
    <Text variant="body">
      The window closed at 02:14 and{" "}
      <Text as="span" variant="body" emphasis>
        two stages were skipped
      </Text>
      , which is why the rollup is short.
    </Text>
  );
}
