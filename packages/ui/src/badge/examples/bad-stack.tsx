import { Badge } from "../badge";

export function BadgeBadStackExample() {
  return (
    <div className="flex flex-wrap items-baseline gap-8">
      <span className="text-body text-fg">Normalize step</span>
      <Badge tone="fail">FAILED</Badge>
      <Badge tone="neutral">RETRY 3</Badge>
      <Badge tone="info">QUEUED</Badge>
    </div>
  );
}
