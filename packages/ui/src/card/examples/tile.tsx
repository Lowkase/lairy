import { Card } from "../card";

export function CardTileExample() {
  return (
    <Card kind="tile">
      <div className="font-heading font-semibold text-small text-fg">Interactive tile</div>
      <div className="mt-4 text-small text-dim">Hover me</div>
    </Card>
  );
}
