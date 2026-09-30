import type { Status } from "@lairy/content";

const STATUS_LABEL: Record<Status, string> = {
  draft: "Draft",
  stable: "Stable",
  locked: "Locked",
  deprecated: "Deprecated",
};

export function PageHeader({
  title,
  status,
  version,
  updated,
}: {
  title: string;
  status: Status;
  version: string;
  updated: string;
}) {
  return (
    <div className="flex flex-col gap-12">
      <h1 className="font-heading font-semibold text-doc-title tracking-tight-neg-2 text-fg">{title}</h1>
      <div className="flex items-center gap-12">
        {/* text-fg, not text-accent: --accent on --accent-soft at Micro size
            only clears 4.06:1 in the light theme (measured via axe), short
            of the 4.5:1 AA floor for normal text — amber stays as the
            border/fill (a 3:1 threshold for non-text UI), the label itself
            reads in the always-safe text rank instead. */}
        <span className="rounded-ds border border-accent-line bg-accent-soft py-4 px-8 text-micro uppercase tracking-tight-6 text-fg">
          {STATUS_LABEL[status]}
        </span>
        <span className="rounded-ds border border-border py-4 px-8 text-micro text-mute">v{version}</span>
        {/* text-mute, not text-faint: --faint only clears "AA large" (3.69:1
            in the light theme), never the 4.5:1 floor normal-size text
            needs — legal for a single-word caption, not for this sentence. */}
        <span className="text-micro text-mute">Updated {updated}</span>
      </div>
    </div>
  );
}
