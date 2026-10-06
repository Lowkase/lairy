import { Button } from "../../button/button";
import { InlineIcon } from "../../icons";
import { Tooltip } from "../tooltip";

export function TooltipBadAlreadyLabelledExample() {
  return (
    <Tooltip content="Run now">
      <Button variant="secondary" icon={<InlineIcon name="arrow" />}>
        Run now
      </Button>
    </Tooltip>
  );
}
