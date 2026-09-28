import { Callout } from "../callout";

export function CalloutSuccessExample() {
  return (
    <Callout
      tone="success"
      title="Console insight"
      actions={[{ label: "Review draft" }, { label: "Dismiss" }]}
    >
      All subsystems are within nominal bands. One agent draft is awaiting your review.
    </Callout>
  );
}
