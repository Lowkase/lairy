import { NextResponse } from "next/server";
import { getRegistryIndex } from "@/lib/registry";

// Read once at build, where the whole repo is on disk, and served as a static
// file (Vercel ships no repo to a function, LDS-159).
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(getRegistryIndex());
}
