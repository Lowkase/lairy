import { Callout } from "../callout";

export function CalloutGoodActionsExample() {
  return (
    <Callout tone="warning" title="Approaching rate limit" actions={[{ label: "View usage" }]}>
      Signal throughput is at 92% of the hourly cap.
    </Callout>
  );
}
