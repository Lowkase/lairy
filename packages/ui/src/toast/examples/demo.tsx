"use client";

import { Button } from "../../button/button";
import { Toaster, toast, type ToastIntent } from "../toast";

const KINDS: Array<{ intent: ToastIntent; label: string; title: string; detail: string }> = [
  { intent: "success", label: "Success", title: "Workflow approved", detail: "Export resumed · 7 queued items cleared" },
  { intent: "fail", label: "Fail", title: "Run failed", detail: "Normalize step timed out after 30s" },
  { intent: "info", label: "Info", title: "Sync scheduled", detail: "Next integrity sweep starts at 15:00" },
  { intent: "neutral", label: "Neutral", title: "Draft saved", detail: "No checks were run on this change" },
];

/** Live: fire one of the four intents. The stack docks top right under the
 * header, so the docs page needs a `<Toaster />` somewhere — this example
 * brings its own. */
export function ToastDemoExample() {
  return (
    <div className="flex flex-wrap gap-12">
      {KINDS.map(({ intent, label, title, detail }) => (
        <Button key={intent} variant="secondary" onClick={() => toast({ intent, title, detail })}>
          {label}
        </Button>
      ))}
      <Toaster />
    </div>
  );
}
