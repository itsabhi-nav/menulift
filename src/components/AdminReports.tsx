"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Lead, LeadStatus } from "@/lib/store";
import { timeLabel } from "@/lib/slots";
import { AdminShell } from "./AdminShell";

type Kind = "day" | "week" | "month" | "year" | "all";
type Kinds = "all" | "booking" | "quiz" | "partner";

const IST = "Asia/Kolkata";
const ymd = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: IST });
const utc = (s: string) => new Date(`${s}T00:00:00Z`);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const add = (s: string, n: number) => {
  const d = utc(s);
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
};
const fmt = (s: string, o: Intl.DateTimeFormatOptions) => utc(s).toLocaleDateString("en-IN", { timeZone: "UTC", ...o });

const KINDS: { id: Kind; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
  { id: "all", label: "All" },
];
const TYPES: { id: Kinds; label: string }[] = [
  { id: "all", label: "Everyone" },
  { id: "booking", label: "Booked calls" },
  { id: "quiz", label: "Quiz" },
  { id: "partner", label: "Partners" },
];
const TYPE_LABEL = { booking: "Booked call", quiz: "Quiz", partner: "Partner" } as const;
const STATUS_LABEL: Record<LeadStatus, string> = { new: "New", contacted: "Contacted", showed: "Call done", paid: "Paid", closed: "Closed", cancelled: "Cancelled" };

/** First and last day of the chosen period, containing `anchor`. */
function range(kind: Kind, a: string): { from: string; to: string } | null {
  if (kind === "all") return null;
  if (kind === "day") return { from: a, to: a };
  if (kind === "week") {
    const mon = add(a, -((utc(a).getUTCDay() + 6) % 7));
    return { from: mon, to: add(mon, 6) };
  }
  const d = utc(a);
  if (kind === "month") return { from: iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))), to: iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0))) };
  return { from: `${d.getUTCFullYear()}-01-01`, to: `${d.getUTCFullYear()}-12-31` };
}

function step(kind: Kind, a: string, dir: 1 | -1): string {
  if (kind === "day") return add(a, dir);
  if (kind === "week") return add(a, 7 * dir);
  const d = utc(a);
  if (kind === "month") return iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + dir, 1)));
  return iso(new Date(Date.UTC(d.getUTCFullYear() + dir, 0, 1)));
}

/** Heading and a smaller line under it, e.g. "This week" over "23 to 29 Nov 2026". */
function label(kind: Kind, a: string, today: string): [string, string] {
  const r = range(kind, a);
  if (!r) return ["All time", "Every enquiry so far"];
  const now = r.from <= today && today <= r.to;
  if (kind === "day") return now ? ["Today", fmt(a, { weekday: "long", day: "numeric", month: "short", year: "numeric" })] : [fmt(a, { weekday: "long" }), fmt(a, { day: "numeric", month: "short", year: "numeric" })];
  if (kind === "week") {
    const same = r.from.slice(0, 7) === r.to.slice(0, 7);
    const text = `${fmt(r.from, { day: "numeric", ...(same ? {} : { month: "short" }) })} to ${fmt(r.to, { day: "numeric", month: "short", year: "numeric" })}`;
    return now ? ["This week", text] : [text, ""];
  }
  if (kind === "month") return now ? ["This month", fmt(a, { month: "long", year: "numeric" })] : [fmt(a, { month: "long", year: "numeric" }), ""];
  return now ? ["This year", a.slice(0, 4)] : [a.slice(0, 4), ""];
}

const safe = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stops a spreadsheet running text as a formula
  return `"${s.replace(/"/g, '""')}"`;
};

function toCsv(rows: Lead[]) {
  const head = ["Received", "Type", "Name", "Phone", "Status", "Call date", "Call time", "Channel", "Go-live", "Budget", "Kitchen", "Score", "Source", "Campaign", "Note"];
  const lines = rows.map((l) =>
    [
      new Date(l.createdAt).toLocaleString("en-IN", { timeZone: IST, dateStyle: "medium", timeStyle: "short" }),
      TYPE_LABEL[l.type],
      l.name,
      l.phone,
      STATUS_LABEL[l.status],
      l.slot?.date,
      l.slot ? timeLabel(Number(l.slot.time.slice(0, 2)) * 60 + Number(l.slot.time.slice(3, 5))) : "",
      l.channel,
      l.goLive,
      l.budget,
      l.kitchen,
      l.score,
      l.source,
      l.utm?.utm_campaign,
      l.note,
    ]
      .map(safe)
      .join(","),
  );
  return "﻿" + [head.map(safe).join(","), ...lines].join("\r\n");
}

const received = (iso: string) => new Date(iso).toLocaleString("en-IN", { timeZone: IST, day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const callSlot = (l: Lead) => (l.slot ? `${fmt(l.slot.date, { day: "numeric", month: "short" })}, ${timeLabel(Number(l.slot.time.slice(0, 2)) * 60 + Number(l.slot.time.slice(3, 5)))}` : "");

const seg = (on: boolean) =>
  `min-h-10 rounded-full px-1 text-[14px] sm:px-4 font-semibold transition-colors ${on ? "bg-ink text-paper" : "text-slate hover:text-ink"}`;

export function AdminReports() {
  const today = ymd(new Date());
  const [kind, setKind] = useState<Kind>("week");
  const [anchor, setAnchor] = useState(today);
  const [type, setType] = useState<Kinds>("all");
  const [rows, setRows] = useState<Lead[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [off, setOff] = useState<Set<string>>(new Set()); // ticked off; everything is selected unless listed here
  const [limit, setLimit] = useState(50);
  const head = useRef<HTMLInputElement>(null);

  // changing the period clears the list straight away, so old numbers never sit under a new heading
  const change = (k: Kind, a: string) => {
    setKind(k);
    setAnchor(a);
    setRows(null);
    setFailed(false);
    setOff(new Set());
    setLimit(50);
  };

  const r = range(kind, anchor);
  const [title, sub] = label(kind, anchor, today);
  const atNow = !r || (r.from <= today && today <= r.to);

  useEffect(() => {
    const ctl = new AbortController();
    const qs = r ? `?from=${r.from}&to=${r.to}` : "";
    fetch(`/api/admin/report${qs}`, { signal: ctl.signal })
      .then((x) => {
        if (x.status === 401) {
          location.assign("/admin");
          throw new Error("signed out");
        }
        return x.json() as Promise<{ rows: Lead[] }>;
      })
      .then((d) => setRows(d.rows))
      .catch((e) => e?.name !== "AbortError" && setFailed(true));
    return () => ctl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, anchor]);

  const shown = useMemo(() => (rows ?? []).filter((l) => type === "all" || l.type === type), [rows, type]);
  const picked = shown.filter((l) => !off.has(l.id));
  const allOn = shown.length > 0 && picked.length === shown.length;
  const some = picked.length > 0 && !allOn;
  useEffect(() => {
    if (head.current) head.current.indeterminate = some;
  }, [some]);

  const toggle = (id: string) =>
    setOff((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const toggleAll = () => setOff(allOn ? new Set(shown.map((l) => l.id)) : new Set());

  const count = (t: Lead["type"]) => (rows ?? []).filter((l) => l.type === t).length;

  function download() {
    const name = r ? (r.from === r.to ? r.from : `${r.from}_to_${r.to}`) : "all-time";
    const url = URL.createObjectURL(new Blob([toCsv(picked)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `menulift-enquiries-${name}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const box = "h-5 w-5 shrink-0 cursor-pointer accent-[var(--ink)]";
  const visible = shown.slice(0, limit);
  const more = shown.length - visible.length;

  return (
    <AdminShell title="Reports" subtitle="Choose a period, tick the people you want, and download them.">
      {/* period */}
      <section className="rounded-2xl border border-line bg-white p-2.5 sm:p-4 lg:mt-6">
        <div className="grid grid-cols-5 gap-1" role="tablist" aria-label="Period">
          {KINDS.map((k) => (
            <button key={k.id} type="button" role="tab" aria-selected={kind === k.id} onClick={() => change(k.id, today)} className={seg(kind === k.id)}>
              {k.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-paper px-1.5 py-1">
          <button
            type="button"
            aria-label="Previous"
            disabled={kind === "all"}
            onClick={() => change(kind, step(kind, anchor, -1))}
            className="grid h-10 w-10 place-items-center rounded-full text-[20px] hover:bg-white disabled:opacity-30"
          >
            ‹
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-[15px] font-semibold">{title}</p>
            {sub && <p className="truncate text-[12px] text-slate">{sub}</p>}
          </div>
          <button
            type="button"
            aria-label="Next"
            disabled={atNow}
            onClick={() => change(kind, step(kind, anchor, 1))}
            className="grid h-10 w-10 place-items-center rounded-full text-[20px] hover:bg-white disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </section>

      {/* who */}
      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {TYPES.map((t) => {
          const n = t.id === "all" ? (rows?.length ?? 0) : count(t.id);
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={type === t.id}
              onClick={() => {
                setType(t.id);
                setLimit(50);
              }}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${type === t.id ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink"}`}
            >
              {t.label}
              <span className={`rounded-full px-1.5 text-[12px] ${type === t.id ? "bg-white/20" : "bg-paper-2 text-slate"}`}>{rows ? n : "·"}</span>
            </button>
          );
        })}
      </div>

      {/* select + download: always on screen, however long the list is */}
      <div className="sticky top-14 z-20 -mx-4 mt-3 border-b border-line bg-paper/95 px-4 py-2.5 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/95 sm:px-4 lg:top-4">
        <div className="flex items-center gap-3">
          <label className="flex min-h-10 min-w-0 flex-1 cursor-pointer items-center gap-3 text-[14px] font-semibold">
            <input
              ref={head}
              type="checkbox"
              className={box}
              checked={allOn}
              disabled={shown.length === 0}
              onChange={toggleAll}
              aria-label="Select all"
            />
            <span className="min-w-0 truncate" role="status">
              {rows === null ? "Loading…" : shown.length === 0 ? "Nothing here" : allOn ? `All ${shown.length} selected` : `${picked.length} of ${shown.length} selected`}
            </span>
          </label>
          <button
            type="button"
            onClick={download}
            disabled={picked.length === 0}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-paper transition-opacity disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
            </svg>
            Download CSV
          </button>
        </div>
      </div>

      {failed && (
        <p role="alert" className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-[14px] font-semibold text-danger-deep">
          Could not load the report. Check your connection and try again.
        </p>
      )}

      {/* list */}
      <div className={`mt-3 overflow-hidden rounded-2xl border border-line bg-white ${rows === null ? "opacity-60" : ""}`} aria-busy={rows === null}>
        {rows === null && !failed && <div className="h-40 animate-pulse bg-paper-2" aria-hidden />}
        {rows !== null && shown.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-display text-[22px]">No enquiries in this period</p>
            <p className="mt-1 text-[14px] text-slate">Try another week or month, or pick All.</p>
          </div>
        )}
        {shown.length > 0 && (
          <>
            {/* desktop table */}
            <table className="hidden w-full text-left text-[14px] md:table">
              <thead className="bg-paper text-[13px] text-slate">
                <tr>
                  <th className="w-12 py-3 pl-4"><span className="sr-only">Select</span></th>
                  <th className="py-3 font-medium">Name</th>
                  <th className="py-3 font-medium">Phone</th>
                  <th className="py-3 font-medium">Type</th>
                  <th className="py-3 font-medium">Call</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((l) => (
                  <tr key={l.id} className="border-t border-line hover:bg-paper/60">
                    <td className="py-3 pl-4">
                      <input type="checkbox" className={box} checked={!off.has(l.id)} onChange={() => toggle(l.id)} aria-label={`Select ${l.name || l.phone}`} />
                    </td>
                    <td className="py-3 pr-3 font-semibold">{l.name || "No name"}</td>
                    <td className="py-3 pr-3">{l.phone}</td>
                    <td className="py-3 pr-3 text-slate">{TYPE_LABEL[l.type]}</td>
                    <td className="py-3 pr-3">{callSlot(l) || <span className="text-slate">None</span>}</td>
                    <td className="py-3 pr-3">{STATUS_LABEL[l.status]}</td>
                    <td className="py-3 pr-4 text-slate">{received(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* phone cards */}
            <ul className="md:hidden">
              {visible.map((l, i) => (
                <li key={l.id} className={i ? "border-t border-line" : ""}>
                  <label className="flex cursor-pointer items-start gap-3 px-4 py-3.5 active:bg-paper">
                    <input type="checkbox" className={`${box} mt-1`} checked={!off.has(l.id)} onChange={() => toggle(l.id)} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-[16px] font-semibold">{l.name || "No name"}</span>
                        <span className="shrink-0 text-[12px] text-slate">{received(l.createdAt)}</span>
                      </span>
                      <span className="mt-0.5 block text-[14px] text-slate">
                        {l.phone} · {TYPE_LABEL[l.type]} · {STATUS_LABEL[l.status]}
                      </span>
                      {l.slot && <span className="mt-1 block text-[13px] font-medium">Call: {callSlot(l)}</span>}
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            {more > 0 && (
              <button type="button" onClick={() => setLimit((n) => n + 100)} className="w-full border-t border-line py-3.5 text-[14px] font-semibold hover:bg-paper">
                Show {Math.min(100, more)} more
              </button>
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
}
