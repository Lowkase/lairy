import { SelectMulti } from "../select-multi";
import { STAGE_OPTIONS } from "./options";

export function SelectMultiDemoExample() {
  return (
    <SelectMulti
      label="Stages"
      placeholder="Select stages"
      defaultValue={["normalize", "export"]}
      options={STAGE_OPTIONS}
    />
  );
}
