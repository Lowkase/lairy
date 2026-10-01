import { Button } from "../button";

export function ButtonGoodOnePrimaryExample() {
  return (
    <div className="flex items-center gap-12">
      <Button variant="primary">Run pipeline</Button>
      <Button variant="ghost">Cancel</Button>
    </div>
  );
}
