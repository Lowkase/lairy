import { Switch } from "../switch";

export function SwitchGoodStackedSettingsExample() {
  return (
    <div className="flex flex-col">
      <Switch label="Auto-retry" defaultChecked />
      <Switch label="Notify on failure" />
    </div>
  );
}
