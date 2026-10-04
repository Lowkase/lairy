import { Tabs } from "../tabs";

/**
 * Panel tabs, scoped to one card's header rail rather than the whole page
 * (Placements "Panel tabs") — the border wrapper stands in for the card
 * this would normally sit inside (Related "Cards").
 */
export function TabsPanelTabsExample() {
  return (
    <div className="inline-flex flex-col gap-8 border border-border p-16">
      <span className="font-heading text-small text-fg">Atlas rebalance</span>
      <Tabs
        label="Run readings"
        tabs={[
          { value: "logs", label: "Logs", panel: "The run's own log lines, newest last." },
          { value: "diff", label: "Diff", panel: "What this run changed, read against the previous one." },
        ]}
        defaultValue="logs"
      />
    </div>
  );
}
