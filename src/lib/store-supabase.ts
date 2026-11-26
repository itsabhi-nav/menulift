import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { fromRow, type Backend, type Lead, type LeadStatus, type LeadType, type ListOpts, type Row } from "./store-types";

const g = globalThis as unknown as { __mlSupabase?: SupabaseClient };

function client() {
  if (g.__mlSupabase) return g.__mlSupabase;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase URL and key are required");
  g.__mlSupabase = createClient(url.replace(/\/rest\/v1\/?$/, ""), key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return g.__mlSupabase;
}

function row(l: Lead): Record<string, unknown> {
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

function applyFilters(query: ReturnType<SupabaseClient["from"]>, opts: ListOpts) {
  let q = query.select("*", { count: "exact" });
  if (opts.type) q = q.eq("type", opts.type);
  if (opts.status) q = q.eq("status", opts.status);
  if (opts.q) {
    const search = opts.q.replaceAll(",", " ").replaceAll(".", " ").slice(0, 60);
    q = q.or(`name.ilike.%${search}%,phone.ilike.%${search}%,kitchen.ilike.%${search}%,note.ilike.%${search}%`);
  }
  return q;
}

export const supabase: Backend = {
  async bookedKeysFrom(fromDate) {
    const { data, error } = await client()
      .from("leads")
      .select("slot_date,slot_time")
      .eq("type", "booking")
      .neq("status", "cancelled")
      .gte("slot_date", fromDate);
    if (error) throw error;
    return new Set(
      (data ?? []).map((r) => `${r.slot_date as string}|${r.slot_time as string}`),
    );
  },

  async tryBook(lead) {
    const { error } = await client().from("leads").insert(row(lead));
    if (!error) return true;
    if (error.code === "23505") return false;
    throw error;
  },

  async addLead(lead) {
    const { error } = await client().from("leads").insert(row(lead));
    if (error) throw error;
  },

  async listLeads(opts) {
    let query = applyFilters(client().from("leads"), opts)
      .order("created_at", { ascending: false })
      .range(opts.offset, opts.offset + opts.limit - 1);
    const { data, error, count } = await query;
    if (error) throw error;
    return { rows: (data as Row[]).map(fromRow), total: count ?? 0 };
  },

  async upcomingBookings(fromDate) {
    const { data, error } = await client()
      .from("leads")
      .select("*")
      .eq("type", "booking")
      .neq("status", "cancelled")
      .gte("slot_date", fromDate)
      .order("slot_date", { ascending: true })
      .order("slot_time", { ascending: true })
      .limit(100);
    if (error) throw error;
    return (data as Row[]).map(fromRow);
  },

  async updateLead(id, patch) {
    const current = await client().from("leads").select("status,note").eq("id", id).maybeSingle();
    if (current.error) throw current.error;
    if (!current.data) return;
    const { error } = await client()
      .from("leads")
      .update({ status: patch.status ?? current.data.status, note: patch.note ?? current.data.note })
      .eq("id", id);
    if (error) throw error;
  },

  async batch(after, size) {
    const { data, error } = await client()
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .range(after, after + size - 1);
    if (error) throw error;
    return (data as Row[]).map(fromRow);
  },

  async counts() {
    const { data, error } = await client().from("leads").select("type");
    if (error) throw error;
    const counts: Partial<Record<LeadType, number>> = {};
    for (const row of data ?? []) {
      const type = row.type as LeadType;
      counts[type] = (counts[type] ?? 0) + 1;
    }
    return counts;
  },

  async getSetting(key) {
    const { data, error } = await client().from("settings").select("value").eq("key", key).maybeSingle();
    if (error) throw error;
    return data?.value ?? null;
  },

  async setSetting(key, value) {
    const { error } = await client().from("settings").upsert({ key, value }, { onConflict: "key" });
    if (error) throw error;
  },
};
