import { NextResponse } from "next/server";
import { buildDays, istParts } from "@/lib/slots";
import { bookedKeysFrom, getSchedule, tryBook, type Lead } from "@/lib/store";
import { cleanPhone, cleanText, cleanUtm, clientIp, newId, rateLimited, readJson, sameOrigin, sendMetaEvent } from "@/lib/server-utils";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (rateLimited(`book:${clientIp(req)}`, 8)) {
    return NextResponse.json({ error: "too_many" }, { status: 429 });
  }
  const b = await readJson(req);
  if (!b || typeof b !== "object") return NextResponse.json({ error: "bad_request" }, { status: 400 });
  if (b.hp) return NextResponse.json({ ok: true }); // honeypot: bots fill this

  if (cleanText(b.name, 80).length < 2) return NextResponse.json({ error: "bad_name" }, { status: 400 });
  const phone = cleanPhone(b.phone);
  if (!phone) return NextResponse.json({ error: "bad_phone" }, { status: 400 });
  const date = cleanText(b.date, 10);
  const time = cleanText(b.time, 5);

  const out: { result: "ok" | "taken" | "invalid" } = { result: "invalid" };
  const id = cleanText(b.eventId, 64) || newId();
  const lead: Lead = {
    id,
    type: "booking",
    createdAt: new Date().toISOString(),
    name: cleanText(b.name, 80),
    phone,
    status: "new",
    note: "",
    slot: { date, time },
    channel: cleanText(b.channel, 20),
    goLive: cleanText(b.goLive, 40),
    budget: cleanText(b.budget, 40),
    kitchen: cleanText(b.kitchen, 40),
    score: typeof b.score === "number" ? Math.max(0, Math.min(100, Math.round(b.score))) : undefined,
    source: "booking",
    utm: cleanUtm(b.utm),
  };

  const today = istParts(Date.now()).date;
  const offered = buildDays(await bookedKeysFrom(today), await getSchedule())
    .find((d) => d.date === date)
    ?.slots.find((s) => s.time === time);
  if (!offered || offered.booked) {
    out.result = offered ? "taken" : "invalid";
  } else {
    // the unique index on (date, time) settles any last-second race
    out.result = (await tryBook(lead)) ? "ok" : "taken";
  }

  if (out.result === "taken") return NextResponse.json({ error: "slot_taken" }, { status: 409 });
  if (out.result !== "ok") return NextResponse.json({ error: "slot_invalid" }, { status: 400 });

  void sendMetaEvent({
    event: "Schedule",
    eventId: id,
    phone,
    url: req.headers.get("referer") ?? undefined,
    req,
    fbp: cleanText(b.fbp, 80) || undefined,
    fbc: cleanText(b.fbc, 120) || undefined,
  });
  return NextResponse.json({ ok: true, id });
}
