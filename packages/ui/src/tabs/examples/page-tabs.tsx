import { Tabs } from "../tabs";

export function TabsPageTabsExample() {
  return (
    <Tabs
      label="Fleet view"
      tabs={[
        { value: "map", label: "Map", panel: "The fleet plotted on the chart. Switching tabs changes only this panel." },
        { value: "table", label: "Table", panel: "Every vessel as a row, sortable by any column." },
        { value: "timeline", label: "Timeline", panel: "The same fleet read against the schedule instead of the chart." },
      ]}
      defaultValue="map"
    />
  );
}
