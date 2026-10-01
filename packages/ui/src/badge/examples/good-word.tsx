import { Badge } from "../badge";

export function BadgeGoodWordExample() {
  return (
    <div className="flex items-baseline gap-12">
      <span className="text-body text-fg">Export queue</span>
      <Badge tone="info">SYNCED</Badge>
    </div>
  );
}
