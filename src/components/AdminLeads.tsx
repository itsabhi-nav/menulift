"use client";

import { useEffect, useRef, useState } from "react";
import type { Lead, LeadStatus } from "@/lib/store";
import { timeLabel } from "@/lib/slots";
import { AdminShell } from "./AdminShell";

const STATUSES: LeadStatus[] = ["new", "contacted", "showed", "paid", "closed", "cancelled"];
const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  showed: "Call done",
  paid: "Paid",
  closed: "Closed",
  cancelled: "Cancelled",
};
const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-accent/25 text-ink",
  contacted: "bg-ink/10 text-ink",
  showed: "bg-live/20 text-ink",
  paid: "bg-live text-ink",
  closed: "bg-slate/15 text-slate",
  cancelled: "bg-danger/15 text-danger-deep",
};
const TYPE = {
  booking: { label: "Booked call", dot: "bg-ink text-accent" },
  quiz: { label: "Quiz", dot: "bg-accent text-ink" },
  partner: { label: "Partner", dot: "bg-live text-ink" },
} as const;

const IST = "Asia/Kolkata";
const ymd = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: IST });

function slotParts(l: Lead) {
  if (!l.slot) return null;
  const [h, m] = l.slot.time.split(":").map(Number);
  const d = new Date(`${l.slot.date}T00:00:00Z`);
  const today = ymd(new Date());
  const tomorrow = ymd(new Date(Date.now() + 86400000));
  const day =
    l.slot.date === today
      ? "Today"
      : l.slot.date === tomorrow
        ? "Tomorrow"
        : d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  return { day, time: timeLabel(h * 60 + m) };
}

function ago(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: IST });
}

const Phone = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
const Chat = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
  </svg>
);

type Props = {
  rows: Lead[];
  total: number;
  page: number;
  pageSize: number;
  type: "all" | "booking" | "quiz" | "partner";
  status: LeadStatus | "all";
  q: string;
  upcoming: Lead[];
  counts: Partial<Record<string, number>>;
  newCount: number;
};

type Data = { rows: Lead[]; total: number; upcoming: Lead[]; counts: Partial<Record<string, number>>; newCount: number };

export function AdminLeads({ rows, total, page: page0, pageSize, type: type0, status: status0, q: q0, upcoming, counts, newCount }: Props) {
  const [data, setData] = useState<Data>({ rows, total, upcoming, counts, newCount });
  const [type, setType] = useState(type0);
  const [status, setStatus] = useState(status0);
  const [q, setQ] = useState(q0);
  const [dq, setDq] = useState(q0);
  const [page, setPage] = useState(page0);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [saved, setSaved] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const first = useRef(true);
  const leads = data.rows;
  const pages = Math.max(1, Math.ceil(data.total / pageSize));
  const all = Object.values(data.counts).reduce<number>((x, y) => x + (y ?? 0), 0);
  const todays = data.upcoming.filter((l) => l.slot?.date === ymd(new Date())).length;

  const query = (o: { t?: string; s?: string; p?: number; text?: string } = {}) => {
    const sp = new URLSearchParams();
    const t = o.t ?? type;
    const s = o.s ?? status;
    const text = o.text ?? dq;
    if (t !== "all") sp.set("type", t);
    if (s !== "all") sp.set("status", s);
    if (text) sp.set("q", text);
    if ((o.p ?? page) > 1) sp.set("page", String(o.p ?? page));
    return sp.toString();
  };

  // wait a moment after typing before searching
  useEffect(() => {
    const id = setTimeout(() => {
      if (q.trim() !== dq) {
        setDq(q.trim());
        setPage(1);
      }
    }, 280);
    return () => clearTimeout(id);
  }, [q, dq]);

  // reload the list whenever a filter changes, without leaving the page
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const ctl = new AbortController();
    setBusy(true);
    setFailed(false);
    const qs = query();
    window.history.replaceState(null, "", qs ? `/admin?${qs}` : "/admin");
    fetch(`/api/admin/leads?${qs}`, { signal: ctl.signal })
      .then((r) => {
        if (r.status === 401) {
          location.assign("/admin");
          throw new Error("signed out");
        }
        return r.json() as Promise<Data>;
      })
      .then((d) => {
        setData(d);
        setBusy(false);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setFailed(true);
        setBusy(false);
      });
    return () => ctl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, status, dq, page]);

  // new enquiries show up by themselves: when you come back to this tab, and every 45 seconds while it is open
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      fetch(`/api/admin/leads?${query()}`)
        .then((r) => (r.ok ? (r.json() as Promise<Data>) : Promise.reject()))
        .then((d) => setData((cur) => (JSON.stringify(cur.rows.map((l) => l.id + l.status)) === JSON.stringify(d.rows.map((l) => l.id + l.status)) && cur.newCount === d.newCount ? cur : d)))
        .catch(() => {});
    };
    const id = setInterval(refresh, 45000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, status, dq, page]);

  const pick = (o: { t?: string; s?: string }) => {
    if (o.t !== undefined) setType(o.t as Props["type"]);
    if (o.s !== undefined) setStatus(o.s as Props["status"]);
    setPage(1);
  };

  async function save(id: string, patch: Partial<Lead>) {
    const lead = leads.find((l) => l.id === id)!;
    setData((d) => ({ ...d, rows: d.rows.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
    const res = await fetch("/api/admin/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status: patch.status ?? lead.status, note: patch.note ?? lead.note }),
    });
    setSaved(res.ok ? "Saved" : "Could not save");
    setTimeout(() => setSaved(""), 1600);
    if (res.ok && patch.status) {
      // keep the row where it is, only refresh the numbers at the top
      fetch(`/api/admin/leads?${query()}`)
        .then((r) => r.json() as Promise<Data>)
        .then((d) => setData((cur) => ({ ...cur, counts: d.counts, newCount: d.newCount, upcoming: d.upcoming })))
        .catch(() => {});
    }
  }

  const stats: { label: string; value: number; go?: () => void; hot?: boolean }[] = [
    { label: "Need a reply", value: data.newCount, go: () => pick({ s: "new", t: "all" }), hot: data.newCount > 0 },
    { label: "Calls today", value: todays },
    { label: "Upcoming calls", value: data.upcoming.length },
  ];

  return (
    <AdminShell
      title="Enquiries"
      subtitle="Everyone who booked a call, took the quiz or applied as a partner."
      actions={saved ? <span className="text-[13px] font-semibold text-slate" role="status">{saved}</span> : undefined}
    >
      {/* stats */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:mt-6">
        {stats.map((s) => {
          const cls = `rounded-2xl border p-3.5 text-left transition-colors sm:p-5 ${s.hot ? "border-accent bg-accent/15" : "border-line bg-white"} ${s.go ? "hover:border-ink active:scale-[0.99]" : ""}`;
          const inner = (
            <>
              <p className="text-[12px] font-medium leading-tight text-slate sm:text-[13px]">{s.label}</p>
              <p className="mt-1.5 font-display text-[32px] leading-none sm:text-[40px]">{s.value}</p>
            </>
          );
          return s.go ? (
            <button key={s.label} type="button" onClick={s.go} className={cls}>
              {inner}
            </button>
          ) : (
            <div key={s.label} className={cls}>
              {inner}
            </div>
          );
        })}
      </div>

      {/* upcoming calls */}
      {data.upcoming.length > 0 && (
        <section className="mt-8">
          <h2 className="text-[18px]">Calls coming up</h2>
          <ul className="-mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {data.upcoming.slice(0, 6).map((l) => {
              const sp = slotParts(l)!;
              return (
                <li key={l.id} className="w-[78%] shrink-0 snap-start rounded-2xl bg-ink p-4 text-paper sm:w-auto">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-display text-[24px] leading-none" suppressHydrationWarning>
                      {sp.time}
                    </p>
                    <p className="text-[13px] font-semibold text-accent" suppressHydrationWarning>
                      {sp.day}
                    </p>
                  </div>
                  <p className="mt-3 truncate text-[15px] font-semibold">{l.name || "No name"}</p>
                  <p className="text-[13px] text-slate-light">
                    {l.channel || "Call"}
                    {l.goLive ? ` · go-live ${l.goLive.toLowerCase()}` : ""}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <a href={`tel:+91${l.phone}`} className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-white/15 text-[13px] font-semibold hover:bg-white/25">
                      <Phone /> Call
                    </a>
                    <a
                      href={`https://wa.me/91${l.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-accent text-[13px] font-semibold text-ink hover:bg-accent-deep"
                    >
                      <Chat /> WhatsApp
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* filters */}
      <section className="mt-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {(
              [
                ["all", "All", all],
                ["booking", "Booked calls", data.counts.booking ?? 0],
                ["quiz", "Quiz", data.counts.quiz ?? 0],
                ["partner", "Partners", data.counts.partner ?? 0],
              ] as const
            ).map(([t, label, n]) => (
              <button
                key={t}
                type="button"
                aria-pressed={type === t}
                onClick={() => pick({ t })}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${
                  type === t ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink"
                }`}
              >
                {label}
                <span className={`rounded-full px-1.5 text-[12px] ${type === t ? "bg-white/20" : "bg-paper-2 text-slate"}`}>{n}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              aria-label="Search enquiries"
              className="min-h-11 min-w-0 flex-1 rounded-full border border-line bg-white px-4 text-[15px] outline-none focus:border-ink lg:w-64 lg:flex-none"
            />
            <div className="relative shrink-0">
              <select
                value={status}
                onChange={(e) => pick({ s: e.target.value })}
                aria-label="Filter by status"
                className="min-h-11 appearance-none rounded-full border border-line bg-white py-0 pl-4 pr-9 text-[14px] font-semibold outline-none focus:border-ink"
              >
                <option value="all">Any status</option>
                {STATUSES.map((x) => (
                  <option key={x} value={x}>
                    {STATUS_LABEL[x]}
                  </option>
                ))}
              </select>
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

      </section>

      {/* list */}
      {failed && (
        <p role="alert" className="mt-5 rounded-xl bg-danger/10 px-4 py-3 text-[14px] font-semibold text-danger-deep">
          Could not load. Check your connection and try a filter again.
        </p>
      )}
      <ul className={`mt-5 space-y-3 transition-opacity ${busy ? "opacity-50" : ""}`} aria-busy={busy}>
        {leads.length === 0 && (
          <li className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
            <p className="font-display text-[22px]">{dq || status !== "all" || type !== "all" ? "No matches" : "Nothing here yet"}</p>
            <p className="mt-1 text-[14px] text-slate">{dq || status !== "all" || type !== "all" ? "Try a different filter or clear the search." : "New bookings and quiz results show up here the moment they come in."}</p>
          </li>
        )}
        {leads.map((l) => {
          const sp = slotParts(l);
          const isOpen = open === l.id || !!l.note;
          const chips = [
            l.goLive && `Go-live: ${l.goLive}`,
            l.budget && `Budget: ${l.budget}`,
            l.kitchen && `${l.type === "partner" ? "Business" : "Kitchen"}: ${l.kitchen}`,
            l.score !== undefined && `Score ${l.score}/100`,
          ].filter(Boolean) as string[];
          return (
            <li key={l.id} className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-[18px] ${TYPE[l.type].dot}`} aria-hidden>
                  {(l.name || "?").trim().charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="truncate text-[17px] font-semibold">{l.name || "No name"}</p>
                    <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[12px] font-medium text-slate">{TYPE[l.type].label}</span>
                  </div>
                  <p className="mt-0.5 text-[14px] text-slate">
                    <span className="font-medium text-ink">{l.phone}</span> ·{" "}
                    <span suppressHydrationWarning>{ago(l.createdAt)}</span>
                  </p>
                </div>
                <div className="hidden shrink-0 gap-2 sm:flex">
                  <a href={`tel:+91${l.phone}`} aria-label={`Call ${l.name}`} className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-ink">
                    <Phone />
                  </a>
                  <a
                    href={`https://wa.me/91${l.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${l.name}`}
                    className="grid h-10 w-10 place-items-center rounded-full bg-accent hover:bg-accent-deep"
                  >
                    <Chat />
                  </a>
                </div>
              </div>

              {sp && (
                <p className="mt-3 inline-flex flex-wrap items-center gap-x-2 rounded-xl bg-ink px-3.5 py-2 text-[14px] font-semibold text-paper">
                  <span className="text-accent" suppressHydrationWarning>
                    {sp.day}
                  </span>
                  <span>{sp.time}</span>
                  {l.channel && <span className="font-normal text-slate-light">· {l.channel}</span>}
                </p>
              )}

              {chips.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {chips.map((c) => (
                    <span key={c} className="rounded-full bg-paper px-3 py-1 text-[13px] text-slate">
                      {c}
                    </span>
                  ))}
                </div>
              )}
              {l.missing && l.missing.length > 0 && (
                <p className="mt-3 text-[13px] text-slate">
                  <span className="font-semibold text-ink">Missing:</span> {l.missing.join(", ")}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                <label className="sr-only" htmlFor={`st-${l.id}`}>
                  Status
                </label>
                <select
                  id={`st-${l.id}`}
                  value={l.status}
                  onChange={(e) => save(l.id, { status: e.target.value as LeadStatus })}
                  className={`min-h-10 appearance-none rounded-full border-0 px-4 text-[14px] font-semibold outline-none ${STATUS_STYLE[l.status]}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setOpen(open === l.id ? null : l.id)}
                  className="min-h-10 rounded-full px-3 text-[14px] font-semibold text-slate hover:text-ink"
                >
                  {isOpen ? "Hide notes" : "Add note"}
                </button>
                <div className="ml-auto flex gap-2 sm:hidden">
                  <a href={`tel:+91${l.phone}`} aria-label={`Call ${l.name}`} className="grid h-10 w-10 place-items-center rounded-full border border-line">
                    <Phone />
                  </a>
                  <a
                    href={`https://wa.me/91${l.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${l.name}`}
                    className="grid h-10 w-10 place-items-center rounded-full bg-accent"
                  >
                    <Chat />
                  </a>
                </div>
              </div>
              {isOpen && (
                <textarea
                  defaultValue={l.note}
                  onBlur={(e) => e.target.value !== l.note && save(l.id, { note: e.target.value })}
                  placeholder="Call notes, e.g. needs FSSAI first, call back Tuesday"
                  rows={2}
                  className="mt-3 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-[14px] outline-none focus:border-ink"
                />
              )}
            </li>
          );
        })}
      </ul>

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-between text-[14px]">
          <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-full border border-line bg-white px-4 py-2 font-semibold disabled:opacity-40">
            ← Newer
          </button>
          <span className="text-slate">
            Page {page} of {pages} · {data.total} total
          </span>
          <button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded-full border border-line bg-white px-4 py-2 font-semibold disabled:opacity-40">
            Older →
          </button>
        </div>
      )}
    </AdminShell>
  );
}
