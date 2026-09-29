import { Callout } from "../callout";

export function CalloutBadActionsExample() {
  return (
    <Callout
      tone="warning"
      title="Approaching rate limit"
      actions={[{ label: "Upgrade plan" }, { label: "View usage" }]}
    >
      Signal throughput is at 92% of the hourly cap.
    </Callout>
  );
}
