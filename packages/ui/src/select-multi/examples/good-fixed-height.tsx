import { popover } from "@lairy/tokens";
import { SelectMulti } from "../select-multi";
import { STAGE_OPTIONS } from "./options";

/** Four picks in a field too narrow for them: the height holds and the
 * tokens that no longer fit collapse into a counted overflow chip. */
export function SelectMultiGoodFixedHeightExample() {
  return (
    <div style={{ width: popover.panelWidth }}>
      <SelectMulti
        label="Stages"
        defaultValue={["ingest", "normalize", "summarize", "export"]}
        options={STAGE_OPTIONS}
      />
    </div>
  );
}
