import { NextResponse } from "next/server";
import { buildLlmsFull } from "@/lib/llms";

// Read once at build, where the whole repo is on disk, and served as a static
// file (Vercel ships no repo to a function, LDS-159).
export const dynamic = "force-static";

export function GET() {
  return new NextResponse(buildLlmsFull(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
