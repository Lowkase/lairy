import { Tabs } from "../tabs";

export function TabsGoodTitleStaysPutExample() {
  return (
    <div className="flex flex-col gap-8">
      <span className="font-heading text-small text-fg">Atlas rebalance</span>
      <Tabs
        label="Run readings"
        tabs={[
          { value: "logs", label: "Logs", panel: "The run's own log lines." },
          { value: "diff", label: "Diff", panel: "What this run changed." },
        ]}
        defaultValue="logs"
      />
    </div>
  );
}
