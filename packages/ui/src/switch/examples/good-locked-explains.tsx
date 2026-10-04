import { Switch } from "../switch";

export function SwitchGoodLockedExplainsExample() {
  return (
    <Switch
      label="Auto-retry failed runs"
      description="Needs an admin on the workspace"
      disabled
    />
  );
}
