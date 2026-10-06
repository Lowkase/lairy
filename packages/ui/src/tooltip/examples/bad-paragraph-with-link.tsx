import { Button } from "../../button/button";
import { InlineIcon } from "../../icons";
import { Tooltip } from "../tooltip";

export function TooltipBadParagraphWithLinkExample() {
  return (
    <Tooltip
      content={
        <span className="flex flex-col gap-4">
          <span>Copies the definition and its schedule, but not its history. The copy starts paused.</span>
          <span className="text-accent">Read more</span>
        </span>
      }
    >
      <Button variant="ghost" icon={<InlineIcon name="spark" />} aria-label="Duplicate run" />
    </Tooltip>
  );
}
