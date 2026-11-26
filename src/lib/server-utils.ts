import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const newId = () => randomUUID();

export function cleanPhone(v: unknown) {
  const d = String(v ?? "").replace(/\D/g, "").slice(-10);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export function cleanText(v: unknown, max = 120) {
  return String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);
}

export function cleanUtm(v: unknown) {
  const out: Record<string, string> = {};
  if (v && typeof v === "object") {
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const x = (v as Record<string, unknown>)[k];
      if (typeof x === "string") out[k] = x.slice(0, 80);
    }
  }
  return out;
}

const hits = new Map<string, number[]>();
/** At most `limit` requests per minute from one address. */
export function rateLimited(key: string, limit = 12) {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [hitKey, timestamps] of hits) {
      if (!timestamps.some((timestamp) => now - timestamp < 60000)) hits.delete(hitKey);
    }
  }
  const arr = (hits.get(key) ?? []).filter((t) => now - t < 60000);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > limit;
}

export function clientIp(req: Request) {
  const trusted =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("fly-client-ip") ||
    req.headers.get("true-client-ip") ||
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip");
  const value = trusted?.trim();
  return value && value.length <= 45 && /^[a-zA-Z0-9:.]+$/.test(value) ? value : "local";
}

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

const SESSION_DAYS = 7;
const safeEqual = (a: string, b: string) => {
  const x = createHmac("sha256", "cmp").update(a).digest();
  const y = createHmac("sha256", "cmp").update(b).digest();
  return timingSafeEqual(x, y);
};
/** The admin password. When none is set, `npm run dev` falls back to "menulift-local" so a fresh copy just works; a live build never does. */
export const adminPassword = () => process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "menulift-local" : "");
const sessionKey = () => {
  const pw = adminPassword();
  return pw ? sha(`${process.env.ADMIN_SECRET ?? ""}|${pw}|menulift-admin`) : null;
};

/** True when the typed password is the real one. Compares in constant time. */
export function passwordMatches(typed: string) {
  const pw = adminPassword();
  return !!pw && safeEqual(typed, pw);
}

/** On the live site (not on your own computer or Wi-Fi), an easy admin password keeps the admin locked. */
export function passwordTooWeak(req: Request) {
  if (process.env.NODE_ENV !== "production") return false;
  const pw = adminPassword();
  return pw.length < 10 || /^menulift-local$|^password|^admin|^12345|^qwerty/i.test(pw);
}

/** The sign-in cookie: an expiry time plus a signature, so it stops working on its own after a week. */
export function makeAdminCookie() {
  const key = sessionKey();
  if (!key) return null;
  const exp = String(Date.now() + SESSION_DAYS * 86400000);
  return { value: `${exp}.${createHmac("sha256", key).update(exp).digest("hex")}`, maxAge: SESSION_DAYS * 86400 };
}

export function isAdminCookie(value: string | undefined) {
  const key = sessionKey();
  if (!key || !value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  return safeEqual(sig, createHmac("sha256", key).update(exp).digest("hex"));
}

/** Blocks a request that was sent from another website (a browser always says where a POST came from). */
export function sameOrigin(req: Request) {
  const o = req.headers.get("origin");
  if (!o) return req.method === "GET" || req.method === "HEAD";
  try {
    const originHost = new URL(o).host;
    const configured = process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host
      : new URL(req.url).host;
    const requestHost = new URL(req.url).host;
    return originHost === configured || (process.env.NODE_ENV !== "production" && originHost === requestHost);
  } catch {
    return false;
  }
}

/** Reads a small JSON body. Anything bigger than 20 KB or not JSON gives null. */
export async function readJson(req: Request, max = 20000): Promise<Record<string, unknown> | null> {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > max) return null;
  const text = await req.text().catch(() => "");
  if (!text || text.length > max) return null;
  try {
    const v = JSON.parse(text);
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Sends a server-side event to Meta (Conversions API). Does nothing until the env values are set. */
export async function sendMetaEvent(opts: {
  event: "Lead" | "Schedule";
  eventId: string;
  phone: string;
  url?: string;
  req: Request;
  fbp?: string;
  fbc?: string;
}) {
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixel || !token) return;
  try {
    await fetch(`https://graph.facebook.com/v21.0/${pixel}/events?access_token=${token}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: opts.event,
            event_time: Math.floor(Date.now() / 1000),
            event_id: opts.eventId,
            action_source: "website",
            event_source_url: opts.url,
            user_data: {
              ph: [sha(`91${opts.phone}`)],
              client_ip_address: clientIp(opts.req),
              client_user_agent: opts.req.headers.get("user-agent") ?? undefined,
              fbp: opts.fbp,
              fbc: opts.fbc,
            },
          },
        ],
        ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
      }),
    });
  } catch {
    /* tracking must never break a booking */
  }
}
