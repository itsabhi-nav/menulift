"use client";

import { useEffect, useMemo, useState } from "react";
import { buildDays, rangeTimes, timeLabel, toTime, type Schedule } from "@/lib/slots";
import { AdminShell } from "./AdminShell";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday first
const LENGTHS = [15, 20, 30, 45, 60];
const NOTICE = [
  [0, "No notice needed"],
  [30, "30 minutes before"],
  [60, "1 hour before"],
  [120, "2 hours before"],
  [180, "3 hours before"],
  [360, "6 hours before"],
] as const;

type Hours = { open: boolean; from: string; to: string };

const mins = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const DEFAULT: Hours = { open: true, from: "18:30", to: "21:00" };
const inp = "min-h-11 w-full rounded-xl border border-slate bg-white px-3 text-[15px] outline-none focus:border-ink focus:ring-2 focus:ring-accent/40";

/** A list of start times becomes "from, to" again, so the admin only deals with hours. */
function toHours(times: string[], len: number): Hours {
  if (!times.length) return { ...DEFAULT, open: false };
  return { open: true, from: times[0], to: toTime(mins(times[times.length - 1]) + len) };
}
const calls = (h: Hours, len: number) => (h.open && h.from && h.to ? rangeTimes(mins(h.from), mins(h.to), len, 0) : []);

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-ink" : "bg-slate/40"}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

function Row({ title, h, len, onChange, onRemove }: { title: string; h: Hours; len: number; onChange: (h: Hours) => void; onRemove?: () => void }) {
  const [edit, setEdit] = useState(false);
  const n = calls(h, len).length;
  const bad = h.open && n === 0;
  const show = h.open && (edit || bad);
  const range = h.from && h.to ? `${timeLabel(mins(h.from))} to ${timeLabel(mins(h.to))}` : "Set the hours";
  return (
    <div className={`rounded-2xl border bg-white ${bad ? "border-danger" : "border-line"}`}>
      <div className="flex items-center gap-3 p-3.5">
        <Switch
          on={h.open}
          onChange={(open) => {
            onChange({ ...h, open });
            setEdit(open);
          }}
          label={`${title} open`}
        />
        {/* the whole name area opens the hours, so it is an easy tap on a phone */}
        <button
          type="button"
          disabled={!h.open}
          onClick={() => setEdit(!show)}
          aria-expanded={show}
          className="min-w-0 flex-1 rounded-lg py-1 text-left disabled:cursor-default"
        >
          <span className="block truncate text-[16px] font-semibold">{title}</span>
          <span className={`block truncate text-[13px] ${bad ? "font-semibold text-danger-deep" : "text-slate"}`}>
            {!h.open ? "Closed" : bad ? "Hours too short for one call" : `${range} · ${n} ${n === 1 ? "call" : "calls"}`}
          </span>
        </button>
        {h.open && (
          <button
            type="button"
            onClick={() => setEdit(!show)}
            aria-label={show ? "Hide hours" : "Change hours"}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate hover:bg-paper-2 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-transform ${show ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        )}
        {onRemove && (
          <button type="button" onClick={onRemove} aria-label={`Remove ${title}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[22px] text-slate hover:bg-paper-2 hover:text-ink">
            ×
          </button>
        )}
      </div>
      {show && (
        <div className="grid grid-cols-2 gap-3 border-t border-line p-3.5">
          <label className="text-[13px] font-medium text-slate">
            First call at
            <input type="time" step={300} value={h.from} onChange={(e) => onChange({ ...h, from: e.target.value })} className={`${inp} mt-1`} />
          </label>
          <label className="text-[13px] font-medium text-slate">
            Last call ends at
            <input type="time" step={300} value={h.to} onChange={(e) => onChange({ ...h, to: e.target.value })} className={`${inp} mt-1`} />
          </label>
        </div>
      )}
    </div>
  );
}

export function AdminSlots({ initial }: { initial: Schedule }) {
  const [len, setLen] = useState(() => {
    const t = initial.week.find((w) => w.length > 1);
    const d = t ? mins(t[1]) - mins(t[0]) : 20;
    return LENGTHS.includes(d) ? d : 20;
  });
  const [week, setWeek] = useState<Hours[]>(() => initial.week.map((t) => toHours(t, len)));
  const [over, setOver] = useState<Record<string, Hours>>(() => Object.fromEntries(Object.entries(initial.overrides).map(([d, t]) => [d, toHours(t, len)])));
  const [daysShown, setDaysShown] = useState(initial.daysShown);
  const [notice, setNotice] = useState(initial.minLeadMinutes);
  const [newDate, setNewDate] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(JSON.stringify(initial));

  const schedule: Schedule = useMemo(
    () => ({
      week: week.map((h) => calls(h, len)),
      overrides: Object.fromEntries(Object.entries(over).map(([d, h]) => [d, calls(h, len)])),
      daysShown,
      minLeadMinutes: notice,
    }),
    [week, over, len, daysShown, notice],
  );
  const dirty = JSON.stringify(schedule) !== saved;
  const invalid = week.some((h) => h.open && !calls(h, len).length) || Object.values(over).some((h) => h.open && !calls(h, len).length);
  const next = useMemo(() => buildDays(new Set(), schedule).slice(0, 4), [schedule]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setDay = (d: number, h: Hours) => setWeek((w) => w.map((x, i) => (i === d ? h : x)));
  const copyMonday = () => setWeek((w) => w.map((x, i) => (i === 1 || !x.open ? x : { ...x, from: w[1].from, to: w[1].to })));
  const dates = Object.keys(over).sort();
  const longDate = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

  async function save() {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/slots", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(schedule) });
    setBusy(false);
    if (res.ok) {
      const out = (await res.json()) as Schedule;
      setSaved(JSON.stringify(out));
      setOver((o) => Object.fromEntries(Object.entries(o).filter(([d]) => d in out.overrides)));
      setMsg("Saved. The booking page is updated.");
    } else setMsg("Could not save. Please sign in again.");
  }

  return (
    <AdminShell title="Slot times" subtitle="Choose the days you take calls and the hours. Calls are fitted back to back, one booking each.">
      {/* what visitors see */}
      <section className="rounded-2xl bg-ink p-4 text-paper sm:p-5 lg:mt-6">
        <p className="text-[14px] font-semibold">Visitors can book next</p>
        {next.length === 0 ? (
          <p className="mt-2 text-[14px] text-slate-light">No open days yet. Turn a day on below.</p>
        ) : (
          <ul className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-0.5 sm:mx-0 sm:flex-wrap sm:px-0">
            {next.map((d) => (
              <li key={d.date} className="shrink-0 rounded-xl bg-white/10 px-3.5 py-2 text-[13px]">
                <span className="font-semibold">{d.short}</span>
                <span className="text-slate-light">
                  {" "}
                  · {d.slots.length} calls, {d.slots[0].label} to {d.slots[d.slots.length - 1].label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* week */}
      <section className="mt-5">
        <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
          <h2 className="text-[19px]">Every week</h2>
          <button type="button" onClick={copyMonday} className="text-[14px] font-semibold underline decoration-slate-light underline-offset-4 hover:text-ink">
            Copy Monday’s hours to all open days
          </button>
        </div>
        <div className="mt-3 grid gap-2.5 md:grid-cols-2 md:gap-3">
          {ORDER.map((d) => (
            <Row key={d} title={DAYS[d]} h={week[d]} len={len} onChange={(h) => setDay(d, h)} />
          ))}
        </div>
      </section>

      {/* one date */}
      <section className="mt-8">
        <h2 className="text-[19px]">A different plan for one date</h2>
        <p className="mt-1 max-w-[60ch] text-[14px] text-slate">Free on a Sunday? Taking a day off? Pick the date and set it just for that day.</p>
        <div className="mt-3 flex gap-2">
          <input type="date" aria-label="Date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className={`${inp} max-w-[14rem]`} />
          <button
            type="button"
            className="min-h-11 shrink-0 rounded-full bg-ink px-5 text-[14px] font-semibold text-paper hover:bg-ink-2 disabled:opacity-40"
            disabled={!newDate || !!over[newDate]}
            onClick={() => {
              const dow = new Date(`${newDate}T00:00:00Z`).getUTCDay();
              setOver((o) => ({ ...o, [newDate]: { ...week[dow] } }));
              setNewDate("");
            }}
          >
            Add date
          </button>
        </div>
        {dates.length > 0 && (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {dates.map((d) => (
              <Row
                key={d}
                title={longDate(d)}
                h={over[d]}
                len={len}
                onChange={(h) => setOver((o) => ({ ...o, [d]: h }))}
                onRemove={() => setOver((o) => Object.fromEntries(Object.entries(o).filter(([k]) => k !== d)))}
              />
            ))}
          </div>
        )}
      </section>

      {/* rules */}
      <section className="mt-8 rounded-2xl border border-line bg-white p-4 sm:p-5">
        <h2 className="text-[19px]">Booking rules</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="text-[14px] font-semibold">
            Call length
            <select value={len} onChange={(e) => setLen(Number(e.target.value))} className={`${inp} mt-1.5`}>
              {LENGTHS.map((n) => (
                <option key={n} value={n}>
                  {n} minutes
                </option>
              ))}
            </select>
          </label>
          <label className="text-[14px] font-semibold">
            Days shown to visitors
            <select value={daysShown} onChange={(e) => setDaysShown(Number(e.target.value))} className={`${inp} mt-1.5`}>
              {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Next {n} open {n === 1 ? "day" : "days"}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[14px] font-semibold">
            Stop bookings
            <select value={notice} onChange={(e) => setNotice(Number(e.target.value))} className={`${inp} mt-1.5`}>
              {[...NOTICE, ...(NOTICE.some(([v]) => v === notice) ? [] : ([[notice, `${notice} minutes before`]] as const))].map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 text-[13px] text-slate">Days that are full or closed are skipped, so visitors always see the next open day.</p>
      </section>

      {/* save */}
      <div className="sticky bottom-[3.75rem] z-20 mt-6 flex items-center gap-3 rounded-2xl border border-line bg-white/95 p-3 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.4)] backdrop-blur lg:bottom-4">
        <button type="button" onClick={save} disabled={busy || !dirty || invalid} className="min-h-12 shrink-0 rounded-full bg-ink px-7 text-[15px] font-semibold text-paper transition-opacity disabled:opacity-40">
          {busy ? "Saving…" : "Save"}
        </button>
        <span className="min-w-0 flex-1 text-[13px] text-slate" role="status">
          {msg && !dirty ? msg : invalid ? "Fix the hours marked in red to save." : dirty ? "You have unsaved changes." : "All changes saved."}
        </span>
      </div>
    </AdminShell>
  );
}
