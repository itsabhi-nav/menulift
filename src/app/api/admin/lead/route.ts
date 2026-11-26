import { NextResponse } from "next/server";
import { updateLead, type LeadStatus } from "@/lib/store";
import { cleanText, isAdminCookie, readJson, sameOrigin } from "@/lib/server-utils";

const STATUSES: LeadStatus[] = ["new", "contacted", "showed", "paid", "closed", "cancelled"];

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const cookie = req.headers.get("cookie")?.match(/ml_admin=([^;]+)/)?.[1];
  if (!isAdminCookie(cookie)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  const b = await readJson(req);
  if (!b) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const id = typeof b?.id === "string" ? cleanText(b.id, 64) : "";
  if (!/^[A-Za-z0-9_-]+$/.test(id)) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  await updateLead(id, {
    status: STATUSES.includes(b.status as LeadStatus) ? (b.status as LeadStatus) : undefined,
    note: typeof b.note === "string" ? cleanText(b.note, 500) : undefined,
  });
  return NextResponse.json({ ok: true });
}
