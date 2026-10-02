import { Card } from "../card";

export function CardBadMixedkindsExample() {
  return (
    <div className="flex flex-col gap-12">
      <Card kind="with-header" title="Coverage">
        Eighteen of twenty-five documented.
      </Card>
      <Card kind="hud">Five releases this week.</Card>
    </div>
  );
}
