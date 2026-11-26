import { NextResponse } from "next/server";
import { iterateLeads, type Lead } from "@/lib/store";
import { isAdminCookie } from "@/lib/server-utils";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ist = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

/** Every enquiry received between two dates (IST, both included). No dates means all time. */
export async function GET(req: Request) {
  const cookie = req.headers.get("cookie")?.match(/ml_admin=([^;]+)/)?.[1];
  if (!isAdminCookie(cookie)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  const sp = new URL(req.url).searchParams;
  const from = DATE.test(sp.get("from") ?? "") ? sp.get("from")! : "";
  const to = DATE.test(sp.get("to") ?? "") ? sp.get("to")! : "";
  const rows: Lead[] = [];
  for await (const l of iterateLeads()) {
    const d = ist(l.createdAt);
    if ((from && d < from) || (to && d > to)) continue;
    rows.push(l);
    if (rows.length >= 5000) break;
  }
  return NextResponse.json({ rows, capped: rows.length >= 5000 });
}
