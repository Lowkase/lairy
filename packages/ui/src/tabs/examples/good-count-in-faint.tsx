import { Tabs } from "../tabs";

export function TabsGoodCountInFaintExample() {
  return (
    <Tabs
      label="Alerts view"
      tabs={[
        { value: "alerts", label: "Alerts", count: 3, panel: "Three alerts raised since the last run." },
        { value: "history", label: "History", panel: "Every alert this object has ever raised." },
      ]}
      defaultValue="alerts"
    />
  );
}
