import { Callout } from "../callout";

export function CalloutBadToneExample() {
  return (
    <Callout tone="success" title="Export failed" actions={[{ label: "Retry export" }]}>
      The nightly export stopped after 3 of 6 regions.
    </Callout>
  );
}
