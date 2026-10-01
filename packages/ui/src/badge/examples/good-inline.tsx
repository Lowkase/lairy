import { Badge } from "../badge";

export function BadgeGoodInlineExample() {
  return (
    <div className="flex items-baseline gap-12">
      <span className="text-body text-fg">Normalize step</span>
      <Badge tone="fail">FAILED</Badge>
    </div>
  );
}
