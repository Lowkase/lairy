import { UsageCard } from "../usage-card";

export function UsageCardGoodPairExample() {
  return (
    <UsageCard
      useWhenTitle="Reach for amber when"
      useWhen={[
        "The one thing on screen that is live or alerting needs marking.",
        "The operator is being asked to act, not just informed.",
      ]}
      useInstead={["The colour is informing rather than acting — that is Ice, not Amber."]}
    />
  );
}
