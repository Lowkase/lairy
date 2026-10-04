import { Switch } from "../switch";

export function SwitchAutoRetryFailedRunsExample() {
  return (
    <Switch
      label="Auto-retry failed runs"
      description="Retries twice, then stops and notifies"
      defaultChecked
    />
  );
}
