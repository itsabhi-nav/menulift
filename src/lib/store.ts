import { normalizeSchedule, type Schedule } from "./slots";
import type { Backend, Lead, LeadStatus, LeadType, ListOpts, PersonalSettings } from "./store-types";
export type { Lead, LeadStatus, LeadType, PersonalSettings } from "./store-types";

/**
 * One entry point for storage. DATABASE_URL set -> Postgres, otherwise a local SQLite file.
 * (see store-sqlite.ts and store-pg.ts; both keep the one-slot-one-booking rule in the database itself)
 */
let backend: Promise<Backend> | undefined;
function be() {
  backend ??= process.env.DATABASE_URL
    ? import("./store-pg").then((m) => m.postgres)
    : import("./store-sqlite").then((m) => m.sqlite);
  return backend;
}

export const storageKind = () => (process.env.DATABASE_URL ? "postgres" : "sqlite");

/** "YYYY-MM-DD|HH:MM" for every slot already taken from `fromDate` on. */
export const bookedKeysFrom = async (fromDate: string) => (await be()).bookedKeysFrom(fromDate);
/** Saves a booking. Returns false when someone else already holds that slot. */
export const tryBook = async (lead: Lead) => (await be()).tryBook(lead);
export const addLead = async (lead: Lead) => (await be()).addLead(lead);
export const listLeads = async (opts: ListOpts) => (await be()).listLeads(opts);
export const upcomingBookings = async (fromDate: string) => (await be()).upcomingBookings(fromDate);
export const updateLead = async (id: string, patch: { status?: LeadStatus; note?: string }) => (await be()).updateLead(id, patch);
export const counts = async (): Promise<Partial<Record<LeadType, number>>> => (await be()).counts();

export async function* iterateLeads() {
  const b = await be();
  for (let off = 0; ; off += 1000) {
    const rows = await b.batch(off, 1000);
    for (const r of rows) yield r;
    if (rows.length < 1000) break;
  }
}

const SCHEDULE_KEY = "schedule";
/** The slot schedule the admin configured (or the default one). */
export async function getSchedule(): Promise<Schedule> {
  const raw = await (await be()).getSetting(SCHEDULE_KEY);
  try {
    return normalizeSchedule(raw ? JSON.parse(raw) : null);
  } catch {
    return normalizeSchedule(null);
  }
}
export async function saveSchedule(input: unknown) {
  const s = normalizeSchedule(input);
  await (await be()).setSetting(SCHEDULE_KEY, JSON.stringify(s));
  return s;
}

const PERSONAL_KEY = "personal_settings";
export const defaultPersonalSettings: PersonalSettings = {
  founderName: "Anshuman",
  founderRole: "Founder of Menulift",
  founderPhoto: "/photos/founder.jpg",
  email: "hello@menulift.in",
  phoneDisplay: "+91 98765 43210",
  whatsappNumber: "919876543210",
  linkedin: "",
  instagram: "",
  youtube: "",
  facebook: "",
};

export async function getPersonalSettings(): Promise<PersonalSettings> {
  const raw = await (await be()).getSetting(PERSONAL_KEY);
  if (!raw) return defaultPersonalSettings;
  try {
    return { ...defaultPersonalSettings, ...(JSON.parse(raw) as Partial<PersonalSettings>) };
  } catch {
    return defaultPersonalSettings;
  }
}

export async function savePersonalSettings(input: unknown): Promise<PersonalSettings> {
  const r = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const clean = (key: keyof PersonalSettings, max = 300) =>
    typeof r[key] === "string" ? r[key].trim().slice(0, max) : defaultPersonalSettings[key];
  const settings: PersonalSettings = {
    founderName: clean("founderName", 80),
    founderRole: clean("founderRole", 120),
    founderPhoto: clean("founderPhoto", 500),
    email: clean("email", 180),
    phoneDisplay: clean("phoneDisplay", 40),
    whatsappNumber: String(clean("whatsappNumber", 20)).replace(/\D/g, "").slice(-15),
    linkedin: clean("linkedin", 500),
    instagram: clean("instagram", 500),
    youtube: clean("youtube", 500),
    facebook: clean("facebook", 500),
  };
  await (await be()).setSetting(PERSONAL_KEY, JSON.stringify(settings));
  return settings;
}
