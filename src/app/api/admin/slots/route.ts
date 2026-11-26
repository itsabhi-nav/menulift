import { NextResponse } from "next/server";
import { getSchedule, saveSchedule } from "@/lib/store";
import { istParts } from "@/lib/slots";
import { isAdminCookie, readJson, sameOrigin } from "@/lib/server-utils";

function authed(req: Request) {
  return isAdminCookie(req.headers.get("cookie")?.match(/ml_admin=([^;]+)/)?.[1]);
}

export async function GET(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  return NextResponse.json(await getSchedule());
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!authed(req)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  const b = await readJson(req, 60000);
  if (!b || typeof b !== "object") return NextResponse.json({ error: "bad_request" }, { status: 400 });
  // dates that have already passed are dropped so the list stays short
  const today = istParts(Date.now()).date;
  const overrides = Object.fromEntries(Object.entries((b.overrides ?? {}) as Record<string, string[]>).filter(([d]) => d >= today));
  const saved = await saveSchedule({ ...b, overrides });
  return NextResponse.json(saved);
}
