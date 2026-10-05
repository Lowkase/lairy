import { listComponents } from "@lairy/content";
import { Shell } from "@/components/shell";
import { shellMainRailItems, shellSectionMeta, shellSubnavGroup } from "@/lib/shell-nav";
import Link from "next/link";

export default function ComponentsIndexPage() {
  const entries = listComponents();
  const meta = shellSectionMeta("components");
  return (
    <Shell
      section="components"
      moduleIcon={meta.icon}
      moduleLabel={meta.label}
      moduleCode={meta.code}
      items={shellMainRailItems()}
      group={shellSubnavGroup("components")}
    >
      <div className="flex flex-col gap-32">
        <h1 className="font-heading text-doc-title font-semibold tracking-tight-neg-2 text-fg">Components</h1>
        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
          {entries.map((entry) => (
            <Link
              key={entry.meta.id}
              href={`/components/${entry.meta.id}`}
              className="flex flex-col gap-8 rounded-ds border border-border bg-panel p-16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <span className="text-small text-fg">{entry.meta.name}</span>
              <span className="text-small text-mute">{entry.purpose}</span>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
