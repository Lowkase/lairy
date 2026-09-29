import { Callout } from "../callout";

export function CalloutGoodToneExample() {
  return (
    <Callout tone="error" title="Export failed" actions={[{ label: "Retry export" }]}>
      The nightly export stopped after 3 of 6 regions.
    </Callout>
  );
}
