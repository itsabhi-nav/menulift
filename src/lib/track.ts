/** Sends events to GA4 (gtag), Meta Pixel and the data layer. Safe to call anywhere on the client. */
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/** Remember where the visitor came from, once per visit. */
export function captureUtm() {
  if (typeof window === "undefined") return;
  try {
    const q = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    KEYS.forEach((k) => {
      const v = q.get(k);
      if (v) found[k] = v;
    });
    if (Object.keys(found).length) sessionStorage.setItem("ml_utm", JSON.stringify(found));
  } catch {}
}

export function getUtm(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem("ml_utm") || "{}");
  } catch {
    return {};
  }
}

/** Meta standard events for the two that matter. Sent with the same id the server uses, so Meta counts each once. */
const META_STANDARD: Record<string, string> = { booking_made: "Schedule", check_completed: "Lead" };

export function track(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const { eventId, ...rest } = data;
  const payload = { ...getUtm(), ...rest };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
  window.gtag?.("event", event, payload);

  const std = META_STANDARD[event];
  if (std) window.fbq?.("track", std, {}, eventId ? { eventID: eventId } : undefined);
  else window.fbq?.("trackCustom", event, payload);

  // Google Ads conversion for a booked call
  const ads = process.env.NEXT_PUBLIC_GADS_ID;
  const label = process.env.NEXT_PUBLIC_GADS_BOOKING_LABEL;
  if (event === "booking_made" && ads && label) window.gtag?.("event", "conversion", { send_to: `${ads}/${label}` });
}
