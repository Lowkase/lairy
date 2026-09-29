import { NextResponse } from "next/server";
import { getRegistryIndex } from "@/lib/registry";

export function GET() {
  return NextResponse.json(getRegistryIndex());
}
