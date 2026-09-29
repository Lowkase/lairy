import { NextResponse } from "next/server";
import { buildLlmsIndex } from "@/lib/llms";

export function GET() {
  return new NextResponse(buildLlmsIndex(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
