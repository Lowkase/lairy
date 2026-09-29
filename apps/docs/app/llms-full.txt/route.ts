import { NextResponse } from "next/server";
import { buildLlmsFull } from "@/lib/llms";

export function GET() {
  return new NextResponse(buildLlmsFull(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
