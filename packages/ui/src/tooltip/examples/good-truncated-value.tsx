import { Tooltip } from "../tooltip";

export function TooltipGoodTruncatedValueExample() {
  return (
    <Tooltip content="nightly-ingest-eu-west-1">
      <span className="flex truncate text-small text-fg" style={{ width: 132 }} tabIndex={0}>
        nightly-ingest-eu-west-1
      </span>
    </Tooltip>
  );
}
