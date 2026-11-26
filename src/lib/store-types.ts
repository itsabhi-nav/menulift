// Shared shapes and row mapping for every storage backend.
export type LeadStatus = "new" | "contacted" | "showed" | "paid" | "closed" | "cancelled";
export type LeadType = "booking" | "quiz" | "partner";

export type Lead = {
  id: string;
  type: LeadType;
  createdAt: string;
  name: string;
  phone: string; // 10 digits
  status: LeadStatus;
  note: string;
  slot?: { date: string; time: string };
  channel?: string;
  goLive?: string;
  budget?: string;
  kitchen?: string; // for partners: what their business does
  score?: number;
  missing?: string[];
  source?: string;
  utm?: Record<string, string>;
};

export type Row = Record<string, unknown>;

export function fromRow(r: Row): Lead {
  return {
    id: r.id as string,
    type: r.type as LeadType,
    createdAt: r.created_at as string,
    name: (r.name as string) ?? "",
    phone: r.phone as string,
    status: r.status as LeadStatus,
    note: (r.note as string) ?? "",
    slot: r.slot_date ? { date: r.slot_date as string, time: r.slot_time as string } : undefined,
    channel: (r.channel as string) ?? undefined,
    goLive: (r.go_live as string) ?? undefined,
    budget: (r.budget as string) ?? undefined,
    kitchen: (r.kitchen as string) ?? undefined,
    score: (r.score as number) ?? undefined,
    missing: r.missing ? (JSON.parse(r.missing as string) as string[]) : undefined,
    source: (r.source as string) ?? undefined,
    utm: r.utm ? (JSON.parse(r.utm as string) as Record<string, string>) : undefined,
  };
}

export function toParams(l: Lead) {
  return {
    id: l.id,
    type: l.type,
    created_at: l.createdAt,
    name: l.name,
    phone: l.phone,
    status: l.status,
    note: l.note,
    slot_date: l.slot?.date ?? null,
    slot_time: l.slot?.time ?? null,
    channel: l.channel ?? null,
    go_live: l.goLive ?? null,
    budget: l.budget ?? null,
    kitchen: l.kitchen ?? null,
    score: l.score ?? null,
    missing: l.missing ? JSON.stringify(l.missing) : null,
    source: l.source ?? null,
    utm: l.utm ? JSON.stringify(l.utm) : null,
  };
}


export type Page = { rows: Lead[]; total: number };
export type ListOpts = { type?: LeadType; status?: LeadStatus; q?: string; limit: number; offset: number };

export interface Backend {
  bookedKeysFrom(fromDate: string): Promise<Set<string>>;
  tryBook(lead: Lead): Promise<boolean>;
  addLead(lead: Lead): Promise<void>;
  listLeads(opts: ListOpts): Promise<Page>;
  upcomingBookings(fromDate: string): Promise<Lead[]>;
  updateLead(id: string, patch: { status?: LeadStatus; note?: string }): Promise<void>;
  /** all leads, newest first, fetched in batches */
  batch(after: number, size: number): Promise<Lead[]>;
  counts(): Promise<Partial<Record<LeadType, number>>>;
  getSetting(key: string): Promise<string | null>;
  setSetting(key: string, value: string): Promise<void>;
}
