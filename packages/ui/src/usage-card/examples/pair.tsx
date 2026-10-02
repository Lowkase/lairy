import { UsageCard } from "../usage-card";

export function UsageCardPairExample() {
  return (
    <UsageCard
      useWhen={["A condition is standing, not momentary.", "The rule is worth stating in one glance."]}
      useInstead={["The right component is named inline."]}
    />
  );
}
