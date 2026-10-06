import { TextInput } from "../../text-input/text-input";
import { Tooltip } from "../tooltip";

export function TooltipBadConstraintBehindTooltipExample() {
  return (
    <TextInput
      label={
        <span className="flex items-center gap-6">
          Retries
          <Tooltip content="Between 0 and 5">
            <button
              type="button"
              aria-label="Retries constraint"
              className="flex size-16 items-center justify-center rounded-full border border-border-2 text-micro text-mute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              ?
            </button>
          </Tooltip>
        </span>
      }
      defaultValue="2"
    />
  );
}
