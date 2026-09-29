import { NextResponse } from "next/server";
import { getRegistryItem, listRegistryItemNames } from "@/lib/registry";

export function generateStaticParams() {
  return listRegistryItemNames().map((name) => ({ name: `${name}.json` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const item = getRegistryItem(name.replace(/\.json$/, ""));
  if (!item) {
    return NextResponse.json({ error: `Unknown registry item "${name}".` }, { status: 404 });
  }
  return NextResponse.json(item);
}
