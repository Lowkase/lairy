import { Callout } from "../callout";

export function CalloutErrorExample() {
  return (
    <Callout
      tone="error"
      title="Export failed"
      actions={[{ label: "Retry export" }, { label: "View log" }]}
    >
      The nightly export stopped after 3 of 6 regions. Retry or check the run log.
    </Callout>
  );
}
