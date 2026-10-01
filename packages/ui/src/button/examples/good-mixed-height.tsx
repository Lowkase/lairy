import { Button } from "../button";

export function ButtonGoodMixedHeightExample() {
  return (
    <div className="flex items-center gap-12">
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Discard</Button>
    </div>
  );
}
