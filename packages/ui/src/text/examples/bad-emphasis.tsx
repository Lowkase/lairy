import { Text } from "../text";

export function TextBadEmphasisExample() {
  return (
    <Text variant="body">
      The window closed at 02:14 and{" "}
      <Text as="span" variant="body" className="text-accent font-semibold">
        two stages were skipped
      </Text>
      , which is why the rollup is short.
    </Text>
  );
}
