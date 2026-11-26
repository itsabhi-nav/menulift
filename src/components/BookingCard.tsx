"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getUtm, track } from "@/lib/track";
import type { Day } from "@/lib/slots";
import { useContent, useLocale, useT } from "@/components/I18n";

const field =
  "min-h-12 w-full rounded-xl border border-slate bg-white px-4 text-[16px] text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/40";

function cookie(name: string) {
  return document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1];
}

export function BookingCard({
  prefill,
}: {
  prefill?: { name?: string; phone?: string; score?: number; type?: string; missing?: string[] };
}) {
  const t = useT();
  const { site } = useContent();
  const locale = useLocale();
  const fmt = (date: string, o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", { ...o, timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
  const dayShort = (d: Day) => (d.short === "Today" || d.short === "Tomorrow" ? t(d.short) : fmt(d.date, { weekday: "short", day: "numeric", month: "short" }));
  const dayLong = (d: Day) => fmt(d.date, { weekday: "long", day: "numeric", month: "short" });
  const [days, setDays] = useState<Day[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [channel, setChannel] = useState<"Google Meet" | "WhatsApp call">("Google Meet");
  const [goLive, setGoLive] = useState("Within 2 weeks");
  const [budget, setBudget] = useState("Need the price first");
  const [name, setName] = useState(prefill?.name ?? "");
  const [phone, setPhone] = useState(prefill?.phone ?? "");
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState("");
  const [errs, setErrs] = useState<{ time?: string; name?: string; phone?: string }>({});
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [endVisible, setEndVisible] = useState(false);
  const endBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => setMounted(true), []);

  const [done, setDone] = useState<{ when: string; link: string } | null>(null);
  useEffect(() => {
    const el = endBtn.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setEndVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [done]);
  const picked = useRef({ date, time });
  picked.current = { date, time };

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/slots", { cache: "no-store" });
      const data = (await res.json()) as { days: Day[] };
      setDays(data.days);
      setLoadError(false);
      // the day we are looking at, or the first day that still has a free slot
      const cur = picked.current;
      const chosen = data.days.find((d) => d.date === cur.date);
      if (!chosen) {
        const first = data.days.find((d) => d.free > 0) ?? data.days[0];
        setDate(first?.date ?? null);
        setTime(first?.slots.find((x) => !x.booked)?.time ?? null);
      } else if (cur.time && chosen.slots.find((s) => s.time === cur.time)?.booked) {
        setTime(null);
        setNotice("That time was just booked by someone else. Please pick another.");
      }
    } catch {
      setLoadError(true);
    }
  }, []);

  // live availability: on load, every 8 seconds while the tab is open, and when you come back to it
  useEffect(() => {
    load();
    const id = setInterval(() => document.visibilityState === "visible" && load(), 8000);
    const onVis = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [load]);

  const day = useMemo(() => days?.find((d) => d.date === date), [days, date]);
  const noDays = !!days && days.length === 0;

  async function confirm() {
    const digits = phone.replace(/\D/g, "").slice(-10);
    const e: { time?: string; name?: string; phone?: string } = {};
    if (!date || !time || !day) e.time = "Please pick a time for your call.";
    if (name.trim().length < 2) e.name = "Please enter your name.";
    if (!digits) e.phone = "Please enter your WhatsApp number.";
    else if (!/^[6-9]\d{9}$/.test(digits)) e.phone = "Enter a valid 10-digit mobile number.";
    setErrs(e);
    if (e.time || e.name || e.phone || !day) {
      const first = e.time ? "bk-time" : e.name ? "bk-name" : "bk-phone";
      requestAnimationFrame(() => {
        const el = document.getElementById(first);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        if (first !== "bk-time") el?.querySelector("input")?.focus({ preventScroll: true });
      });
      return;
    }
    setError("");
    setNotice("");
    setBusy(true);
    const eventId = crypto.randomUUID();
    const slotLabel = day.slots.find((s) => s.time === time)?.label ?? time;
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          date,
          time,
          name,
          phone: digits,
          channel,
          goLive,
          budget,
          kitchen: prefill?.type,
          score: prefill?.score,
          utm: getUtm(),
          eventId,
          hp: website,
          fbp: cookie("_fbp"),
          fbc: cookie("_fbc"),
        }),
      });
      if (res.status === 409) {
        setTime(null);
        setNotice("Sorry, that time was just booked by someone else. Please pick another.");
        await load();
        return;
      }
      if (!res.ok) {
        setError(res.status === 429 ? "Too many tries. Please wait a minute." : "Something went wrong. Please try again or message us on WhatsApp.");
        return;
      }
      const utm = getUtm();
      const lines = [
        `Hi Menulift, I'd like to book my free call.`,
        `Slot: ${day.label}, ${slotLabel} IST (${channel})`,
        name && `Name: ${name}`,
        `WhatsApp: ${digits}`,
        prefill?.type && `Kitchen: ${prefill.type}`,
        prefill?.score !== undefined && `Readiness score: ${prefill.score}/100`,
        prefill?.missing?.length && `Missing: ${prefill.missing.join(", ")}`,
        `Target go-live: ${goLive}`,
        `Budget for help: ${budget}`,
        utm.utm_source && `Source: ${utm.utm_source}${utm.utm_campaign ? " / " + utm.utm_campaign : ""}`,
      ].filter(Boolean);
      const link = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
      track("booking_made", { eventId, slot: `${date} ${time}`, channel });
      setDone({ when: `${dayLong(day)}, ${slotLabel} IST`, link });
      window.open(link, "_blank", "noopener,noreferrer");
      load();
    } catch {
      setError("No connection. Please check your internet and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl bg-paper p-6 text-ink sm:p-8" role="status">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-live text-ink">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className="mt-5 font-display text-[28px] leading-tight">{t("Your slot is reserved.")}</h3>
        <p className="mt-3 text-[16px] leading-relaxed text-slate">
          <strong className="text-ink">{done.when}</strong>. We will message you on WhatsApp with the call link and details. You can also send us this message now, so we can confirm faster.
        </p>
        <a
          href={done.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-wa text-[17px] font-bold text-white"
        >
          {t("Send us a message on WhatsApp")}
        </a>
        <div className="mt-6 rounded-2xl bg-white p-5">
          <p className="font-semibold">{t("Keep these documents handy for the call")}</p>
          <ul className="mt-3 space-y-1.5 text-[15px] text-slate">
            <li>{t("FSSAI licence or registration")}</li>
            <li>{t("PAN card")}</li>
            <li>{t("Cancelled cheque or bank proof")}</li>
            <li>{t("Your menu with prices")}</li>
          </ul>
        </div>
      </div>
    );
  }

  const Step = ({ n, children }: { n: number; children: React.ReactNode }) => (
    <p className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-[12px] font-bold text-accent">{n}</span>
      {children}
    </p>
  );
  const bad = "border-danger-deep focus:border-danger-deep focus:ring-danger/30";

  return (
    <div className="relative rounded-[1.75rem] bg-paper p-4 pb-5 text-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)] sm:rounded-3xl sm:p-8">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <h3 className="font-display text-[22px] leading-tight sm:text-[26px]">{t("Free 20-minute call")}</h3>
          <p className="mt-0.5 text-[13px] text-slate sm:text-[14px]">{t("Each call takes 20 minutes. Times are in IST.")}</p>
        </div>
        <span className="rounded-full bg-ink px-3 py-1 text-[12px] font-bold text-live">{t("Free")}</span>
      </div>

      <div className="mt-5">
        <Step n={1}>{t("Pick a day")}</Step>
        <div className="mt-3 grid grid-cols-3 gap-2" role="tablist" aria-label={t("Choose a day")}>
          {!days && !loadError && (
            <div className="col-span-3 grid grid-cols-3 gap-2" aria-label={t("Checking free slots…")} aria-busy="true">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-[58px] animate-pulse rounded-2xl bg-line" />
              ))}
            </div>
          )}
          {days?.map((d) => (
            <button
              key={d.date}
              role="tab"
              aria-selected={d.date === date}
              type="button"
              onClick={() => {
                setDate(d.date);
                setTime(d.slots.find((x) => !x.booked)?.time ?? null);
                setNotice("");
              }}
              className={`flex min-h-[58px] flex-col items-center justify-center rounded-2xl border px-1 text-center transition-colors ${
                d.date === date ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink"
              }`}
            >
              <span className="text-[14px] font-bold leading-tight sm:text-[15px]">{dayShort(d)}</span>
              <span className={`mt-0.5 text-[12px] leading-tight ${d.date === date ? "text-paper/70" : "text-slate"}`}>{d.free} {t("free")}</span>
            </button>
          ))}
        </div>
        {loadError && (
          <p role="alert" className="mt-2 text-[14px] text-danger-deep">
            Could not load free slots. <button type="button" onClick={load} className="font-semibold underline">{t("Try again")}</button>
          </p>
        )}
      </div>

      <div className="mt-6" id="bk-time">
        <Step n={2}>{t("Pick a time")}</Step>
        {noDays ? (
          <p className="mt-3 rounded-xl bg-white p-4 text-[15px] leading-snug">
            No slots are open right now.{" "}
            <a className="font-semibold underline" href={`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent("Hi Menulift, I would like to book a call. When is a slot free?")}`}>
              {t("Message us on WhatsApp")}
            </a>
            .
          </p>
        ) : (
          <div className={`mt-3 grid grid-cols-3 gap-2 ${(day?.slots.length ?? 0) > 12 ? "max-h-[19rem] overflow-y-auto pr-1" : ""}`}>
            {(day?.slots ?? []).map((s) => (
              <button
                key={s.time}
                type="button"
                disabled={s.booked}
                aria-pressed={time === s.time}
                onClick={() => {
                  setTime(s.time);
                  setNotice("");
                  setErrs((x) => ({ ...x, time: undefined }));
                }}
                className={`flex min-h-12 flex-col items-center justify-center rounded-xl border text-[14px] font-semibold transition-colors sm:text-[15px] ${
                  s.booked
                    ? "cursor-not-allowed border-line bg-paper-2 text-slate"
                    : time === s.time
                      ? "border-accent bg-accent text-ink"
                      : "border-line bg-white hover:border-ink"
                }`}
              >
                <span className={s.booked ? "line-through" : ""}>{s.label.replace(" ", "\u00a0")}</span>
                {s.booked && <span className="text-[11px] font-medium">{t("Booked")}</span>}
              </button>
            ))}
          </div>
        )}
        {errs.time && <p role="alert" className="mt-2 text-[14px] font-semibold text-danger-deep">{t(errs.time)}</p>}
        {notice && (
          <p role="alert" className="mt-3 rounded-xl bg-[#fff4d6] p-3 text-[14px] font-medium text-ink">
            {notice}
          </p>
        )}
      </div>

      <fieldset className="mt-6">
        <legend className="w-full">
          <Step n={3}>{t("How should we call you?")}</Step>
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-full border border-line bg-white p-1">
          {(["Google Meet", "WhatsApp call"] as const).map((c) => (
            <label
              key={c}
              className={`flex min-h-11 cursor-pointer items-center justify-center rounded-full text-[14px] font-semibold transition-colors sm:text-[15px] ${
                channel === c ? "bg-ink text-paper" : "text-slate"
              }`}
            >
              <input type="radio" name="channel" className="sr-only" checked={channel === c} onChange={() => setChannel(c)} />
              {t(c)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <Step n={4}>{t("About you")}</Step>
        {(!prefill?.phone || !prefill?.name?.trim()) && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label id="bk-name" className="text-[14px] font-medium text-slate">
              {t("Your name")}
              <input
                className={`${field} mt-1.5 ${errs.name ? bad : ""}`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrs((x) => ({ ...x, name: undefined }));
                }}
                autoComplete="name"
                aria-invalid={!!errs.name}
              />
              {errs.name && <span role="alert" className="mt-1 block text-[13px] font-semibold text-danger-deep">{t(errs.name)}</span>}
            </label>
            <label id="bk-phone" className="text-[14px] font-medium text-slate">
              {t("WhatsApp number")}
              <input
                className={`${field} mt-1.5 ${errs.phone ? bad : ""}`}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrs((x) => ({ ...x, phone: undefined }));
                }}
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder={t("10-digit number")}
                aria-invalid={!!errs.phone}
              />
              {errs.phone && <span role="alert" className="mt-1 block text-[13px] font-semibold text-danger-deep">{t(errs.phone)}</span>}
            </label>
          </div>
        )}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-[14px] font-medium text-slate">
            {t("Target go-live date")}
            <span className="relative mt-1.5 block"><select className={`${field} appearance-none pl-3 pr-9 text-[15px]`} value={goLive} onChange={(e) => setGoLive(e.target.value)}>
              <option>{t("This week")}</option>
              <option>{t("Within 2 weeks")}</option>
              <option>{t("This month")}</option>
              <option>{t("Just exploring")}</option>
            </select><svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 9l6 6 6-6" /></svg></span>
          </label>
          <label className="text-[14px] font-medium text-slate">
            {t("Budgeted for onboarding help?")}
            <span className="relative mt-1.5 block"><select className={`${field} appearance-none pl-3 pr-9 text-[15px]`} value={budget} onChange={(e) => setBudget(e.target.value)}>
              <option>{t("Yes")}</option>
              <option>{t("Need the price first")}</option>
              <option>{t("Not yet")}</option>
            </select><svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 9l6 6 6-6" /></svg></span>
          </label>
        </div>
      </div>

      {/* hidden from people, filled in by bots */}
      <input
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        name="hp_note_x"
      />

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-danger/10 p-3 text-[14px] font-semibold text-danger-deep">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={confirm}
        disabled={busy}
        ref={endBtn}
        className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-ink text-[17px] font-bold text-paper transition-colors hover:bg-ink-2 disabled:opacity-60"
      >
        {busy ? (
          <>
            <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-paper/30 border-t-paper" aria-hidden />
            {t("Reserving your slot…")}
          </>
        ) : t("Book my free call")}
      </button>
      <p className="mt-3 text-center text-[13px] text-slate">
        {t("Free, no payment. We message you on WhatsApp to confirm.")}
      </p>

      {mounted &&
        createPortal(
      <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-line-dark bg-ink/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden ${endVisible ? "translate-y-full" : "translate-y-0"}`} aria-hidden={endVisible}>
        <div className="mx-auto flex max-w-[560px] items-center gap-3">
          <p className="min-w-0 flex-1 text-paper">
            <span className="block text-[12px] text-slate-light">{t("Your slot")}</span>
            <span className="block truncate text-[15px] font-semibold">
              {day && time ? `${dayShort(day)}, ${day.slots.find((x) => x.time === time)?.label}` : t("Pick a time")}
            </span>
          </p>
          <button
            type="button"
            onClick={confirm}
            disabled={busy}
            className="min-h-12 shrink-0 rounded-full bg-accent px-6 text-[16px] font-bold text-ink disabled:opacity-60"
          >
            {busy ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" aria-hidden />
                {t("Reserving…")}
              </>
            ) : t("Book my free call")}
          </button>
        </div>
      </div>
          ,
          document.body,
        )}
    </div>
  );
}
