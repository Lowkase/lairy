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
        <span className="rounded-ds border border-accent-line bg-accent-soft py-4 px-8 text-micro uppercase tracking-tight-6 text-accent">
          {STATUS_LABEL[status]}
        </span>
        <span className="rounded-ds border border-border py-4 px-8 text-micro text-mute">v{version}</span>
        <span className="text-micro text-faint">Updated {updated}</span>
      </div>
    </div>
  );
}
