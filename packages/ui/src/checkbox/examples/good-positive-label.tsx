import { Checkbox } from "../checkbox";

export function CheckboxGoodPositiveLabelExample() {
  return (
    <div className="flex flex-col gap-4">
      <Checkbox label="Include archived runs" defaultChecked />
      <Checkbox label="Include draft runs" />
    </div>
  );
}
