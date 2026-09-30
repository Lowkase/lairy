"use client";

import { useState, type ReactNode } from "react";

/** Re-mounts its children on a fresh React key so a one-shot entrance
 * animation (which only plays once per element lifetime) can be replayed on
 * demand — the loops (pulse, breathe, shimmer, sweepline) run continuously
 * and don't need this. Takes plain children (not a render prop) so the
 * calling page can stay a server component — a function can't cross the
 * server/client boundary as a prop. */
export function ReplayDemo({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(0);
  return (
    <div className="flex items-center gap-16">
      <div key={run} className="flex h-44 w-full items-center justify-center overflow-hidden rounded-ds border border-border bg-panel">
        {children}
      </div>
      <button
        type="button"
        onClick={() => setRun((n) => n + 1)}
        className="shrink-0 rounded-ds border border-border-2 px-12 py-6 text-label uppercase tracking-tight-6 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        Replay
      </button>
    </div>
  );
}
