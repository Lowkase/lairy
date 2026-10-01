import { Button } from "../button";

export function ButtonBadResizedExample() {
  return (
    <div className="flex items-center gap-12">
      <Button variant="primary" className="px-22 py-12 text-body">
        Save
      </Button>
      <Button variant="secondary" className="px-12 py-6 text-micro">
        Discard
      </Button>
    </div>
  );
}
