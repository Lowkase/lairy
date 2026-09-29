import { Callout } from "../callout";

export function CalloutBadTitleExample() {
  return (
    <Callout tone="error" title="Uh oh, something broke!" actions={[{ label: "Retry export" }]}>
      The export thing didn&rsquo;t work, sorry about that.
    </Callout>
  );
}
