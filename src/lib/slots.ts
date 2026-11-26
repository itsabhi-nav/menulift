import { bookingConfig as cfg } from "./content";

export type Slot = { time: string; label: string; booked: boolean };
export type Day = { date: string; label: string; short: string; slots: Slot[]; free: number };

const IST_OFFSET_MIN = 330;

/** Date parts in Indian Standard Time, whatever the server's own timezone is. */
export function istParts(ms: number) {
  const d = new Date(ms + IST_OFFSET_MIN * 60000);
  return {
    date: d.toISOString().slice(0, 10),
    minutes: d.getUTCHours() * 60 + d.getUTCMinutes(),
    dow: d.getUTCDay(),
  };
}

export function timeLabel(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export function toTime(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

export type Schedule = {
  /** start times ("HH:MM", IST) for Sunday..Saturday; an empty list means closed that weekday */
  week: string[][];
  /** a specific date replaces its weekday's times; an empty list closes that date */
  overrides: Record<string, string[]>;
  /** how many bookable days the page offers */
  daysShown: number;
  /** a slot closes for booking this many minutes before it starts */
  minLeadMinutes: number;
};

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Every start time between two clock times, `length` minutes long plus `gap` minutes between (all in minutes). */
export function rangeTimes(start: number, end: number, length: number, gap = 0) {
  const out: string[] = [];
  const step = Math.max(5, length + gap);
  for (let m = start; m + length <= end && out.length < 96; m += step) out.push(toTime(m));
  return out;
}

export function defaultSchedule(): Schedule {
  const times = rangeTimes(cfg.startMinutes, cfg.endMinutes, cfg.callMinutes, cfg.bufferMinutes);
  return {
    week: Array.from({ length: 7 }, (_, d) => (cfg.closedWeekdays.includes(d) ? [] : [...times])),
    overrides: {},
    daysShown: cfg.daysShown,
    minLeadMinutes: cfg.minLeadMinutes,
  };
}

const cleanTimes = (v: unknown) =>
  Array.isArray(v)
    ? [...new Set(v.filter((x): x is string => typeof x === "string" && TIME_RE.test(x)))].sort().slice(0, 96)
    : [];

/** Accepts anything (stored JSON, form input) and returns a safe, complete schedule. */
export function normalizeSchedule(raw: unknown): Schedule {
  const base = defaultSchedule();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<Schedule>;
  const week = Array.isArray(r.week) && r.week.length === 7 ? r.week.map(cleanTimes) : base.week;
  const overrides: Record<string, string[]> = {};
  if (r.overrides && typeof r.overrides === "object") {
    for (const [d, t] of Object.entries(r.overrides).slice(0, 400)) if (DATE_RE.test(d)) overrides[d] = cleanTimes(t);
  }
  const n = (v: unknown, lo: number, hi: number, d: number) =>
    typeof v === "number" && Number.isFinite(v) ? Math.min(hi, Math.max(lo, Math.round(v))) : d;
  return {
    week,
    overrides,
    daysShown: n(r.daysShown, 1, 14, base.daysShown),
    minLeadMinutes: n(r.minLeadMinutes, 0, 1440, base.minLeadMinutes),
  };
}

function minutesOf(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function addDays(date: string, n: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function dayLabels(date: string, today: string) {
  const d = new Date(`${date}T00:00:00Z`);
  const wk = d.toLocaleDateString("en-IN", { weekday: "short", timeZone: "UTC" });
  const dm = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
  const longWk = d.toLocaleDateString("en-IN", { weekday: "long", timeZone: "UTC" });
  const tomorrow = addDays(today, 1);
  return {
    label: `${longWk}, ${dm}`,
    short: date === today ? "Today" : date === tomorrow ? "Tomorrow" : `${wk} ${dm}`,
  };
}

/**
 * The next days that still have a free slot, each slot marked booked or free.
 * A day that is completely booked is skipped, so the list simply moves on to the next open date.
 * `booked` holds "YYYY-MM-DD|HH:MM" keys.
 */
export function buildDays(booked: Set<string>, schedule: Schedule, nowMs = Date.now()): Day[] {
  const now = istParts(nowMs);
  const days: Day[] = [];
  for (let i = 0; i < 730 && days.length < schedule.daysShown; i++) {
    const date = addDays(now.date, i);
    const dow = new Date(`${date}T00:00:00Z`).getUTCDay();
    const times = schedule.overrides[date] ?? schedule.week[dow] ?? [];
    const open = times.filter((t) => i > 0 || minutesOf(t) >= now.minutes + schedule.minLeadMinutes);
    if (!open.length) continue;
    const slots = open.map((t) => ({
      time: t,
      label: timeLabel(minutesOf(t)),
      booked: booked.has(`${date}|${t}`),
    }));
    const free = slots.filter((x) => !x.booked).length;
    if (!free) continue;
    days.push({ date, ...dayLabels(date, now.date), slots, free });
  }
  return days;
}
