import { Callout } from "../callout";

export function CalloutWarningExample() {
  return (
    <Callout tone="warning" title="Approaching rate limit" actions={[{ label: "View usage" }]}>
      Signal throughput is at 92% of the hourly cap. No action required yet.
    </Callout>
  );
}
