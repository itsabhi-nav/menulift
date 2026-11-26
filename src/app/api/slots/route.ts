import { NextResponse } from "next/server";
import { buildDays, istParts } from "@/lib/slots";
import { bookedKeysFrom, getSchedule } from "@/lib/store";

export async function GET() {
  const today = istParts(Date.now()).date;
  const days = buildDays(await bookedKeysFrom(today), await getSchedule());
  return NextResponse.json({ days }, { headers: { "cache-control": "no-store" } });
}
