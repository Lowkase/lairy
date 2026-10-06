import { Button } from "../../button/button";
import { InlineIcon } from "../../icons";
import { Tooltip } from "../tooltip";

export function TooltipGoodNameAndShortcutExample() {
  return (
    <Tooltip content="Duplicate run · D">
      <Button variant="ghost" icon={<InlineIcon name="spark" />} aria-label="Duplicate run" />
    </Tooltip>
  );
}
