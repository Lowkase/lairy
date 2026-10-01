import { listCompareEntries, resolveCompareEntry } from "@/lib/screenshots";
import { notFound } from "next/navigation";
import { CompareView } from "./compare-view";

// Dev-only (LDS-016, docs/build-guide.md §2): no static params and a 404 in
// production keep this reviewer tool, and the baseline PNGs it serves, out
// of production builds.
export function generateStaticParams() {
  if (process.env.NODE_ENV === "production") return [];
  return listCompareEntries().map((entry) => ({ entry: entry.id }));
}

export default async function ComparePage({ params }: { params: Promise<{ entry: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();

  const { entry: id } = await params;
  const entry = resolveCompareEntry(id);
  if (!entry) notFound();

  const livePath = entry.kind === "component" ? `/components/${entry.id}` : `/foundations/${entry.id}`;

  return <CompareView entryId={entry.id} entryName={entry.name} livePath={livePath} />;
}
