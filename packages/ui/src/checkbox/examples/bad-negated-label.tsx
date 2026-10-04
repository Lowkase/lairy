import { Checkbox } from "../checkbox";

export function CheckboxBadNegatedLabelExample() {
  return (
    <div className="flex flex-col gap-4">
      <Checkbox label="Include archived runs" defaultChecked />
      <Checkbox label="Do not include draft runs" />
    </div>
  );
}
