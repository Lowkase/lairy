import { NextResponse } from "next/server";
import { listCompareEntries, readBaselineScreenshot, resolveCompareEntry } from "@/lib/screenshots";

// Dev-only (LDS-016, docs/build-guide.md §2): no static params and a 404 in
// production keep this out of production builds, same guard as the page
// that requests it (../../[entry]/page.tsx).
export function generateStaticParams() {
  if (process.env.NODE_ENV === "production") return [];
  return listCompareEntries().flatMap((entry) =>
    (["dark", "light"] as const).map((theme) => ({ entry: entry.id, theme })),
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ entry: string; theme: string }> },
) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { entry: id, theme } = await params;
  if (theme !== "dark" && theme !== "light") {
    return NextResponse.json({ error: `Unknown theme "${theme}".` }, { status: 404 });
  }

  const entry = resolveCompareEntry(id);
  if (!entry) {
    return NextResponse.json({ error: `Unknown entry "${id}".` }, { status: 404 });
  }

  const png = readBaselineScreenshot(entry, theme);
  return new NextResponse(new Uint8Array(png), {
    headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
  });
}
