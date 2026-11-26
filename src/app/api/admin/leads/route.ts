import { NextResponse } from "next/server";
import { counts, listLeads, upcomingBookings, type LeadStatus, type LeadType } from "@/lib/store";
import { istParts } from "@/lib/slots";
import { isAdminCookie } from "@/lib/server-utils";

const PAGE = 40;
const STATUSES = ["new", "contacted", "showed", "paid", "closed", "cancelled"] as const;

/** One call returns the list for the current filters plus the numbers shown in the stat cards. */
export async function GET(req: Request) {
  const cookie = req.headers.get("cookie")?.match(/ml_admin=([^;]+)/)?.[1];
  if (!isAdminCookie(cookie)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  const sp = new URL(req.url).searchParams;
  const type = sp.get("type");
  const status = sp.get("status");
  const t = type === "booking" || type === "quiz" || type === "partner" ? (type as LeadType) : undefined;
  const st = STATUSES.find((x) => x === status) as LeadStatus | undefined;
  const page = Math.max(1, Number(sp.get("page")) || 1);
  const q = (sp.get("q") ?? "").slice(0, 60);
  const [{ rows, total }, upcoming, c, fresh] = await Promise.all([
    listLeads({ type: t, status: st, q, limit: PAGE, offset: (page - 1) * PAGE }),
    upcomingBookings(istParts(Date.now()).date),
    counts(),
    listLeads({ status: "new", limit: 1, offset: 0 }),
  ]);
  return NextResponse.json({ rows, total, page, upcoming, counts: c, newCount: fresh.total });
}
