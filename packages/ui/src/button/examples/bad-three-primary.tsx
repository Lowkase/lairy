import { Button } from "../button";

export function ButtonBadThreePrimaryExample() {
  return (
    <div className="flex flex-wrap items-center gap-12">
      <Button variant="primary">Run pipeline</Button>
      <Button variant="primary">Save draft</Button>
      <Button variant="primary">Export</Button>
    </div>
  );
}
