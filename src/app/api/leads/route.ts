import { NextResponse } from "next/server";
import { addLead, type Lead } from "@/lib/store";
import { cleanPhone, cleanText, cleanUtm, clientIp, newId, rateLimited, readJson, sameOrigin, sendMetaEvent } from "@/lib/server-utils";

/** Saves someone who finished the Readiness Check, so you can call them back. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (rateLimited(`lead:${clientIp(req)}`, 10)) {
    return NextResponse.json({ error: "too_many" }, { status: 429 });
  }
  const b = await readJson(req);
  if (!b || typeof b !== "object") return NextResponse.json({ error: "bad_request" }, { status: 400 });
  if (b.hp) return NextResponse.json({ ok: true });
  const phone = cleanPhone(b.phone);
  if (!phone) return NextResponse.json({ error: "bad_phone" }, { status: 400 });

  const id = cleanText(b.eventId, 64) || newId();
  const lead: Lead = {
    id,
    type: b.kind === "partner" ? "partner" : "quiz",
    createdAt: new Date().toISOString(),
    name: cleanText(b.name, 80),
    phone,
    status: "new",
    note: "",
    kitchen: cleanText(b.kitchen, 40),
    score: typeof b.score === "number" ? Math.max(0, Math.min(100, Math.round(b.score))) : undefined,
    missing: Array.isArray(b.missing) ? b.missing.slice(0, 12).map((m: unknown) => cleanText(m, 80)) : [],
    source: b.kind === "partner" ? "partner-page" : "readiness-check",
    utm: cleanUtm(b.utm),
  };
  await addLead(lead);
  if (lead.type === "quiz") void sendMetaEvent({
    event: "Lead",
    eventId: id,
    phone,
    url: req.headers.get("referer") ?? undefined,
    req,
    fbp: cleanText(b.fbp, 80) || undefined,
    fbc: cleanText(b.fbc, 120) || undefined,
  });
  return NextResponse.json({ ok: true, id });
}
