import { listFoundations } from "@lairy/content";
import { Shell } from "@/components/shell";
import { shellMainRailItems, shellSectionMeta, shellSubnavGroup } from "@/lib/shell-nav";
import Link from "next/link";

export default function FoundationsIndexPage() {
  const entries = listFoundations();
  const meta = shellSectionMeta("foundations");
  return (
    <Shell
      section="foundations"
      moduleIcon={meta.icon}
      moduleLabel={meta.label}
      moduleCode={meta.code}
      items={shellMainRailItems()}
      group={shellSubnavGroup("foundations")}
    >
      <div className="flex flex-col gap-32">
        <h1 className="font-heading text-doc-title font-semibold tracking-tight-neg-2 text-fg">
          Foundations
        </h1>
        <div className="grid grid-cols-1 gap-16 tablet:grid-cols-2">
          {entries.map((entry) => (
            <Link
              key={entry.meta.id}
              href={`/foundations/${entry.meta.id}`}
              className="flex flex-col gap-8 rounded-ds border border-border bg-panel p-16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <span className="text-small text-fg">{entry.meta.name}</span>
              <span className="text-small text-mute">{entry.description.summary}</span>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
