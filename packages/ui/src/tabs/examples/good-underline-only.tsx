import { Tabs } from "../tabs";

export function TabsGoodUnderlineOnlyExample() {
  return (
    <Tabs
      label="Fleet view"
      tabs={[
        { value: "map", label: "Map", panel: "The fleet plotted on the chart." },
        { value: "table", label: "Table", panel: "Every vessel as a row." },
        { value: "timeline", label: "Timeline", panel: "The same fleet against the schedule." },
      ]}
      defaultValue="map"
    />
  );
}
